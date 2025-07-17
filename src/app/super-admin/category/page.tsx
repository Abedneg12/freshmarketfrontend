'use client';
import CategoryPage from '@/pages/Category-page/Category';
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <CategoryPage />;
};

export default withSuperAdminAuth(Page);
