//authSetup.tsx
'use client';

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNameFromEmail } from "./getNameFromEmail";

export default function AuthSetup({ email }: { email: string }) {
  const { setName, setEmail } = useAuth();

  useEffect(() => {
    console.log("AuthSetup loaded with email:", email);
    if (email) {
      const name = getNameFromEmail(email);
      console.log("Setting name and email in context:", name, email);
      setName(name);
      setEmail(email);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
    } else {
      console.warn("No email provided to AuthSetup.");
    }
  }, [email, setName, setEmail]);

  return null;
}
