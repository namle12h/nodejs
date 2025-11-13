import {
 ArrowUp, ArrowDown
} from 'lucide-react';
import { useRevenueStats } from '../../../shared/services/statsApi';

interface RevenueStatsProps {
  mode: string;
  year: number;
}

const TrendItem = ({ label, amount, change, up }: any) => {
  const changeColor = up ? 'text-green-600' : 'text-red-500';
  const Icon = up ? ArrowUp : ArrowDown;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-700">{label}</p>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-900">{amount}</span>
        <span className={`flex items-center text-xs font-semibold ${changeColor}`}>
          <Icon className="w-3 h-3 mr-0.5" />
          {change}%
        </span>
      </div>
    </div>
  );
};

const ServiceItem = ({ name, appointments, revenue, change, up }: any) => {
  const changeColor = up ? 'text-green-600' : 'text-red-500';
  const Icon = up ? ArrowUp : ArrowDown;

  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col">
        <p className="font-semibold text-left text-gray-800">{name}</p>
        <p className="text-xs text-left text-gray-500">{appointments} lượt đặt</p>
      </div>
      <div className="text-right">
        <span className="font-semibold text-gray-900 block">{revenue}</span>
        <span className={`flex items-center text-xs font-semibold ${changeColor} justify-end`}>
          <Icon className="w-3 h-3 mr-0.5" />
          {change}%
        </span>
      </div>
    </div>
  );
};

export default function RevenueAndServiceTrends({ mode, year }: RevenueStatsProps) {
  const { data, isLoading } = useRevenueStats("month", year);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // API trả về revenueTrends trong response
  const trends = data.revenueTrends || [];
   const topService = data.topServices || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Cột Trái: Xu Hướng Doanh Thu */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-xl text-left font-semibold text-gray-800 mb-4">
          Xu Hướng Doanh Thu
        </h3>

        <div className="space-y-2">
          {trends.map((trend: any, index: number) => (
            <TrendItem key={index} {...trend} />
          ))}
        </div>
      </div>

      {/* Cột Phải: Top Dịch Vụ (chưa có API nên tạm dùng mock) */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-xl text-left font-semibold text-gray-800 mb-4">
          Top Dịch Vụ
        </h3>

        <div className="space-y-2">
          {topService.map((trend: any, index: number) => (
            <ServiceItem key={index} {...trend} />
          ))}
        </div>
      </div>

    </div>
  );
}
