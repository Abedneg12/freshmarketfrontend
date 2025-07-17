'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import Navbar from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import SuperAdminDashboard from '@/components/layout/SuperAdmin/Layout';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { fetchUserProfile } from '@/lib/redux/slice/authSlice';

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
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (isAuthenticated && user?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard>{children}</SuperAdminDashboard>;
  } else {
    console.log(user);
    return <><Navbar />{children}<Footer /></>;
  }

}