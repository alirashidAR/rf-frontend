"use client"
import { useParams } from "next/navigation";

// Mock data (Replace with API call later)
const projects = [
  {
    id: "1",
    title: "AI in Healthcare Research",
    status: "Pending",
    professor: "Prof. Sarah Johnson",
    department: "Computer Science Department",
    description:
      "A cutting-edge research initiative focused on developing artificial intelligence algorithms for early disease detection and diagnosis. This project aims to leverage machine learning techniques to analyze patient data and improve healthcare outcomes.",
    tags: ["Machine Learning", "Healthcare", "Data Analysis"],
    requirements: [
      "Strong background in machine learning and data analysis",
      "Programming proficiency in Python and related ML frameworks",
      "Understanding of healthcare data privacy regulations",
      "Excellent analytical and problem-solving skills",
    ],
    timeline: [
      { phase: "Phase 1: Data Collection", period: "Jan 2024 - Mar 2024", color: "bg-green-500" },
      { phase: "Phase 2: Model Development", period: "Apr 2024 - Jun 2024", color: "bg-blue-500" },
      { phase: "Phase 3: Testing and Validation", period: "Jul 2024 - Sep 2024", color: "bg-gray-500" },
    ],
    details: { duration: "9 months", startDate: "January 15, 2024", location: "Remote / On-campus", positions: 3 },
    team: [{ name: "Prof. Sarah Johnson", role: "Project Lead" }, { name: "Dr. Mark Wilson", role: "Research Associate" }],
    deadline: { date: "January 10, 2024", daysRemaining: 5 },
  },
];

// ✅ Fix: Use async function to correctly handle params
export default function ProjectPage() {
  // Ensure params exists before accessing its properties
  const params = useParams(); // Get params safely

  if (!params?.id) return <p>Loading...</p>; // Ensure id exists
  const project = projects.find((p) => p.id === String(params.id));

  if (!project) return <p>Project not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Apply Now</button>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-3 gap-8 mt-6">
        {/* Left Column (2/3 Width) */}
        <div className="col-span-2 space-y-6">
          {/* Project Overview */}
          <section>
            <h2 className="text-lg font-semibold">Project Overview</h2>
            <p className="text-gray-600">{project.description}</p>
            <div className="flex gap-2 mt-3">
              {project.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside text-gray-600">
              {project.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>

          {/* Project Timeline */}
          <section>
            <h2 className="text-lg font-semibold">Project Timeline</h2>
            <div className="mt-2 space-y-2">
              {project.timeline.map((phase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${phase.color}`}></span>
                  <p className="text-gray-600">{phase.phase} <span className="text-sm text-gray-500">({phase.period})</span></p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3 Width) */}
        <div className="col-span-1 space-y-6">
          {/* Sidebar - Project Details */}
          <aside className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Project Details</h2>
            <p><strong>Duration:</strong> {project.details.duration}</p>
            <p><strong>Start Date:</strong> {project.details.startDate}</p>
            <p><strong>Location:</strong> {project.details.location}</p>
            <p><strong>Positions Available:</strong> {project.details.positions}</p>
          </aside>

          {/* Research Team */}
          <aside className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Research Team</h2>
            {project.team.map((member, index) => (
              <p key={index}><strong>{member.name}</strong> - {member.role}</p>
            ))}
          </aside>

          {/* Application Deadline */}
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
