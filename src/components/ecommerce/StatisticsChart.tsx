"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define types for our data
interface Project {
  title: string;
  applicationDeadline: string | null;
}

interface Deadline {
  id: string;
  project: Project;
}

export default function StatisticsChart() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setLoading(true);
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('token') || ''; 
        
        const response = await axios.get('https://rf-backend-alpha.vercel.app/api/projects/deadlines', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Make sure we're setting an array
        if (Array.isArray(response.data)) {
          setDeadlines(response.data);
        } else {
          console.error("Response is not an array:", response.data);
          setDeadlines([]);
        }
      } catch (err) {
        console.error("Error fetching deadlines:", err);
        setError("Failed to load deadlines");
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  // Calculate days remaining between dates
  const calculateDaysLeft = (deadlineDate: string) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-5 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Upcoming Deadlines
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading deadlines...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : deadlines.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines found</p>
        ) : (
          deadlines.map((deadline) => {
            const daysLeft = deadline.project.applicationDeadline 
              ? calculateDaysLeft(deadline.project.applicationDeadline)
              : null;
            
            return (
              <div key={deadline.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {deadline.project.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Project Deadline
                  </p>
                </div>
                <div className="text-right">
                  {deadline.project.applicationDeadline ? (
                    <>
                      <p className={`font-bold ${daysLeft && daysLeft <= 2 ? 'text-red-500' : daysLeft && daysLeft <= 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {daysLeft && daysLeft < 0 ? 'Expired' : 
                         daysLeft && daysLeft === 0 ? 'Due today' : 
                         daysLeft ? `${daysLeft} days left` : 'No deadline'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {formatDate(deadline.project.applicationDeadline)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No deadline set
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}