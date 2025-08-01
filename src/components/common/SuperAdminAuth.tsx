'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const withSuperAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
          toast.error('You must be logged in to view this page.');
          router.replace('/login');
        } else if (user?.role !== 'SUPER_ADMIN') {
          toast.error('You are not authorized to view this page.');
          router.replace('/');
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withSuperAdminAuth;
