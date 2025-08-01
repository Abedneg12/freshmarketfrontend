'use client';
import withSuperAdminAuth from '@/components/common/SuperAdminAuth';
import InventoryJournalPage from '@/pages/InventoryJournal-page'
import React from 'react'

const Page = () => {
  return <InventoryJournalPage />;
};

export default withSuperAdminAuth(Page);