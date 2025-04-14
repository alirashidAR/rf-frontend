"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle } from "lucide-react";
import { Tabs, Button } from 'antd';
import Link from 'next/link';

// Define interfaces for proper type checking
interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  profilePicUrl?: string;
}

interface Faculty {
  user: User;
}

interface Participant {
  user: User;
}

interface Application {
  id: string;
  user: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

interface ProjectCount {
  applications: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  location: string;
  positionsAvailable: number;
  requirements: string[];
  keywords: string[];
  faculty: Faculty;
  participants: Participant[];
  applications: any[];
  isFavorite: boolean;
  _count?: ProjectCount;
}

export default function ProjectPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { role } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      const localToken = localStorage.getItem("token");
      
      if (!localToken) {
        router.push("/login");
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`https://rf-backend-alpha.vercel.app/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
        
        setProject(response.data);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, router]);

  const fetchApplications = async () => {
    const localToken = localStorage.getItem("token");
    
    if (!localToken || !id) return;
    
    try {
      setLoadingApplications(true);
      const response = await axios.get(`https://rf-backend-alpha.vercel.app/api/applications/project/${id}/`, {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      });
      
      setApplications(response.data);
      setShowApplicationsModal(true);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert("Failed to load applications. Please try again.");
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!window.confirm("Are you sure you want to remove this participant from the project?")) {
      return;
    }

    const localToken = localStorage.getItem("token");
    
