"use client";

import ProfilePage from "@/pages/profile-page";
import React from 'react'
import withAuth from '@/components/common/Auth';

const Page = () => {
  return <ProfilePage />;
};

export default withAuth(Page);
