import { AuthProvider } from "@/context/AuthContext";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div>{children}</div>
    </AuthProvider>
  );
}
