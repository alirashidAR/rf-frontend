'use client';

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  role: string;
  setRole: (role: string) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  profilePic?: string;
  setProfilePic?: (pic: string) => void;
  facultyId?: string;
  setFacultyId?: (id: string) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      const storedName = localStorage.getItem("name");
      const storedEmail = localStorage.getItem("email");
      const storedPic = localStorage.getItem("profilePic");
      const storedFacultyId = localStorage.getItem("facultyId");

      if (storedRole) setRole(storedRole);
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPic) setProfilePic(storedPic);
      if (storedFacultyId) setFacultyId(storedFacultyId);

      setLoading(false); // ✅ mark as loaded
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        name,
        setName,
        email,
        setEmail,
        profilePic,
        setProfilePic,
        facultyId,
        setFacultyId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
