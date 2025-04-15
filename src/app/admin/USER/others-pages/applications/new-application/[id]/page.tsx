"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";

export default function NewApplication() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [statement, setStatement] = useState("");
  const [preferredDomain, setPreferredDomain] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);

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

      const formData = new FormData();
      formData.append("statement", statement);
      formData.append("preferredDomain", preferredDomain);
      if (resumeFile) {
        formData.append("resumeFile", resumeFile);
      }

      const response = await axios.post(
        `https://rf-backend-alpha.vercel.app/api/applications/project/apply/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setStatement("");
        setPreferredDomain("");
        setResumeFile(null);
        setShowConfirmation(true); // ✅ Show modal
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
            onClick={() => router.push("/admin/USER/others-pages/blank")}
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

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why are you interested in this project?
              </label>
              <textarea
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Domain
              </label>
              <input
                type="text"
                value={preferredDomain}
                onChange={(e) => setPreferredDomain(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Resume (PDF only)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              {resumeFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected file: {resumeFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !statement || !preferredDomain || !resumeFile}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Application Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your application has been successfully submitted.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  router.push("/admin/USER/others-pages/blank");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
