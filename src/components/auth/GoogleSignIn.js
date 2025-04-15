//googleSignIn.js
"use client";

import React from "react";
import { auth, provider, signInWithPopup } from "@/config/firebase";
import { useRouter } from "next/navigation";

const GoogleSignIn = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Firebase User:", user);
  
      const displayName = user.displayName;
      const email = user.email;
      const name = displayName || extractNameFromEmail(email);
  
      console.log("Signed in with:", email);
      console.log("Resolved Name:", name);
  
      localStorage.setItem("userName", name);
      localStorage.setItem("name", user.displayName || "");
      localStorage.setItem("email", user.email || "");

      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };
  

  const extractNameFromEmail = (email) => {
    const localPart = email.split('@')[0];
    const nameParts = localPart.split('.');

    const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';

    return `${firstName} ${lastName}`.trim();
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
