"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ComponentCard from "@/components/common/ComponentCard";

const FormElements = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    type: "", // Enum: ProjectType
    startDate: "",
    endDate: "",
    status: "ONGOING", // Default
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const savedData = localStorage.getItem("savedProject");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSaveDraft = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("savedProject", JSON.stringify(formData));

      // Send data to the server as JSON in the body
      const response = await axios.post(
        "/api/projects/save-draft",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Draft saved successfully:", response.data);

      // Navigate to another page
      router.push("/admin");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <ComponentCard title="Create New Research Project" desc="Post a new research opportunity for student collaboration">
        <ComponentCard title="Basic Information" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            <label className="block text-gray-500 font-small mb-1">Project Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded h-24" />
          </div>
        </ComponentCard>

        <ComponentCard title="Project Details" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">Keywords (comma separated)</label>
            <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            <label className="block text-gray-500 font-small mb-1">Faculty ID</label>
            <label className="block text-gray-500 font-small mb-1">Project Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="RESEARCH">Research</option>
              <option value="INDUSTRY">Industry</option>
            </select>
          </div>
        </ComponentCard>

        <ComponentCard title="Timeline" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 font-small mb-1">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-500 font-small mb-1">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Project Status" className="mt-4">
          <label className="block text-gray-500 font-small mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAUSED">Paused</option>
          </select>
        </ComponentCard>

        <div className="mt-6 flex justify-between">
          <button onClick={handleSaveDraft} className="border border-gray-400 text-gray-600 px-6 py-2 rounded hover:bg-gray-100">
            Save Draft
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Publish Project
          </button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default FormElements;