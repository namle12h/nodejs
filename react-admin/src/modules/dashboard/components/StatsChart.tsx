import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useRevenueStats } from "../../../shared/services/statsApi";

interface RevenueStatsProps {
  mode: string;
  year: number;
}


export default function StatsChart({ mode, year }: RevenueStatsProps) {


  const { data, isLoading } = useRevenueStats("month", year);
  if (isLoading) return <div>Loading...</div>;


  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">Biểu Đồ Doanh Thu</h3>
          <p className="text-gray-500 text-sm">So sánh doanh thu thực tế và mục tiêu</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span> Thực tế
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-300"></span> Mục tiêu
          </div>
        </div>
      </div>

      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.chartData || []}>
            <XAxis dataKey="label" />
            <Tooltip />
            <Legend />
            <Bar dataKey="real" fill="#ec4899" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" fill="#d1d5db" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="flex justify-around mt-4 text-center">
        <div>
          <h3 className="text-2xl font-bold"> {data?.totalRevenue?.toLocaleString()}</h3>
          <p className="text-gray-500 text-sm">Tổng doanh thu</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-600">          {data?.growthPercent}%</h3>
          <p className="text-gray-500 text-sm">Tăng trưởng</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-600">{data?.targetAchieved}%</h3>
          <p className="text-gray-500 text-sm">Đạt mục tiêu</p>
        </div>
      </div>
    </div>
  );
}
