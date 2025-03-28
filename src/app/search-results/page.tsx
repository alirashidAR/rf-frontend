"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


import ComponentCard from "@/components/common/ComponentCard";
// Remove the duplicate import and ensure the correct path is used
const SearchResults = () => {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search-results?query=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Enter" && document.activeElement === inputRef.current) {
        event.preventDefault();
        handleSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  // Dummy search results (Replace with API data)
  const searchResults = [
    {
      id: 1,
      title: "AI-Powered Medical Diagnosis Systems",
      professor: "Prof. Sarah Johnson",
      department: "Computer Science",
      tags: ["Machine Learning", "Healthcare"],
      description: "Research project focusing on developing AI algorithms for early disease detection...",
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions",
      professor: "Prof. Michael Chen",
      department: "Engineering",
      tags: ["Renewable Energy", "Sustainability"],
      description: "Research project exploring innovative approaches to renewable energy storage...",
    },
  ];

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-100">
      {/* Filters Section */}
      <ComponentCard title="Filters" className="w-1/4 shadow-md">
        <div>
          <p className="font-medium">Project Type</p>
          <ul className="space-y-2">
            <li><input type="checkbox" /> Research Projects</li>
            <li><input type="checkbox" /> Thesis</li>
            <li><input type="checkbox" /> Collaboration</li>
          </ul>
        </div>
        <div className="mt-4">
          <p className="font-medium">Duration</p>
          <ul className="space-y-2">
            <li><input type="checkbox" /> 0-6 months</li>
            <li><input type="checkbox" /> 6-12 months</li>
            <li><input type="checkbox" /> 1+ year</li>
          </ul>
        </div>
        <div className="mt-4">
          <p className="font-medium">Status</p>
          <ul className="space-y-2">
            <li><input type="checkbox" /> Open for Applications</li>
            <li><input type="checkbox" /> Ongoing</li>
            <li><input type="checkbox" /> Completed</li>
          </ul>
        </div>
      </ComponentCard>

      {/* Search Results Section */}
      <ComponentCard title={`Search Results (${searchResults.length})`} className="w-3/4 shadow-md">
        {/* <div className="flex justify-between items-center">
          <button className="bg-gray-200 p-2 rounded">Sort by: Relevance</button>
        </div> */}

        {/* Render Search Results */}
        {searchResults.map((project) => (
          <ComponentCard key={project.id} title={project.title} desc={`${project.professor} • ${project.department} Department`} className="mt-4 cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/admin/others-pages/projects/${project.id}`)}>
            <div className="mt-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2">{tag}</span>
              ))}
            </div>
            <p className="mt-2 text-gray-700">{project.description}</p>
          </ComponentCard>
        ))}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button className="px-3 py-1 border rounded-l">Previous</button>
          <button className="px-3 py-1 bg-blue-500 text-white">1</button>
          <button className="px-3 py-1 border">2</button>
          <button className="px-3 py-1 border">3</button>
          <button className="px-3 py-1 border rounded-r">Next</button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default SearchResults;
