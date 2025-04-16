"use client";
import React, { useState } from "react";
import axios from "axios";
import FacultyAddressCard from "@/components/faculty-profile/FacultyAddressCard";
import FacultyInfoCard from "@/components/faculty-profile/FacultyInfoCard";
import FacultyMetaCard from "@/components/faculty-profile/FacultyMetaCard";

export default function FacultyProfilePage() {
  const [query, setQuery] = useState("");
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Searching for faculty:", query);
      const res = await axios.get(
        `https://rf-backend-alpha.vercel.app/api/faculty/search?name=${(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setFacultyData(res.data);
    } catch (err: any) {
      setError("Error fetching faculty data.");
      setFacultyData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      {/* Page Heading */}
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white/90">
        Browse Faculty
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter faculty name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 shadow-sm dark:border-gray-700 dark:bg-white/[0.03] dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Status Messages */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Faculty Cards */}
      {facultyData && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          </h3>
          <div className="space-y-6">
            <FacultyAddressCard data={facultyData} />
            <FacultyInfoCard data={facultyData} />
            <FacultyMetaCard data={facultyData} />
          </div>
        </div>
      )}
    </div>
  );
}
