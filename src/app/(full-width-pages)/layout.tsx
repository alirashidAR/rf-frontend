// app/auth/layout.tsx
import AuthLayout from "../auth/layout";
import React from "react";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
