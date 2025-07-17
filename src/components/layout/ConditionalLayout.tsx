'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import SuperAdminDashboard from '@/components/layout/SuperAdmin/Layout';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { fetchProfile } from '@/lib/redux/slice/profileSlice';
import StoreAdminLayout from './StoreAdmin/Layout';


export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  console.log('User:', user);
  useEffect(() => {
    if (localStorage.getItem('token') && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (isAuthenticated && user?.data?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard>{children}</SuperAdminDashboard>;
  } else if (isAuthenticated && user?.data?.role === 'STORE_ADMIN') {
    return <StoreAdminLayout>{children}</StoreAdminLayout>;
  } 
  else {
    console.log(user);
    return <><Navbar />{children}<Footer /></>;
  }

}