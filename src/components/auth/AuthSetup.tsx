"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNameFromEmail } from "./getNameFromEmail";

export default function AuthSetup({ email }: { email: string }) {
  const { setName } = useAuth();

  useEffect(() => {
    if (email) {
      const name = getNameFromEmail(email);
      setName(name);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
    }
  }, [email]);

  return null;
}
