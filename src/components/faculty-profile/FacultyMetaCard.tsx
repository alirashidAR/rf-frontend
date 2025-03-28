"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-4 flex flex-col items-center md:flex-row md:justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} VIT Vellore. All rights reserved.
        </p>
        <nav className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            Terms of Use
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}