    try {
      await axios.delete(`https://rf-backend-alpha.vercel.app/api/projects/${id}/participants/${participantId}`, {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      });
      
      // Update local state to reflect the removal
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.filter(p => p.user.id !== participantId)
        };
      });
      
      setShowParticipantModal(false);
      setSelectedParticipant(null);
    } catch (err) {
      console.error("Error removing participant:", err);
      alert("Failed to remove participant. Please try again.");
    }
  };

  const handleApplicationAction = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      return;
    }

    const localToken = localStorage.getItem("token");
    
    try {
      await axios.put(`https://rf-backend-alpha.vercel.app/api/applications/${applicationId}/status`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        }
      );
      
      // Update local state to reflect the status change
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      // If accepted, refresh the project to update participants
      if (status === "ACCEPTED") {
        const response = await axios.get(`https://rf-backend-alpha.vercel.app/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
        
        setProject(response.data);
      }
    } catch (err) {
      console.error(`Error ${status.toLowerCase()} application:`, err);
      alert(`Failed to ${status.toLowerCase()} application. Please try again.`);
    }
  };

  const toggleFavorite = async () => {
    const localToken = localStorage.getItem("token");
    
    if (!localToken || !id || !project) return;
    
    try {
      if (project.isFavorite) {
        // Remove from favorites
        await axios.delete(`https://rf-backend-alpha.vercel.app/api/projects/${id}/favorite`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
      } else {
        // Add to favorites
        await axios.post(`https://rf-backend-alpha.vercel.app/api/projects/${id}/favorite`, {}, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });
      }
      
      // Update local state
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isFavorite: !prev.isFavorite
        };
      });
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Convert backend status to display format
  const normalizeStatus = (status: string) => {
    if (status === "ONGOING") return "Active";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 text-lg">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <p className="text-red-500">{error || "Project not found."}</p>
        <button 
          onClick={() => router.back()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {project.title}{" "}
            <span className={`text-sm px-2 py-1 rounded ${
              normalizeStatus(project.status) === "Active" 
                ? "bg-green-200 text-green-700" 
                : normalizeStatus(project.status) === "Pending" 
                ? "bg-yellow-200 text-yellow-700" 
                : "bg-gray-300 text-gray-700"
            }`}>
              {normalizeStatus(project.status)}
            </span>
          </h1>
          <p className="text-gray-600">
            Led by {project.faculty.user.name} • {project.faculty.user.department}
          </p>
        </div>
        <div className="flex gap-3">
          {/* If current user hasn't applied yet */}
          {role !== "FACULTY" && project.status !== "COMPLETED" && project.applications.length === 0 && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() =>
                router.push(`/admin/USER/others-pages/applications/new-application/${project.id}`)
              }
            >
              Apply Now
            </button>
          )}

          {role !== "FACULTY" && project.status === "COMPLETED" && (
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Applications Closed
            </button>
          )}
          {/* If user already applied */}
          {role !== "FACULTY" && project.applications.length > 0 && (
            <button 
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Already Applied
            </button>
          )}

          {role === "FACULTY" && (
            <button 
              className="border px-4 py-2 rounded hover:bg-gray-100 transition text-gray-500"
              onClick={() => router.push(`/admin/FACULTY/others-pages/forms/form-elements?editId=${project.id}`)}
            >
              Edit Project
            </button>
          )}
          {/* Favorite button */}
          <button 
            className={`border px-4 py-2 rounded hover:bg-gray-100 transition ${
              project.isFavorite ? "bg-yellow-100 text-yellow-700" : "text-gray-500"
            }`}
            onClick={toggleFavorite}
          >
            {project.isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultActiveKey="details"
        items={[
          {
            key: 'details',
            label: 'Project Details',
            children: (
              <div className="grid grid-cols-3 gap-8 mt-6">
                {/* Left Column (2/3 Width) */}
                <div className="col-span-2 space-y-6">
                  {/* Project Overview */}
                  <section>
                    <h2 className="text-lg font-semibold border-b pb-2">Project Overview</h2>
                    <p className="text-gray-600 mt-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.keywords.map((keyword, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Requirements */}
                  <section>
                    <h2 className="text-lg font-semibold border-b pb-2">Requirements</h2>
                    <ul className="list-disc list-inside text-gray-600 mt-3">
                      {project.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Right Column (1/3 Width) */}
                <div className="col-span-1 space-y-6">
                  {/* Sidebar - Project Details */}
                  <aside className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Project Details</h2>
                    <div className="space-y-2">
                      <p><strong>Type:</strong> {project.type.charAt(0) + project.type.slice(1).toLowerCase()}</p>
                      <p><strong>Duration:</strong> {formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                      <p><strong>Location:</strong> {project.location === "ON_CAMPUS" ? "On Campus" : "Remote"}</p>
                      <p><strong>Positions Available:</strong> {project.positionsAvailable}</p>
                    </div>
                  </aside>

                  {/* Faculty Information */}
                  <aside className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Faculty Lead</h2>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        {project.faculty.user.profilePicUrl ? (
                          <Image 
                            src={project.faculty.user.profilePicUrl} 
                            alt={project.faculty.user.name} 
                            width={48} 
                            height={48} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-lg">
                            {project.faculty.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{project.faculty.user.name}</p>
                        <p className="text-sm text-gray-500">{project.faculty.user.department}</p>
                        <p className="text-sm text-gray-500">{project.faculty.user.email}</p>
                      </div>
                    </div>
                  </aside>

                  {/* Application Information */}
                  <aside className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                    <h2 className="text-lg font-semibold mb-3">Application Information</h2>
                    {project.applicationDeadline ? (
                      <>
                        <p className="text-blue-600 font-bold">Deadline: {formatDate(project.applicationDeadline)}</p>
                        <p className="text-gray-500">
                          {Math.max(0, Math.ceil((new Date(project.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days remaining
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600">No application deadline specified</p>
                    )}
                    <p className="mt-2">
                      <strong>Applications:</strong> {project._count?.applications || 0}
                    </p>
                  </aside>

                  {/* Action Buttons for Faculty */}
                  {role === "FACULTY" && (
                    <div className="flex flex-col gap-3">
                      <button 
                        className="border border-blue-500 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition w-full"
                        onClick={() => router.push(`/admin/FACULTY/others-pages/applications/${project.id}`)}
                      >
                        View Applications ({project._count?.applications || 0})
                      </button>
                      <button 
                        className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition w-full"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
                            // Delete project logic here
                            const localToken = localStorage.getItem("token");
                            axios.delete(`https://rf-backend-alpha.vercel.app/api/projects/${id}`, {
                              headers: {
                                Authorization: `Bearer ${localToken}`,
                              },
                            })
                            .then(() => {
                              router.push("/admin/FACULTY/others-pages/blank");
                            })
                            .catch(err => {
                              console.error("Error deleting project:", err);
                              alert("Failed to delete project. Please try again.");
                            });
                          }
                        }}
                      >
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: 'participants',
            label: 'Participants',
            children: (
              <div className="mt-6">
                <section>
                  <h2 className="text-lg font-semibold border-b pb-2 flex justify-between items-center">
                    <span>Project Participants ({project.participants.length})</span>
                    {role === "FACULTY" && (
                      <button 
                        onClick={fetchApplications}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        disabled={loadingApplications}
                      >
                        <PlusCircle size={20} />
                        <span>{loadingApplications ? "Loading..." : "Add Participant"}</span>
                      </button>
                    )}
                  </h2>
                  {project.participants.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      {project.participants.map((participant) => (
                        <div 
                          key={participant.user.id} 
                          className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            setSelectedParticipant(participant.user);
                            setShowParticipantModal(true);
                          }}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                            {participant.user.profilePicUrl ? (
                              <Image 
                                src={participant.user.profilePicUrl} 
                                alt={participant.user.name} 
                                width={40} 
                                height={40} 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                                {participant.user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{participant.user.name}</p>
                            <p className="text-sm text-gray-500">{participant.user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-3">No participants have been added to this project yet.</p>
                  )}
                </section>
              </div>
            ),
          },
          {
            key: 'submissions',
            label: 'Submissions',
            children: (
              <div className="py-4">
                <p>Manage submissions and deadlines for this project</p>
                <div className="mt-4">
                  <Link href={`/admin/FACULTY/others-pages/projects/${project.id}/submissions`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                      View Submissions
                    </button>
                  </Link>
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Participant Detail Modal */}
      {showParticipantModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Participant Details</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowParticipantModal(false);
                  setSelectedParticipant(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                {selectedParticipant.profilePicUrl ? (
                  <Image 
                    src={selectedParticipant.profilePicUrl} 
                    alt={selectedParticipant.name} 
                    width={64} 
                    height={64} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl">
                    {selectedParticipant.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{selectedParticipant.name}</h3>
                <p className="text-gray-600">{selectedParticipant.email}</p>
              </div>
            </div>
            
            {/* Additional participant info could be added here */}
            
            {role === "FACULTY" && (
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={() => handleRemoveParticipant(selectedParticipant.id)}
                >
                  Remove from Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Project Applications</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowApplicationsModal(false);
                }}
              >
                ✕
              </button>
            </div>
            
            {loadingApplications ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-gray-500">No applications have been submitted for this project yet.</p>
            ) : (
              <div className="mt-4">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 rounded-tl-lg">Applicant</th>
                      <th className="px-4 py-2">Submitted</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                              {app.user?.profilePicUrl ? (
                                <Image 
                                  src={app.user.profilePicUrl} 
                                  alt={app.user.name} 
                                  width={40} 
                                  height={40} 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                                  {app.user?.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{app.user?.name}</p>
                              <p className="text-sm text-gray-500">{app.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm px-2 py-1 rounded ${
                            app.status === "ACCEPTED" 
                              ? "bg-green-200 text-green-700" 
                              : app.status === "PENDING" 
                              ? "bg-yellow-200 text-yellow-700" 
                              : "bg-red-200 text-red-700"
                          }`}>
                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {app.status === "PENDING" && (
                            <div className="flex gap-2">
                              <button 
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                onClick={() => handleApplicationAction(app.id, "ACCEPTED")}
                              >
                                Accept
                              </button>
                              <button 
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                onClick={() => handleApplicationAction(app.id, "REJECTED")}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {app.status !== "PENDING" && (
                            <span className="text-gray-500 text-sm">
                              {app.status === "ACCEPTED" ? "Accepted" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

