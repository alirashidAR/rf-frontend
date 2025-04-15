import { AuthProvider } from "@/context/AuthContext";
import AuthLayout from "./(auth)/layout";


export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthLayout>
        <div>{children}</div>
      </AuthLayout>
    </AuthProvider>
  );
}
