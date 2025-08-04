import OrderHistoryPage from '@/pages/order-history-page'
import React from 'react'
import withAuth from '@/components/common/Auth';

const Page = () => {
  return <OrderHistoryPage />;
};

export default withAuth(Page);
