"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  profilePicUrl?: string;
}

interface Application {
  id: string;
  user: User;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}
interface Faculty {
  user: User;
}

interface Participant {
  user: User;
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

export default function ApplicationsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();
  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://rf-backend-alpha.vercel.app/api/applications/project/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const updateStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://rf-backend-alpha.vercel.app/api/applications/${applicationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );

      if (status === "ACCEPTED") {
        const response = await axios.get(`https://rf-backend-alpha.vercel.app/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProject(response.data);
      }

      
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
    }
  };

  // const handleAccept = (applicationId: string) =>
  //   updateStatus(applicationId, "ACCEPTED");

  // const handleReject = (applicationId: string) =>
  //   updateStatus(applicationId, "REJECTED");

  const handleViewProfile = (userId: string) => {
    router.push(`/admin/FACULTY/others-pages/profile/${userId}`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Applications
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border p-4 rounded-lg shadow-sm flex gap-4 items-start justify-between"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                  {app.user.profilePicUrl ? (
                    <img
                      src={app.user.profilePicUrl}
                      alt={app.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl">
                      {app.user.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{app.user.name}</h3>
                  <p className="text-gray-600">{app.user.email}</p>
                  {app.user.department && (
                    <p className="text-gray-500 text-sm">{app.user.department}</p>
                  )}
                  <p className="mt-2">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`${
                        app.status === "ACCEPTED"
                          ? "text-green-600"
                          : app.status === "REJECTED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      } font-semibold`}
                    >
                      {app.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Applied on: {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {app.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id,"ACCEPTED")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app.id,"REJECTED")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewProfile(app.user.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
