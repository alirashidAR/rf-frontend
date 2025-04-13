"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ProjectPage() {
  const [applied, setApplied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  // Mock data (to be replaced with actual fetch by ID)
  const projects = [
    {
      id: "1",
      title: "AI in Healthcare Research",
      status: "Pending",
      professor: "Prof. Sarah Johnson",
      department: "Computer Science Department",
      description:
        "A cutting-edge research initiative focused on developing artificial intelligence algorithms...",
      tags: ["Machine Learning", "Healthcare", "Data Analysis"],
      requirements: [
        "Strong background in machine learning",
        "Programming proficiency in Python",
        "Understanding of data privacy",
        "Problem-solving skills",
      ],
      timeline: [
        { phase: "Phase 1", period: "Jan 2024 - Mar 2024", color: "bg-green-500" },
        { phase: "Phase 2", period: "Apr 2024 - Jun 2024", color: "bg-blue-500" },
        { phase: "Phase 3", period: "Jul 2024 - Sep 2024", color: "bg-gray-500" },
      ],
      details: {
        duration: "9 months",
        startDate: "January 15, 2024",
        location: "Remote / On-campus",
        positions: 3,
      },
      team: [
        { name: "Prof. Sarah Johnson", role: "Project Lead" },
        { name: "Dr. Mark Wilson", role: "Research Associate" },
      ],
      deadline: { date: "January 10, 2024", daysRemaining: 5 },
    },
  ];

  const project = projects.find((p) => p.id === String(id));

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://rf-backend-alpha.vercel.app/api/applications/project/${id}/apply`,
        {}, // No body; user info comes from token
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Application successful:", response.data);
      setApplied(true);
    } catch (error: any) {
      console.error("Error applying to project:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to apply.");
    }
  };

  if (!id) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {project.title}{" "}
            <span className="text-sm bg-yellow-200 text-yellow-700 px-2 py-1 rounded">{project.status}</span>
          </h1>
          <p className="text-gray-600">{`Led by ${project.professor} • ${project.department}`}</p>
        </div>
        <div className="flex gap-3">
          <button className="border px-4 py-2 rounded text-blue-500">Share</button>
          {applied ? (
            <div className="text-green-600 font-semibold">Applied successfully ✅</div>
          ) : (
            <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded">
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-3 gap-8 mt-6">
        <div className="col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold">Project Overview</h2>
            <p className="text-gray-600">{project.description}</p>
            <div className="flex gap-2 mt-3">
              {project.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside text-gray-600">
              {project.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <aside className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Project Details</h2>
            <p><strong>Duration:</strong> {project.details.duration}</p>
            <p><strong>Start Date:</strong> {project.details.startDate}</p>
            <p><strong>Location:</strong> {project.details.location}</p>
            <p><strong>Positions Available:</strong> {project.details.positions}</p>
          </aside>

          <aside className="bg-blue-50 p-4 rounded-lg border border-blue-300">
            <h2 className="text-lg font-semibold">Application Deadline</h2>
            <p className="text-blue-600 font-bold">{project.deadline.date}</p>
            <p className="text-gray-500">{project.deadline.daysRemaining} days remaining</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
