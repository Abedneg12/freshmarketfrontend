import AuthErrorContent from "@/pages/auth/error-page";
import { Suspense } from "react";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
