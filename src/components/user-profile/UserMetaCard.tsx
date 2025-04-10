"use client";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import axios from "axios";

export default function UserMetaCard({ data }: any) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    name: data?.title || "",
    email: data?.contactInfo || "",
    phone: data?.phone || "",
    place: data?.location || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const decodedToken: any = jwtDecode(token);
      const response = await axios.patch(
        `https://rf-backend-alpha.vercel.app/api/faculty/${decodedToken.facultyId}`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.place,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User data updated successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user/owner.jpg"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2 text-center xl:text-left">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                {formData.name}
              </h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">{formData.place}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{formData.phone}</div>
            </div>
            <div className="order-2 xl:order-3 xl:ml-auto">
              <button
                onClick={openModal}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col space-y-5 px-2">
            <div>
              <Label>Name</Label>
              <Input name="name" defaultValue={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" defaultValue={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" defaultValue={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Place</Label>
              <Input name="place" defaultValue={formData.place} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-3 pt-4 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
