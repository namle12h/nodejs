
import StatsChart from "../components/StatsChart";
import ServiceStats from "../components/ServiceStats";
import CustomerAnalysis from "../components/CustomerAnalysis";
import AppointmentStats from "../components/AppointmentStats";
import { useState } from "react";
import AdvancedFilters from "../components/AdvancedFilters";
import { ArrowDownToLine, ChevronDown, Filter } from "lucide-react";
export default function DashboardPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
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
      title: "Doanh Thu Ngày",
      value: "15,000,000 VND",
      iconBg: "bg-pink-500",
      percent: "+2.1%",
    },
    {
      title: "Danh Thu Theo Dịch Vụ",
      value: "1,355,500,000 VND",
      iconBg: "bg-indigo-500",
      percent: "+5.7%",
    },
    {
      title: "Danh Thu Theo Sản Phẩm",
      value: "672,500,000 VND",
      iconBg: "bg-orange-500",
      percent: "-3.2%",
      percentColor: "text-red-500 bg-red-100",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-pink-50 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Thống Kê Spa</h2>
          <p className="text-gray-500">Tổng quan hiệu suất và doanh thu</p>
        </div>

        <div className="flex gap-3">

          {/* Select Khoảng thời gian */}
          <div className="relative">
            <select className="p-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white pr-8 shadow-sm">
              <option>30 ngày qua</option>
              <option>7 ngày qua</option>
              <option>Hôm nay</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* NÚT BỘ LỌC - GẮN LOGIC ẨN/HIỆN */}
          <button
            onClick={toggleFilters} // 👈 Gắn hàm toggleFilters
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm border ${isFiltersVisible
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>

          {/* Nút Xuất báo cáo */}
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" />
            **Xuất báo cáo**
          </button>
        </div>
      </div>

      {/* BỘ LỌC NÂNG CAO - CHỈ HIỂN THỊ KHI isFiltersVisible LÀ TRUE */}
      {isFiltersVisible && (
        // Truyền state xuống AdvancedFilters component
        <div className="mb-6">
          <AdvancedFilters />
        </div>
      )}

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
              ${item.percentColor
                  ? item.percentColor
                  : "text-green-600 bg-green-100"
                }`}
            >
              {item.percent}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <StatsChart />
        <ServiceStats />
        <CustomerAnalysis />
        <AppointmentStats />
      </div>
    </div>
  );
}


