import OrderHistoryPage from '@/pages/order-history-page'
import React from 'react'
import { Suspense } from 'react'


export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <OrderHistoryPage/>
        </Suspense>
  )
}