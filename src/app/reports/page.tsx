'use client';
import ReportsPage from "@/pages/Reports-page/Reports";
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <ReportsPage />;
};

export default withSuperAdminAuth(Page);