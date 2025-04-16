'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Project {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Publication {
    id: string;
    title: string;
    journal: string;
    year: number;
}

interface FacultyProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        profilePicUrl: string;
        bio: string;
        department: string;
    };
    projects: Project[];
    publications: Publication[];
    phone: string;
    location: string;
    researchAreas: string[];
}

export default function FacultyProfilePage() {
    const {role}=useAuth();
    const { id } = useParams();
    const [profileData, setProfileData] = useState<FacultyProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const response = await axios.get(
                    `https://rf-backend-alpha.vercel.app/api/faculty/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const formattedData = {
                    ...response.data,
                    phone: response.data.phone || 'Not provided',
                    location: response.data.location || 'Not provided',
                    researchAreas: response.data.researchAreas || []
                };
                setProfileData(formattedData);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (id) fetchFacultyData();
    }, [id]);

    if (loading) return <div className="p-6">Loading faculty profile...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!profileData) return <div className="p-6">No faculty data found</div>;

    return (
        <div className="bg-[#f4f8fa] min-h-screen p-4 sm:p-8">
            {/* Top Card: Name, Email, Keywords */}
            <div className="max-w-5xl mx-auto flex flex-row items-center gap-6 bg-white rounded-2xl shadow p-8 mb-8">
                {profileData.user.profilePicUrl ? (
                    <img
                        src={profileData.user.profilePicUrl}
                        alt={profileData.user.name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {profileData.user.name.charAt(0)}
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-1">{profileData.user.name}</h1>
                    <a href={`mailto:${profileData.user.email}`} className="text-blue-600 block mb-2">
                        {profileData.user.email}
                    </a>
                    <div className="flex flex-wrap gap-2">
                        {profileData.researchAreas.map((area, idx) => (
                            <span
                                key={idx}
                                className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full"
                            >
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Research Projects: Full width */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-xl font-semibold mb-4">Research Projects</h2>
              {profileData.projects.length > 0 ? (
                profileData.projects.map((project, idx) => (
                  <div key={idx} className="mb-3 border-l-2 border-blue-500 pl-3">
                    <Link href={`/admin/${role}/others-pages/projects/${project.id}`}>
                      <span className="font-medium text-blue-700 hover:underline cursor-pointer">
                        {project.title}
                      </span>
                    </Link>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No current projects</p>
              )}
            </div>

            {/* Bottom: Contact & Publications, side by side */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow p-8">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <p className="mb-2"><span className="font-bold">Phone:</span> {profileData.phone}</p>
                    <p><span className="font-bold">Office location:</span> {profileData.location}</p>
                </div>
                {/* Publications */}
                <div className="bg-white rounded-2xl shadow p-8">
                    <h2 className="text-xl font-semibold mb-4">Publications</h2>
                    {profileData.publications.length > 0 ? (
                        profileData.publications.map((pub, idx) => (
                            <div key={idx} className="mb-3 border-l-2 border-blue-500 pl-3">
                                <p className="font-medium">{pub.title}</p>
                                <p className="text-sm text-gray-600">{pub.journal} ({pub.year})</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No publications listed</p>
                    )}
                </div>
            </div>
        </div>
    );
}
