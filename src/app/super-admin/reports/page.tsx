'use client';
import ReportsPage from "@/pages/Reports-page";
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <ReportsPage />;
};

export default withSuperAdminAuth(Page);