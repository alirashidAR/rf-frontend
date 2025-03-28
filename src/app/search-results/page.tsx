"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

  return (
    <div className="flex gap-6 p-6 dark: min-h-screen">
      {/* Filters Box */}
      <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Filters
        </h2>
        {/* Add filter options here */}
        <p className="text-gray-600 dark:text-gray-300">Filter options will go here.</p>
      </div>

      {/* Search Results Box */}
      <div className="w-3/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Search Results
        </h2>
        

        {/* Placeholder for search results */}
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            Search results will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
