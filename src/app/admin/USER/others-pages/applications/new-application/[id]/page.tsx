"use client";
import { useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import 'antd/dist/reset.css'; // for Ant Design v5

export default function NewApplication() {
const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `https://rf-backend-alpha.vercel.app/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
  
      const response = await axios.post(
        `https://rf-backend-alpha.vercel.app/api/applications/project/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 201) {
        router.push(`/admin/USER/others-pages/applications/${response.data.application.id}`);
      }
    } catch (error: any) {
      console.error("Application failed:", error);
      if (error.response?.status === 400) {
        setIsApplied(true);
        setError("You have already applied to this project");
      } else {
        setError(error.response?.data?.message || "Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading application form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        {isApplied && (
          <button
            onClick={() => router.push("/admin/USER/others-pages/applications")}
            className="mt-4 px-4 py-2 bg-blue-100 rounded hover:bg-blue-200"
          >
            View My Applications
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ComponentCard
        title="Apply for Research Project"
        desc="Submit your application to join this research project"
      >
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {project?.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {project?.description}
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {project?.type}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {project?.location === "ON_CAMPUS" ? "On Campus" : "Remote"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
