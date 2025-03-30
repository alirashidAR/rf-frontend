import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for a new account",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
