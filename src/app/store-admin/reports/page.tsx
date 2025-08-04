'use client';
import ReportsPage from "@/pages/Reports-page";
import withStoreAdminAuth from "@/components/common/StoreAdminAuth";

const Page = () => {
  return <ReportsPage />;
};

export default withStoreAdminAuth(Page);