// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  role: string;
  setRole: (role: string) => void;
  name: string;
  setName: (name: string) => void;
  profilePic?: string;
  setProfilePic?: (pic: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState("guest");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      const storedName = localStorage.getItem("name");
      const storedPic = localStorage.getItem("profilePic");

      if (storedRole) setRole(storedRole);
      if (storedName) setName(storedName);
      if (storedPic) setProfilePic(storedPic);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, name, setName, profilePic, setProfilePic }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
