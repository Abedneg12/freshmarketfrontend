import SuccessPage from "@/pages/auth/success-page";
import { Suspense } from "react";

export default function AuthSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
