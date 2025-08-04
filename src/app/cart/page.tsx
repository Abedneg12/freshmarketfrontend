import CartPage from "@/pages/cart-page";
import React from 'react'
import withAuth from '@/components/common/Auth';

const Page = () => {
  return <CartPage />;
};

export default withAuth(Page);
