'use client';
import CategoryPage from '@/pages/Category-page/Category';
import withStoreAdminAuth from '@/components/common/StoreAdminAuth';

const Page = () => {
  return <CategoryPage />;
};

export default withStoreAdminAuth(Page);
