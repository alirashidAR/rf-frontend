"use client";

import React from "react";
import { auth, provider, signInWithPopup } from "@/config/firebase";
import { useRouter } from "next/navigation";

const GoogleSignIn = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email.endsWith("@vit.ac.in") || email.endsWith("@vitstudent.ac.in")) {
        console.log("Signed in as:", email);
        // Redirect or perform desired action
        router.push("/dashboard"); // Change as needed
      } else {
        alert("Only VIT emails are allowed.");
        auth.signOut(); // Sign out if unauthorized
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
