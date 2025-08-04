import { Suspense } from "react";
import RegisterPage from "@/pages/register-page";

export default function Register() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage/>
        </Suspense>
    </div>
  );
}