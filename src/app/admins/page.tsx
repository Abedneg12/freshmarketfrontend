'use client';

import Admins from '@/pages/Admin-page/Admins';
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';

const Page = () => {
  return <Admins />;
};

export default withSuperAdminAuth(Page);
