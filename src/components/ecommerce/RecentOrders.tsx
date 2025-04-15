"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAuth } from "@/context/AuthContext"; // Import your auth context

interface ProjectData {
  id: string;
  title: string;
  updatedAt: string;
  status: "ONGOING" | "COMPLETED" | "PENDING" | "ACCEPTED" | "REJECTED";
  pendingApplications?: number;
  applicationStatus?: string; // For student view
}

export default function RecentOrders() {
  const { role } = useAuth(); // Get role from auth context
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const endpoint = role === 'FACULTY' 
          ? "https://rf-backend-alpha.vercel.app/api/projects/faculty/current"
          : "https://rf-backend-alpha.vercel.app/api/projects/current";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Transform data based on role
        const transformedData = role === 'FACULTY'
          ? response.data.projects
          : response.data.projects.map((p: any) => ({
              ...p.project,
              applicationStatus: p.status
            }));

        setProjects(transformedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [role]);

  const statusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
      case "ACCEPTED":
        return "success";
      case "PENDING":
        return "warning";
      case "COMPLETED":
      case "REJECTED":
        return "error";
      default:
        return undefined;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            My Current Projects
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[250px]"
              >
                Project Title
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Last Updated
              </TableCell>
              {role === 'FACULTY' ? (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Pending Applications
                </TableCell>
              ) : (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Application Status
                </TableCell>
              )}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-end pr-12 text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="text-center py-6">
                  No projects found.
                </td>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="py-3">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {project.title}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </TableCell>
                  {role === 'FACULTY' ? (
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center w-[120px]">
                      <Badge size="sm" color="info">
                        {project.pendingApplications}
                      </Badge>
                    </TableCell>
                  ) : (
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center w-[120px]">
                      <Badge size="sm" color={statusColor(project.applicationStatus || '')}>
                        {(project.applicationStatus || '').charAt(0) + (project.applicationStatus || '').slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="py-3 text-end pr-12">
                    <Badge size="sm" color={statusColor(project.status)}>
                      {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
