import OrderHistoryPage from '@/pages/order-history-page'
import React, { Suspense } from 'react'
import withAuth from '@/components/common/Auth';

function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <OrderHistoryPage />
    </Suspense>
  )
}
export default withAuth(page);