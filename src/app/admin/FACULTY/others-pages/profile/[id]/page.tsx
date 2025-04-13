"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Button from "@/components/ui/button/Button"; // Custom Button component

// Define types for the profile data
interface Project {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface ProfileData {
    name: string;
    email: string;
    profilePicUrl: string;
    department: string;
    researchInterests: string[];
    projectsParticipated: { project: Project }[];
}

export default function UserProfile() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const id =
        typeof window !== "undefined"
            ? window.location.pathname.split("/").pop()
            : "";

    useEffect(() => {
        if (!id) return; // Wait for the ID to be available before fetching data

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    `https://rf-backend-alpha.vercel.app/api/user/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setProfileData(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Top Header */}
            <header className="bg-gray-800 text-white text-center py-3 text-lg font-semibold">
                Profile Dashboard
            </header>

            {/* Profile Section */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    {profileData && profileData.profilePicUrl ? (
                        <img
                            src={profileData.profilePicUrl}
                            alt={profileData.name || "Profile Picture"}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white">
                            {profileData?.name ? profileData.name.charAt(0) : "N/A"}
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-bold">{profileData?.name || "Ali Rashid"}</h1>
                        <p className="text-gray-600">{profileData?.department || "Computer Science Department"}</p>
                        <a href={`mailto:${profileData?.email}`} className="text-blue-600">{profileData?.email}</a>
                        <div className="mt-2 flex gap-2">
                            {profileData?.researchInterests.map((interest, index) => (
                                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full">{interest}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" className="bg-gray-300">Share</Button>
                </div>
            </div>

            {/* Projects Section */}
            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold flex justify-between">
                        Current Projects
                        <a href="#" className="text-blue-600 text-sm">View All</a>
                    </h2>
                    {(profileData?.projectsParticipated?.length ?? 0) > 0 ? (
                        profileData?.projectsParticipated.map((projectData, index) => (
                            <div key={index} className="mt-4">
                                <p className="font-semibold">{projectData.project.title}</p>
                                <p className="text-gray-600 text-sm">{projectData.project.description}</p>
                                <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                                    Active
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No projects available.</p>
                    )}
                </div>
            </div>

            {/* Education & Research Interests */}
            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Education</h2>
                    <p className="text-gray-600 mt-2"><strong>Ph.D. in Computer Science</strong> - Stanford University</p>
                    <p className="text-gray-600 mt-2"><strong>M.S. in Artificial Intelligence</strong> - MIT</p>
                    <p className="text-gray-600 mt-2"><strong>B.S. in Computer Science</strong> - UC Berkeley</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Research Interests</h2>
                    <ul className="list-disc pl-5 text-gray-600 mt-2">
                        {(profileData?.researchInterests?.length ?? 0) > 0 ? (
                            profileData?.researchInterests.map((interest, index) => (
                                <li key={index}>{interest}</li>
                            ))
                        ) : (
                            <li>No research interests listed.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
