///layout.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useAuth } from "@/context/AuthContext"; // Import auth context

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { name, role, profilePic } = useAuth(); // Get user info from context
  const user = name && role; // Derive user existence from name and role

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        
        {/* User Information (Only show if user is logged in) */}
        <div className="hidden xl:block p-4 text-sm text-gray-400">
          {user ? (
            <>
              <p>Welcome, {name}</p>
              {/* Display profile picture if available */}
              {profilePic && (
                <img src={profilePic} alt="Profile Picture" className="w-8 h-8 rounded-full" />
              )}
            </>
          ) : (
            <p>Please log in to view your details.</p>
          )}
        </div>
        
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-6xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
