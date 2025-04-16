'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// Define types
interface Project {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface ProfileData {
    user: {
        name: string;
        email: string;
        profilePicUrl: string;
        bio: string;
        department: string;
        researchInterests: string[];
        location: string;
        phone: string;
        projectsParticipated: { project: Project }[];
    };
    contactInfo: string;
    researchAreas: string[];
    phone: string;
    location: string;
}

export default function UserProfile() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

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

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    const projects = profileData?.user.projectsParticipated ?? [];

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
            {/* Header */}
            <header className="bg-gray-800 text-white text-center py-4 text-xl font-semibold rounded-md">
                Profile Dashboard
            </header>

            {/* Profile Card */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {profileData?.user.profilePicUrl ? (
                        <img
                            src={profileData.user.profilePicUrl}
                            alt={profileData.user.name}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profileData?.user.name?.charAt(0) || "N"}
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold">{profileData?.user.name}</h1>
                        <p className="text-gray-600">{profileData?.user.department}</p>
                        <a href={`mailto:${profileData?.contactInfo}`} className="text-blue-600 break-all">
                            {profileData?.contactInfo}
                        </a>
                        <p className="mt-2 text-gray-600">{profileData?.user.bio}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {profileData?.researchAreas.map((interest, index) => (
                                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="max-w-4xl mx-auto mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Research Projects</h2>
                    {projects.length > 0 ? (
                        <div className="mt-4 space-y-4">
                            {projects.map((projectData, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-semibold">{projectData.project.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{projectData.project.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-2">No current projects</p>
                    )}
                </div>
            </div>

            {/* Contact Information */}
            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <div className="mt-2 space-y-2">
                        <p><strong>Phone:</strong> {profileData?.phone || 'N/A'}</p>
                        <p><strong>Location:</strong> {profileData?.location || 'N/A'}</p>
                    </div>
                </div>

                {/* Research Interests */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Research Interests</h2>
                    {(profileData?.researchAreas ?? []).length > 0 ? (
                        profileData?.researchAreas?.map((interest, index) => (
                            <p key={index} className="text-gray-600">{interest}</p>
                        ))
                    ) : (
                        <p>No research interests listed.</p>
                    )}
                </div>
            </div>

            {/* Modal for All Projects */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">All Projects</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black">✕</button>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {projects.map((projectData, index) => (
                                <div key={index} className="border-b pb-2">
                                    <p className="font-semibold">{projectData.project.title}</p>
                                    <p className="text-gray-600 text-sm">{projectData.project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
