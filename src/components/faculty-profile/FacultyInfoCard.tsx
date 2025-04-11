"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "../form/input/InputField";

export default function FacultyListPage({ data }: any) {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (faculty: any) => {
    setSelectedFaculty(faculty);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedFaculty(null);
  };

  const filteredFaculty = data.filter((faculty:any) => {
    const search = searchTerm.toLowerCase();
    return (
      faculty.title?.toLowerCase().includes(search) ||
      faculty.user?.name?.toLowerCase().includes(search) ||
      faculty.specialization?.join(", ").toLowerCase().includes(search) ||
      faculty.researchAreas?.join(", ").toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Faculty Members
      </h2>

      <Input
        placeholder="Search by name, specialization, or research area..."
        className="mb-6"
        defaultValue={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {filteredFaculty.map((faculty:any) => (
          <div
            key={faculty.id}
            className="p-4 border border-gray-200 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              {faculty.title || faculty.user?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> {faculty.user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Specializations:</strong>{" "}
              {faculty.specialization?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Research Areas:</strong>{" "}
              {faculty.researchAreas?.join(", ") || "N/A"}
            </p>
            <Button size="sm" className="mt-3" onClick={() => openModal(faculty)}>
              View Details
            </Button>
          </div>
        ))}
      </div>

      {selectedFaculty && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedFaculty.title || selectedFaculty.user?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> {selectedFaculty.user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Specializations:</strong>{" "}
              {selectedFaculty.specialization?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Research Areas:</strong>{" "}
              {selectedFaculty.researchAreas?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Bio:</strong> {selectedFaculty.bio || "N/A"}
            </p>
            <Button size="sm" variant="outline" className="mt-4" onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
