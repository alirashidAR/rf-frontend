"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const tabs = ["Applied Projects", "Active", "Pending", "Completed"];
const itemsPerPage = 4;

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
  const [appliedProjects, setAppliedProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("Applied Projects");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const localToken = localStorage.getItem("token");
      if (!localToken) return;

      try {
        setLoading(true);
        
        // Fetch main projects
        const projectsRes = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/projects/user",
          {
            headers: { Authorization: `Bearer ${localToken}` },
          }
        );

        // Fetch applied projects
        const applicationsRes = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/applications/student/applications",
          {
            headers: { Authorization: `Bearer ${localToken}` },
          }
        );

        // Process main projects
        const mappedProjects = projectsRes.data.map((project: any) => ({
          id: project.id,
          title: project.title,
          status: project.status === "ONGOING" 
            ? "Active" 
            : project.status.charAt(0) + project.status.slice(1).toLowerCase(),
          endDate: project.endDate,
          keywords: project.keywords,
        }));

        // Process applied projects
        const pendingApps = applicationsRes.data.filter((app: any) => app.status === "PENDING");
        const mappedAppliedProjects = pendingApps.map((app: any) => ({
          id: app.project.id,
          title: app.project.title,
          status: "Applied",
          endDate: app.project.endDate,
          keywords: app.project.keywords,
        }));

        setProjectsData(mappedProjects);
        setAppliedProjects(mappedAppliedProjects);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const filteredProjects = activeTab === "Applied Projects" 
    ? appliedProjects 
    : projectsData.filter((proj) => proj.status === activeTab);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                activeTab === tab 
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold" 
                  : "text-gray-500"
              }`}
            >
              {tab} (
                {tab === "Applied Projects" 
                  ? appliedProjects.length 
                  : projectsData.filter((p) => p.status === tab).length}
              )
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-500 text-lg">
            Loading projects...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {displayedProjects.map((project) => (
                <Link
                  href={
                    `/admin/USER/others-pages/projects/${project.id}`
                  }
                  key={project.id}
                  className="p-4 bg-gray-100 rounded-lg shadow block hover:bg-gray-200 transition"
                >
                  <span
                    className={`text-sm font-semibold py-1 px-2 rounded ${
                      project.status === "Active"
                        ? "bg-green-200 text-green-700"
                        : project.status === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : project.status === "Applied"
                        ? "bg-purple-200 text-purple-700"
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
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                  }`}
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

        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/admin/USER/others-pages/forms/form-elements")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            New Project
          </button>
        </div> */}
      </ComponentCard>
    </div>
  );
}
