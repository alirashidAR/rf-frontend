"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  name: string;
}

interface Faculty {
  user: User;
}

interface Project {
  id: string;
  title: string;
  faculty: Faculty;
  createdAt: string;
  status: string;
  location: string;
  type: string;
}

export default function QuickActions() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/projects/recent",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Filter out projects with status "COMPLETED" and show only the top 3
        const filteredProjects = response.data.projects
          .filter((project: Project) => project.status !== "COMPLETED")
          .slice(0, 2); // Show only the first 3 projects

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  const normalizeStatus = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "Active";
      case "PENDING":
        return "Pending";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Projects
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No recent projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                router.push(`/admin/USER/others-pages/projects/${project.id}`)
              }
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white/90">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.faculty?.user?.name || "Unknown Faculty"} •{" "}
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    project.status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : project.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {normalizeStatus(project.status)}
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {project.type}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {project.location === "ON_CAMPUS" ? "On Campus" : "Remote"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
