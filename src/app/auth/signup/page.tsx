'use client';

import SignUpForm from '@/components/auth/SignUpForm';
import AuthLayout from '@/app/(full-width-pages)/(auth)/layout';

export default function SignUpPage() {
  return(
  <AuthLayout>
        <SignUpForm />
    </AuthLayout>
  );

}
