'use client';
import withStoreAdminAuth from '@/components/common/StoreAdminAuth';
import StockReportsPage from '@/pages/Stock-Reports-page';
import React from 'react';

const Page = () => {
  return <StockReportsPage />;
};

export default withStoreAdminAuth(Page);