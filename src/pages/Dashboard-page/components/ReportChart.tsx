import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
interface ChartData {
  name: string;
  [key: string]: string | number;
}
interface ReportChartProps {
  data: ChartData[];
  type: 'bar' | 'line';
  title: string;
}
export const ReportChart: React.FC<ReportChartProps> = ({
  data,
  type,
  title
}) => {
  const renderChart = () => {
    if (type === 'bar') {
      return <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#4ade80" />
            <Bar dataKey="orders" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>;
    } else {
      return <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#4ade80" activeDot={{
            r: 8
          }} />
            <Line type="monotone" dataKey="orders" stroke="#60a5fa" />
          </LineChart>
        </ResponsiveContainer>;
    }
  };
  return <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {renderChart()}
    </div>;
};