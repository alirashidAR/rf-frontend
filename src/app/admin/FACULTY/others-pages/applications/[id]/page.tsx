"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, message } from "antd";

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
  coverLetter: string;  // SOP text
  resumeUrl: string;    // Resume file URL
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const id =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  useEffect(() => {
    if (!id) return;

    const fetchApplications = async () => {
      setLoading(true);
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
        message.error("Failed to load applications");
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
      message.success(`Application ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      message.error(`Failed to update status to ${status.toLowerCase()}`);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/admin/FACULTY/others-pages/profile/${userId}`);
  };

  const openApplicationModal = (app: Application) => {
    setSelectedApplication(app);
    setModalVisible(true);
  };

  const closeApplicationModal = () => {
    setModalVisible(false);
    setSelectedApplication(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

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
              <Button
              size="small"
                onClick={() => openApplicationModal(app)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
              >
                View Application
              </Button>

                {app.status === "PENDING" && (
                  <>
                    <Button
                    size="small"
                      onClick={() => updateStatus(app.id, "ACCEPTED")}
                      style={{ backgroundColor: "#22c55e", color: "white", border: "none" }}
                    >
                      Accept
                    </Button>
                    <Button
                    size="small"
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      style={{ backgroundColor: "#facc15", color: "#333", border: "none" }}
                    >
                      Reject
                    </Button>
                  </>
                )}

                <Button
                size="small"
                  onClick={() => handleViewProfile(app.user.id)}
                  style={{ backgroundColor: "#3b82f6", color: "white", border: "none" }}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for SOP and Resume */}
      <Modal
        title={`Application Details - ${selectedApplication?.user.name || ""}`}
        open={modalVisible}
        onCancel={closeApplicationModal}
        footer={null}
        destroyOnClose
        width={700}
      >
        {selectedApplication && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Statement of Purpose:</h3>
              <div
                className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap max-h-60 overflow-auto"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {selectedApplication.coverLetter || "No SOP provided."}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Resume:</h3>
              {selectedApplication.resumeUrl ? (
                <a
                  href={selectedApplication.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume Document
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
