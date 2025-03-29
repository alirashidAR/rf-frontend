import React from "react";

const ProfileDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Top Header */}
      <header className="bg-gray-800 text-white text-center py-3 text-lg font-semibold">
        Software-Project
      </header>
      
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center text-3xl font-bold">
            A
          </div>
          <div>
            <h1 className="text-2xl font-bold">Prof. Sarah Johnson</h1>
            <p className="text-gray-600">Computer Science Department</p>
            <a href="#" className="text-blue-600">Stanford University</a>
            <div className="mt-2 flex gap-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full">Machine Learning</span>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 text-sm rounded-full">AI</span>
              <span className="bg-green-100 text-green-600 px-3 py-1 text-sm rounded-full">Data Science</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</button>
          <button className="border px-4 py-2 rounded">Share</button>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-gray-600 mt-2">
            Professor of Computer Science with 15+ years of experience in AI and Machine Learning research. Leading multiple projects in healthcare applications of AI.
          </p>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <p className="text-gray-600 mt-2"><strong>Email:</strong> sarah.johnson@stanford.edu</p>
          <p className="text-gray-600"><strong>Office:</strong> Gates Building, Room 256</p>
          <p className="text-gray-600"><strong>Office Hours:</strong> Mon, Wed 2-4 PM</p>
        </div>
      </div>

      {/* Projects & Publications */}
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Projects */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold flex justify-between">Current Projects <a href="#" className="text-blue-600 text-sm">View All</a></h2>
          <div className="mt-2">
            <p className="font-semibold">AI in Healthcare Research</p>
            <p className="text-gray-600 text-sm">Developing ML models for early disease detection</p>
            <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">Active</span>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Natural Language Processing</p>
            <p className="text-gray-600 text-sm">Advanced text analysis algorithms</p>
            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 text-xs rounded-full">Ongoing</span>
          </div>
        </div>
        
        {/* Recent Publications */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Recent Publications</h2>
          <div className="mt-2">
            <p className="font-semibold">Machine Learning Applications in Healthcare</p>
            <p className="text-gray-600 text-sm">Journal of Medical AI, 2023</p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Deep Learning for Medical Image Analysis</p>
          </div>
        </div>
      </div>

      {/* Education & Research Interests */}
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Education</h2>
          <p className="text-gray-600 mt-2"><strong>Ph.D. in Computer Science</strong> - Stanford University</p>
          <p className="text-gray-600 mt-2"><strong>M.S. in Artificial Intelligence</strong> - MIT</p>
          <p className="text-gray-600 mt-2"><strong>B.S. in Computer Science</strong> - UC Berkeley</p>
        </div>
        
        {/* Research Interests */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Research Interests</h2>
          <ul className="list-disc pl-5 text-gray-600 mt-2">
            <li>Machine Learning & Deep Learning</li>
            <li>Natural Language Processing</li>
            <li>Healthcare AI Applications</li>
            <li>Computer Vision</li>
            <li>AI Ethics & Fairness</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
