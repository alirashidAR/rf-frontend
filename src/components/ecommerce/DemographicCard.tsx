"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  faculty: {
    user: {
      name: string;
      department?: string;
    };
  };
  applications: any[]; // Array of applications
}

export default function TrendingProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProjects = async () => {
      try {
        const response = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/projects/trending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Filter out projects with 0 applications
        const filteredProjects = response.data.projects.filter(
          (project: Project) => project.applications && project.applications.length > 0
        );

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching trending projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProjects();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Trending Projects
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No trending projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/admin/USER/others-pages/projects/${project.id}`)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white/90">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Led by {project.faculty?.user?.name || "Unknown Faculty"} •{" "}
                    {project.faculty?.user?.department || "No Department"}
                  </p>
                </div>
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                  {project.applications.length} Applications
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}