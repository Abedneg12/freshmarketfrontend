'use client';
import DiscountPage from '@/pages/Discount-page';
import withStoreAdminAuth from '@/components/common/StoreAdminAuth';

const Page = () => {
  return <DiscountPage />;
};

export default withStoreAdminAuth(Page);
