'use client';
import UsersPage from "@/pages/Users-page";
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <UsersPage />;
};

export default withSuperAdminAuth(Page);
