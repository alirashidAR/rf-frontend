"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const tabs = ["Active", "Pending", "Completed"];
const itemsPerPage = 3;

export default function MyProjectsPage() {
  const { role } = useAuth();
  const router = useRouter();

  interface Project {
    id: string;
    status: string;
    title: string;
    endDate: string;
    keywords: string[];
  }

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const localToken = localStorage.getItem("token");

      if (localToken) {
        try {
          setLoading(true); // Set loading to true before fetch
          const res = await axios.get("https://rf-backend-alpha.vercel.app/api/projects/user", {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          });

          // Normalize project status
          const mappedProjects = res.data.map((project: any) => {
            let normalizedStatus = project.status;
            if (normalizedStatus === "ONGOING") normalizedStatus = "Active";
            else normalizedStatus = normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase();

            return {
              id: project.id,
              title: project.title,
              status: normalizedStatus,
              endDate: project.endDate,
              keywords: project.keywords,
            };
          });

          setProjectsData(mappedProjects);
        } catch (err) {
          console.error("Error fetching user projects:", err);
        } finally {
          setLoading(false); // Turn off loading after fetch
        }
      }
    };

    fetchProjects();
  }, [role]);

  const filteredProjects = projectsData.filter((proj) => proj.status === activeTab);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <PageBreadcrumb pageTitle="My Projects" />

      <ComponentCard title="" className="mt-4">
        <div className="flex space-x-6 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`text-lg pb-2 ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              {tab} ({projectsData.filter((p) => p.status === tab).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-500 text-lg">Loading projects...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {displayedProjects.map((project) => (
                <Link
                  href={`/admin/USER/others-pages/projects/${project.id}`}
                  key={project.id}
                  className="p-4 bg-gray-100 rounded-lg shadow block hover:bg-gray-200 transition"
                >
                  <span
                    className={`text-sm font-semibold py-1 px-2 rounded ${
                      project.status === "Active"
                        ? "bg-green-200 text-green-700"
                        : project.status === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Due: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "TBD"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.keywords.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/admin/USER/others-pages/forms/form-elements")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            New Project
          </button>
        </div>
      </ComponentCard>
    </div>
  );
}
