'use client';

import SignInForm from '@/components/auth/SignInForm';
import AuthLayout from '@/app/(full-width-pages)/(auth)/layout';

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
