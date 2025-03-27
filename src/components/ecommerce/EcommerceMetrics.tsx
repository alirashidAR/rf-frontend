"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  return (
    <div className="w-full">
      {/* <!-- Metric Item Start --> */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 pb-8 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">

        <div className="flex items-center justify-between">
          <div className="w-full">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
              Welcome back!
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Here's what's happening with your research activities 
            </p>
          </div>

          <div className="flex space-x-8">
            {/* Active Projects */}
            <div className="flex flex-col items-center whitespace-nowrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Projects</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">5</h4>
            </div>
            
            {/* Collaborations */}
            <div className="flex flex-col items-center whitespace-nowrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Collaborations</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">3</h4>
            </div>

            {/* Messages */}
            <div className="flex flex-col items-center whitespace-nowrap mr-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Messages</span>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">12</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
