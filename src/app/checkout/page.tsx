'use client';
import CheckoutPage from '@/pages/checkout-page';
import React from 'react'
import withAuth from '@/components/common/Auth';

const Page = () => {
  return <CheckoutPage />;
};

export default withAuth(Page);
