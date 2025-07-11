import VerifyPage from "@/pages/auth/verify-page";
import { Suspense } from "react";

export default function verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />
    </Suspense>
  );
}