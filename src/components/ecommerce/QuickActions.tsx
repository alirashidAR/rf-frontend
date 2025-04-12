"use client";
import Image from "next/image";

import { useState,useEffect } from "react";
import axios from "axios";

export default function QuickActions() {
  const [projects, setProjects] = useState<any[]>([]); // store the recent projects
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await axios.get("https://rf-backend-alpha.vercel.app/api/projects/recent", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProjects(response.data); // assuming data is an array of recent projects
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      }
    };
  
    fetchRecentProjects();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Projects
          </h3>
        </div>

        
      </div>
      

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
        
            <div>
              {/* <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                USA
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                2,379 Customers
              </span> */}
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            {/* <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div> */}
            {/* <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
              79%
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
