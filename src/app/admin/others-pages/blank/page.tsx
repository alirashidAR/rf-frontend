"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const projectsData = [
  { id: 1, title: "AI in Healthcare Research", status: "Pending", due: "Jan 15, 2024", tags: ["Machine Learning", "Healthcare"] },
  { id: 1, title: "Quantum Computing Applications", status: "Active", due: "Mar 1, 2024", tags: ["Quantum Computing", "Finance"] },
  { id: 1, title: "Sustainable Energy Systems", status: "Pending", due: "Feb 28, 2024", tags: ["Sustainability", "Energy"] },
  { id: 1, title: "Autonomous Vehicles Research", status: "Completed", due: "Dec 20, 2023", tags: ["AI", "Transportation"] },
];

const tabs = ["Active", "Pending", "Completed"];
const itemsPerPage = 2; // Projects per page

export default function MyProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter projects based on the selected tab
  const filteredProjects = projectsData.filter((proj) => proj.status === activeTab);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Page Breadcrumb (Title appears only here) */}
      <PageBreadcrumb pageTitle="My Projects" />

      {/* Component Card to wrap content (without duplicate title) */}
      <ComponentCard className="mt-4">
        {/* Tabs */}
        <div className="flex space-x-6 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg pb-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500"}`}
            >
              {tab} ({projectsData.filter((p) => p.status === tab).length})
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {displayedProjects.map((project) => (
            <Link href={`/admin/others-pages/projects/${project.id}`} key={project.id} className="p-4 bg-gray-100 rounded-lg shadow block hover:bg-gray-200 transition">
              <span className={`text-sm font-semibold py-1 px-2 rounded ${project.status === "Active" ? "bg-green-200 text-green-700" : project.status === "Pending" ? "bg-yellow-200 text-yellow-700" : "bg-gray-300 text-gray-700"}`}>
                {project.status}
              </span>
              <h3 className="text-lg font-bold mt-2">{project.title}</h3>
              <p className="text-gray-500 text-sm">Due: {project.due}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
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
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            >
              Next
            </button>
          </div>
        )}

        {/* New Project Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => router.push("/admin/others-pages/forms/form-elements")} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            New Project
          </button>
        </div>
      </ComponentCard>
    </div>
  );
}
