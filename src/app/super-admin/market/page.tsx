import StoreManagementPage from "@/pages/Management-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreManagementPage />
    </Suspense>
  );
}
