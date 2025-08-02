import React from 'react';
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: string;
}
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  color
}) => {
  return <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend && <div className={`ml-2 flex items-baseline text-sm font-semibold ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                  <span>
                    {trend.positive ? '+' : '-'}
                    {trend.value}
                  </span>
                </div>}
            </dd>
          </div>
        </div>
      </div>
    </div>;
};