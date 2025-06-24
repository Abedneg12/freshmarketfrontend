import React from 'react';
import { MetricCard } from './MetricCard';
import { StoreIcon, UsersIcon, DollarSignIcon, ShoppingBagIcon } from 'lucide-react';
export const StatsOverview: React.FC = () => {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Stores" value="124" icon={<StoreIcon className="h-6 w-6 text-white" />} trend={{
      value: '12%',
      positive: true
    }} color="bg-blue-500" />
      <MetricCard title="Total Users" value="24,521" icon={<UsersIcon className="h-6 w-6 text-white" />} trend={{
      value: '8.1%',
      positive: true
    }} color="bg-green-500" />
      <MetricCard title="Total Revenue" value="$2.4M" icon={<DollarSignIcon className="h-6 w-6 text-white" />} trend={{
      value: '4.3%',
      positive: true
    }} color="bg-purple-500" />
      <MetricCard title="Orders This Month" value="8,652" icon={<ShoppingBagIcon className="h-6 w-6 text-white" />} trend={{
      value: '2.3%',
      positive: false
    }} color="bg-orange-500" />
    </div>;
};