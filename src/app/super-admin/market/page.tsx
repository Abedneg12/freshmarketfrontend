import StoreManagementPage from "@/pages/Store-Management-page";
import { Suspense } from "react";

export default function Stores() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreManagementPage />
    </Suspense>
  );
}
