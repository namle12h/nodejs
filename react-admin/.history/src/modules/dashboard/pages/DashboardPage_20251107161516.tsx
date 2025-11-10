import { Title, Link } from "react-head";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
export default function DashboardPage() {
const stats = [
    {
      title: "Tổng Doanh Thu",
      value: "2,450,000,000 VND",
      iconBg: "bg-green-500",
      percent: "+12.5%",
    },
    {
      title: "Khách Hàng Mới",
      value: "1,247 người",
      iconBg: "bg-blue-500",
      percent: "+8.2%",
    },
    {
      title: "Lịch Hẹn Hoàn Thành",
      value: "3,892 lịch",
      iconBg: "bg-purple-500",
      percent: "+15.3%",
    },
    {
      title: "Tỷ Lệ Hài Lòng",
      value: "96.8 %",
      iconBg: "bg-pink-500",
      percent: "+2.1%",
    },
    {
      title: "Dịch Vụ Phổ Biến",
      value: "892 lượt",
      iconBg: "bg-indigo-500",
      percent: "+5.7%",
    },
    {
      title: "Thời Gian Chờ TB",
      value: "12 phút",
      iconBg: "bg-orange-500",
      percent: "-3.2%",
      percentColor: "text-red-500 bg-red-100",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-pink-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Thống Kê Spa</h2>
          <p className="text-gray-500">Tổng quan hiệu suất và doanh thu</p>
        </div>

        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2 bg-white shadow-sm">
            <option>30 ngày qua</option>
            <option>7 ngày qua</option>
            <option>Hôm nay</option>
          </select>

          <button className="border rounded-lg px-3 py-2 bg-white shadow-sm">
            Bộ lọc
          </button>

          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
            ⬇ Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg ${item.iconBg} mb-3`} />

            {/* Value */}
            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>

            {/* Title */}
            <p className="text-gray-500 text-sm mt-1">{item.title}</p>

            {/* Percent Tag */}
            <span
              className={`absolute top-4 right-4 text-sm font-semibold px-2 py-1 rounded-full
              ${
                item.percentColor
                  ? item.percentColor
                  : "text-green-600 bg-green-100"
              }`}
            >
              {item.percent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


