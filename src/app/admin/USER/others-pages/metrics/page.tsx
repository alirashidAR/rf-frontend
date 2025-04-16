"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import LineChartOne from "@/components/charts/line/LineChartOne";

// Dynamically import ReactApexChart with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ProjectStatusData = {
  ONGOING: number;
  COMPLETED: number;
  UPCOMING: number;
};

type Metrics = {
  submissions: number;
  projects: number;
  users: number;
  faculties: number;
  projectStatusData: ProjectStatusData;
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    submissions: 0,
    projects: 0,
    users: 0,
    faculties: 0,
    projectStatusData: {
      ONGOING: 0,
      COMPLETED: 0,
      UPCOMING: 0,
    },
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token"); // or get from context/state if you're using that
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          submissionsRes,
          projectsRes,
          usersRes,
          facultiesRes,
          statusRes,
        ] = await Promise.all([
          axios.get("https://rf-backend-alpha.vercel.app/api/metrics/submissions", { headers }),
          axios.get("https://rf-backend-alpha.vercel.app/api/metrics/projects", { headers }),
          axios.get("https://rf-backend-alpha.vercel.app/api/metrics/users", { headers }),
          axios.get("https://rf-backend-alpha.vercel.app/api/metrics/faculties", { headers }),
          axios.get("https://rf-backend-alpha.vercel.app/api/metrics/projects/status", { headers }),
        ]);

        setMetrics({
          submissions: submissionsRes.data.count,
          projects: projectsRes.data.count,
          users: usersRes.data.count,
          faculties: facultiesRes.data.count,
          projectStatusData: statusRes.data, // Assume {ONGOING: 10, COMPLETED: 5, UPCOMING: 3}
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Metrics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Submissions" value={metrics.submissions} />
        <MetricCard title="Projects" value={metrics.projects} />
        <MetricCard title="Users" value={metrics.users} />
        <MetricCard title="Faculties" value={metrics.faculties} />
      </div>

      <div className="space-y-10 pt-20">
        <div>
          <h2 className="text-xl font-semibold mb-2">Project Status Overview</h2>
          <BarChartOneWrapper data={metrics.projectStatusData} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Custom BarChart with dynamic data
function BarChartOneWrapper({
  data,
}: {
  data: ProjectStatusData;
}) {
  const options = {
    chart: {
      type: "bar" as any,
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Ongoing", "Completed", "Upcoming"],
    },
    colors: ["#465fff"],
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Projects",
      data: [data.ONGOING || 0, data.COMPLETED || 0, data.UPCOMING || 0],
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[500px]">
        <ReactApexChart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}
