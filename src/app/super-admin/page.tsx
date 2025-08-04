'use client';
import DashboardPage from '@/pages/Dashboard-page';
import React from 'react'
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <DashboardPage />;
};

export default withSuperAdminAuth(Page);
