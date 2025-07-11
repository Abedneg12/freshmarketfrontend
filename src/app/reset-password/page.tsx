import ResetPassword from "@/pages/reset-password-page";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
