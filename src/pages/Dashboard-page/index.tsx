import React from 'react';
import { StatsOverview } from './components/StatsOverview';
import { ReportChart } from './components/ReportChart';
export default function DashboardPage() {
  const revenueData = [{
    name: 'Jan',
    revenue: 4000,
    orders: 2400
  }, {
    name: 'Feb',
    revenue: 3000,
    orders: 1398
  }, {
    name: 'Mar',
    revenue: 2000,
    orders: 9800
  }, {
    name: 'Apr',
    revenue: 2780,
    orders: 3908
  }, {
    name: 'May',
    revenue: 1890,
    orders: 4800
  }, {
    name: 'Jun',
    revenue: 2390,
    orders: 3800
  }, {
    name: 'Jul',
    revenue: 3490,
    orders: 4300
  }];
  const categoryData = [{
    name: 'Produce',
    revenue: 4000,
    orders: 2400
  }, {
    name: 'Dairy',
    revenue: 3000,
    orders: 1398
  }, {
    name: 'Bakery',
    revenue: 2000,
    orders: 9800
  }, {
    name: 'Meat',
    revenue: 2780,
    orders: 3908
  }, {
    name: 'Frozen',
    revenue: 1890,
    orders: 4800
  }, {
    name: 'Beverages',
    revenue: 2390,
    orders: 3800
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          A summary of your grocery business performance.
        </p>
      </div>
      <StatsOverview />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ReportChart data={revenueData} type="line" title="Revenue & Orders Trend" />
        <ReportChart data={categoryData} type="bar" title="Performance by Category" />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        New store{' '}
                        <span className="font-medium text-gray-900">
                          Southside Market
                        </span>{' '}
                        was added
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      2h ago
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Monthly report for{' '}
                        <span className="font-medium text-gray-900">
                          Downtown Grocery
                        </span>{' '}
                        is ready
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      1d ago
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Inventory alert for{' '}
                        <span className="font-medium text-gray-900">
                          Westside Market
                        </span>{' '}
                        - low stock on 5 items
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      2d ago
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>;
};