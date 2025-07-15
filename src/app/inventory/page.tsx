'use client';
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';
import InventoryPage from '@/pages/Inventory-page/Inventory'
import React from 'react'

const Page = () => {
  return <InventoryPage />;
};

export default withSuperAdminAuth(Page);