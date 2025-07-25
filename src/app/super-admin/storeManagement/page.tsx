'use client';
import StoreManagementPage from "@/pages/store-management";
import { Suspense } from "react";
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreManagementPage />
    </Suspense>
  );
};

export default withSuperAdminAuth(Page);