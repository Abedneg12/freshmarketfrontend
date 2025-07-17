'use client';
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';
import InventoryPage from '@/pages/Inventory-page'
import React from 'react'

const Page = () => {
  return <InventoryPage />;
};

export default withSuperAdminAuth(Page);