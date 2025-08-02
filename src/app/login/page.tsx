import LoginPage from "@/pages/login-page";
import { Suspense } from "react";

export default function login() {
  return (
    <div>
           <Suspense fallback={<div>Loading form...</div>}>
            <LoginPage />
          </Suspense>
    </div>
  );
}
