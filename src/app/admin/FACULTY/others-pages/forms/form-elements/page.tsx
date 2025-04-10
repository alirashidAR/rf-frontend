"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ComponentCard from "@/components/common/ComponentCard";
import { useAuth } from "@/context/AuthContext";


interface FormData {
  title: string;
  description: string;
  keywords: string[];
  type: "RESEARCH" | "INDUSTRY" | "";
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  positionsAvailable: number;
  location: "REMOTE" | "ON_CAMPUS" | "";
  requirements: string[];
  status: "ONGOING" | "COMPLETED" | "PENDING";
}

const formatToDateTimeLocal = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const formatToISOString = (localString: string) => {
  if (!localString) return "";
  const date = new Date(localString);
  return date.toISOString();
};

const FormElements = () => {
  const router = useRouter();
  const { facultyId } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    keywords: [],
    type: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    positionsAvailable: 0,
    location: "",
    requirements: [],
    status: "ONGOING",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.title.trim()) errors.title = "Project title is required.";
    if (!formData.description.trim()) errors.description = "Description is required.";
    if (!formData.keywords.length) errors.keywords = "At least one keyword is required.";
    if (!formData.type) errors.type = "Select a valid project type.";
    if (!formData.startDate) errors.startDate = "Start date is required.";
    if (!formData.endDate) errors.endDate = "End date is required.";
    if (!formData.applicationDeadline) errors.applicationDeadline = "Application deadline is required.";
    if (formData.positionsAvailable <= 0) errors.positionsAvailable = "Must be at least 1 position.";
    if (!formData.location) errors.location = "Select a location.";
    if (!formData.requirements.length) errors.requirements = "Enter at least one requirement.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const isDateField = ["startDate", "endDate", "applicationDeadline"].includes(name);
    const formattedValue = isDateField ? new Date(value).toISOString() : value;
  
    if (name === "keywords") {
      setFormData({ ...formData, keywords: value.split(",").map((kw) => kw.trim()) });
    } else if (name === "positionsAvailable") {
      setFormData({ ...formData, positionsAvailable: Number(value) });
    } else {
      setFormData({ ...formData, [name]: formattedValue  });
    }
  };

  // Load draft data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("savedProject");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData({
          ...parsedData,
          keywords: Array.isArray(parsedData.keywords)
            ? parsedData.keywords
            : parsedData.keywords.split(",").map((kw: string) => kw.trim()), // Ensure keywords is an array
        });
      }
    } catch (error) {
      console.error("Error loading saved project:", error);
    }
  }, []);

  // Save draft function
  const handleSaveDraft = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("savedProject", JSON.stringify(formData));
      console.log("Draft saved to localStorage:", formData);
      // Send data to the server
      const response = await axios.post(
        "https://rf-backend-alpha.vercel.app/api/projects/create", // Use environment variable
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      console.log("Draft saved successfully:", response.data);

      // Navigate to admin page
      router.push("/admin/FACULTY");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handlePublishProject = async () => {
    if (!validateForm()) {
      console.warn("Form has validation errors.");
      return;
    }
    try {
      console.log(localStorage.getItem("token"));
      
      const response = await axios.post(
        "https://rf-backend-alpha.vercel.app/api/projects/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Project published successfully:", response.data);
      router.push("/admin/FACULTY/others-pages/blank"); // Redirect after successful publish
    } catch (error) {
      console.error("Error publishing project:", error);
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto p-8">
      <ComponentCard
        title="Create New Research Project"
        desc="Post a new research opportunity for student collaboration"
      >
        {/* Basic Information */}
        <ComponentCard title="Basic Information" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />

            <label className="block text-gray-500 font-small mb-1">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded h-24"
            />
          </div>
        </ComponentCard>

        {/* Project Details */}
        <ComponentCard title="Project Details" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords.join(", ")} // Join array into a string for display
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />

            <label className="block text-gray-500 font-small mb-1">
              Project Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Type</option>
              <option value="RESEARCH">Research</option>
              <option value="INDUSTRY">Industry</option>
            </select>
          </div>
        </ComponentCard>

        {/* Timeline */}
        <ComponentCard title="Timeline" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 font-small mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formatToDateTimeLocal(formData.startDate)}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-small mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formatToDateTimeLocal(formData.endDate)}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Application Deadline" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 font-small mb-1">
                Date
              </label>
              <input
                type="datetime-local"
                name="applicationDeadline"
                value={formatToDateTimeLocal(formData.applicationDeadline)}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Project Requirements" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">
              Requirements for applicants (comma separated)
            </label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements.join(", ")} // Join array into a string for display
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirements: e.target.value.split(",").map((req) => req.trim()),
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />

          </div>
        </ComponentCard>
        
        <ComponentCard title="Positions Available" className="mt-4">
          <div className="space-y-4">
            <label className="block text-gray-500 font-small mb-1">
              {/* Positions Available */}
            </label>
            <input
              type="number"
              name="positionsAvailable"
              value={formData.positionsAvailable}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Project Location" className="mt-4">
          <label className="block text-gray-500 font-small mb-1">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Location</option>
            <option value="ON_CAMPUS">On Campus</option>
            <option value="REMOTE">Remote</option>
          </select>
        </ComponentCard>
        

        {/* Project Status */}
        <ComponentCard title="Project Status" className="mt-4">
          <label className="block text-gray-500 font-small mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>
        </ComponentCard>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="border border-gray-400 text-gray-600 px-6 py-2 rounded hover:bg-gray-100"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublishProject}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Publish Project
          </button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default FormElements;
