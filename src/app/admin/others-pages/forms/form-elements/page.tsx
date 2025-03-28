"use client";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";

const FormElements = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    duration: string;
    skills: string;
    prerequisites: string;
    startDate: string;
    deadline: string;
    milestones: string;
    documents: File[];
  }>({
    title: "",
    description: "",
    category: "Computer Science",
    duration: "",
    skills: "",
    prerequisites: "",
    startDate: "",
    deadline: "",
    milestones: "",
    documents: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Filter valid files (max size 10MB, accepted formats)
    const validFiles = files.filter(file => 
      file.size <= 10 * 1024 * 1024 && /\.(pdf|doc|docx)$/i.test(file.name)
    );

    if (validFiles.length !== files.length) {
      alert("Some files were not added due to size limit (10MB) or invalid format.");
    }

    // Update state to store multiple files
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("savedProject");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem("savedProject", JSON.stringify(formData));
    router.push("/admin"); // ✅ Redirect user
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <ComponentCard title="Create New Research Project" desc="Post a new research opportunity for student collaboration">

      <ComponentCard title="Basic Information" className="mt-4">
          <div className="space-y-4">
          <label className="block text-gray-500 font-small mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              // placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label className="block text-gray-500 font-small mb-1">Project Description</label>
            <textarea
              name="description"
              // placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded h-24"
            />
            <div className="flex gap-4">
              {/* Category Field */}
              <div className="w-1/2">
                <label htmlFor="category" className="block text-gray-500 font-small mb-1">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={formData.category}
                  disabled
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded cursor-not-allowed"
                />
              </div>

              {/* Duration Field */}
              <div className="w-1/2">
                <label htmlFor="duration" className="block text-gray-500 font-small mb-1">
                  Duration (months)
                </label>
                <input
                  id="duration"
                  type="number"
                  name="duration"
                  // placeholder="Enter duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </ComponentCard>
        
        {/* Requirements & Skills */}
        <ComponentCard title="Requirements & Skills" className="mt-4">
          <div className="space-y-4">
          <label className="block text-gray-500 font-small mb-1">Required Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="Add skills separated by commas"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label className="block text-gray-500 font-small mb-1">Prerequisites</label>
            <textarea
              name="prerequisites"
              // placeholder="Prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded h-20"
            />
          </div>
        </ComponentCard>

        {/* Timeline & Milestones */}
        <ComponentCard title="Timeline & Milestones" className="mt-4">
        <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-gray-500 font-small mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-gray-500 font-small mb-1">
            Application Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="milestones" className="block text-gray-500 font-small mb-1">
          Key Milestones
        </label>
        <textarea
          id="milestones"
          name="milestones"
          // placeholder="Enter key milestones"
          value={formData.milestones}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded h-24"
        />
      </div>
        </ComponentCard>

        {/* Additional Documents */}
        <ComponentCard title="Additional Documents" className="mt-4">
          <div className="border border-dashed border-gray-400 rounded p-6 text-center">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
            <label htmlFor="file-upload" className="cursor-pointer text-blue-600">
              Drag and drop files here, or <span className="underline">browse</span>
            </label>
            <p className="text-gray-500 text-sm mt-2">PDF, DOC, DOCX up to 10MB</p>

            {selectedFiles.length > 0 && (
              <ul className="mt-3 text-gray-700 text-sm">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center border p-2 rounded mt-1">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    <button onClick={() => removeFile(index)} className="text-red-500 ml-2">✖</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ComponentCard>

        {/* Buttons */}
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
