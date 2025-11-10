import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function StatsChart() {
  const data = [
    { name: "T1", real: 45, target: 40 },
    { name: "T2", real: 50, target: 45 },
    { name: "T3", real: 48, target: 44 },
    { name: "T4", real: 70, target: 55 },
    { name: "T5", real: 65, target: 52 },
    { name: "T6", real: 75, target: 60 },
    { name: "T7", real: 85, target: 70 },
    { name: "T8", real: 92, target: 78 },
    { name: "T9", real: 82, target: 74 },
    { name: "T10", real: 95, target: 80 },
    { name: "T11", real: 100, target: 85 },
    { name: "T12", real: 110, target: 90 },
  ];

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
          <BarChart data={data}>
            <XAxis dataKey="name" />
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
          <h3 className="text-2xl font-bold">2.45B</h3>
          <p className="text-gray-500 text-sm">Tổng doanh thu</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-600">+12.5%</h3>
          <p className="text-gray-500 text-sm">Tăng trưởng</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-600">96.2%</h3>
          <p className="text-gray-500 text-sm">Đạt mục tiêu</p>
        </div>
      </div>
    </div>
  );
}
