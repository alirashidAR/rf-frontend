"use client";

import { useRouter,useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


import ComponentCard from "@/components/common/ComponentCard";
import axios from "axios";
// Remove the duplicate import and ensure the correct path is used
const SearchResults = () => {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  //const [query, setQuery] = useState("");
  const router = useRouter();
  // const [searchResults, setSearchResults] = useState([]);
  // const [type, setType] = useState<string[]>([]);
  // const [status, setStatus] = useState<string[]>([]);
  // const [department, setDepartment] = useState<string | null>(null);
  // const [page, setPage] = useState(1);
  // const pageSize = 10;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    department: "",
    status: "",
    type: "",
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!filters.query) return;

      setLoading(true);
      try {
        const res = await axios.post("https://rf-backend-alpha.vercel.app/api/search/projects", {
          ...filters,
        });

        setResults(res.data || []);
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filters.query]);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if ((event.metaKey || event.ctrlKey) && event.key === "k") {
  //       event.preventDefault();
  //       inputRef.current?.focus();
  //     }
  //     if (event.key === "Enter" && document.activeElement === inputRef.current) {
  //       event.preventDefault();
  //       handleSearch();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [query]);



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
      <ComponentCard title={`Search Results (${results.length})`} className="w-3/4 shadow-md">
        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map((project, index) => (
            <ComponentCard
              key={index}
              title={project.title || "Untitled Project"}
              desc={`${project.facultyName || "Unknown"} • ${project.department || "N/A"} Department`}
              className="mt-4 cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/admin/others-pages/projects/${project.id || ""}`)}
            >
              <div className="mt-2">
                {(project.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-gray-700">{project.description}</p>
            </ComponentCard>
          ))
        )}
      </ComponentCard>
    </div>
  );
};

export default SearchResults;
