"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "axios";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    department: "",
    status: [] as string[],
    type: [] as string[],
    location: "",
    page: 1,
    pageSize: 10,
  });

  // ✅ Update filters.query when the search param changes
  useEffect(() => {
    const newQuery = searchParams.get("query") || "";
    setFilters((prev) => ({
      ...prev,
      query: newQuery,
      page: 1,
    }));
  }, [searchParams]);

  const handleCheckboxChange = (category: "type" | "status", value: string) => {
    setFilters((prev) => {
      const updatedCategory = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];

      return {
        ...prev,
        [category]: updatedCategory,
      };
    });
  };

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === value ? "" : value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!filters.query && filters.status.length === 0 && filters.type.length === 0) return;

      setLoading(true);
      try {
        const res = await axios.post("https://rf-backend-alpha.vercel.app/api/search/projects", {
          ...filters,
        });

        const data = res.data;
        if (Array.isArray(data.projects)) {
          setResults(data.projects);
        } else {
          setResults([]);
          console.error("API response is not an array:", data);
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filters]);

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-100">
      {/* Filters Section */}
      <ComponentCard title="Filters" className="w-1/4 shadow-md">
        <div>
          <p className="font-medium">Project Type</p>
          <ul className="space-y-2">
            {["RESEARCH", "INDUSTRY"].map((type) => (
              <li key={type}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={() => handleCheckboxChange("type", type)}
                    className="mr-2"
                  />
                  {type}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <p className="font-medium">Status</p>
          <ul className="space-y-2">
            {["ONGOING", "PENDING", "COMPLETED"].map((status) => (
              <li key={status}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleCheckboxChange("status", status)}
                    className="mr-2"
                  />
                  {status}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <p className="font-medium">Location</p>
          <div className="space-y-2">
            {["REMOTE", "ON_CAMPUS"].map((location) => (
              <div key={location} className="flex items-center">
                <input
                  type="checkbox"
                  id={location}
                  checked={filters.location === location}
                  onChange={() => handleLocationChange(location)}
                  className="mr-2"
                />
                <label htmlFor={location} className="text-sm">
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      {/* Search Results Section */}
      <ComponentCard title={`Search Results (${results.length})`} className="w-3/4 shadow-md">

        {/* ✅ Search Bar */}
        <div className="mb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const value = inputRef.current?.value || "";
              router.push(`/search-results?query=${encodeURIComponent(value)}`);
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              defaultValue={filters.query}
              placeholder="Search projects..."
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((project, index) => (
            <ComponentCard
              key={index}
              title={project.title || "Untitled Project"}
              desc={`${project.faculty.user.name || "Unknown"} • ${project.faculty.user.department || "N/A"} Department`}
              className="mt-4 cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/admin/others-pages/projects/${project.id || ""}`)}
            >
              <div className="mt-2">
                {(project.keywords || []).map((tag: string) => (
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
        ) : (
          <p>No results found.</p>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span>Page {filters.page}</span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={results.length < filters.pageSize}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default SearchResults;
