"use client"
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";

const metadata: Metadata = {
  title: "Profile",
  description: "This is the Profile page for Research Faculty Finder.",
};

// const dummyDATA ={
//   title: "Alex Rashid",
//   contactInfo: "ali1234@vit.ac.in",
//   specialization: ["Computer Vision", "Deep Learning", "Machine Learning"],
//   bio: "A passionate researcher",
//   researchAreas: ["Computer Vision"],
//   officeHours: "Monday & Wednesday, 2PM - 4PM"
// }

const fetchData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const decodedToken: any = jwtDecode(token);
  const facultyId = decodedToken.facultyId;
  console.log(decodedToken);
  const res = await axios.get(`https://rf-backend-alpha.vercel.app/api/faculty/${facultyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  return res.data;
};

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData()
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard data={data} />
          { <UserInfoCard data={data} />/*
          <UserAddressCard data={data} /> */}
        </div>
      </div>
    </div>
  );
}
