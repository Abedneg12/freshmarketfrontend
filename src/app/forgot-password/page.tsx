import ForgotPasswordPage from "@/pages/forgot-password-page";
import { Suspense } from "react";

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}