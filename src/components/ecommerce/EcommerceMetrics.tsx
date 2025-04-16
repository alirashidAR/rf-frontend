"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export const EcommerceMetrics = () => {
  const { name, role } = useAuth();
  const firstName = name ? name.split(" ")[0] : "";

  // State for counts
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const localToken = localStorage.getItem("token");
      if (!localToken) return;

      try {
        setLoading(true);

        // Fetch user's projects
        const projectsRes = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/projects/user",
          {
            headers: { Authorization: `Bearer ${localToken}` },
          }
        );

        // Fetch user's applications
        const applicationsRes = await axios.get(
          "https://rf-backend-alpha.vercel.app/api/applications/student/applications",
          {
            headers: { Authorization: `Bearer ${localToken}` },
          }
        );

        // Count projects by status
        const projects = projectsRes.data;
        setActiveCount(projects.filter((p: any) => p.status === "ONGOING").length);
        setCompletedCount(projects.filter((p: any) => p.status === "COMPLETED").length);

        // Count pending applications
        setPendingCount(applicationsRes.data.filter((app: any) => app.status === "PENDING").length);

      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [role]);

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 pb-8 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
              Welcome {firstName}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Here's what's happening with your research activities 
            </p>
          </div>

          <div className="flex space-x-8">
            {/* Active Projects */}
            <div className="flex flex-col items-center whitespace-nowrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Projects</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {loading ? "--" : activeCount}
              </h4>
            </div>
            
            {/* Pending Applications */}
            <div className="flex flex-col items-center whitespace-nowrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Pending Applications</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {loading ? "--" : pendingCount}
              </h4>
            </div>

            {/* Completed Projects */}
            <div className="flex flex-col items-center whitespace-nowrap mr-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Completed Projects</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {loading ? "--" : completedCount}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
