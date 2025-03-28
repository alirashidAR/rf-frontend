"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

const facultyList = [
  {
    id: 1,
    name: "Dr. John Doe",
    school: "School of Computer Science",
    position: "Professor",
    researchInterest: "Artificial Intelligence, Machine Learning",
    openings: 2,
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    school: "School of Electrical Engineering",
    position: "Associate Professor",
    researchInterest: "Embedded Systems, IoT",
    openings: 1,
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    school: "School of Mathematics",
    position: "Assistant Professor",
    researchInterest: "Fractals, Topology",
    openings: 3,
  },
];

export default function FacultyListPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<{
    id: number;
    name: string;
    school: string;
    position: string;
    researchInterest: string;
    openings: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (faculty: {
    id: number;
    name: string;
    school: string;
    position: string;
    researchInterest: string;
    openings: number;
  }) => {
    setSelectedFaculty(faculty);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Faculty Members
      </h2>
      <div className="space-y-4">
        {facultyList.map((faculty) => (
          <div
            key={faculty.id}
            className="p-4 border border-gray-200 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              {faculty.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>School:</strong> {faculty.school}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Position:</strong> {faculty.position}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Research Interests:</strong> {faculty.researchInterest}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Openings:</strong> {faculty.openings}
            </p>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => openModal(faculty)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      {selectedFaculty && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedFaculty.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>School:</strong> {selectedFaculty.school}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Position:</strong> {selectedFaculty.position}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Research Interests:</strong> {selectedFaculty.researchInterest}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Openings:</strong> {selectedFaculty.openings}
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
