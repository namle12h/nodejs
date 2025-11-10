import React, { useState } from 'react';
import { ArrowDownToLine, ChevronDown, Filter } from "lucide-react";
import StatsChart from "../components/StatsChart";
import ServiceStats from "../components/ServiceStats";
import CustomerAnalysis from "../components/CustomerAnalysis";
import AppointmentStats from "../components/AppointmentStats";
import AdvancedFilters from "../components/AdvancedFilters"; // Giả định đã có
import { CheckCircleOutlined, DollarOutlined, ScheduleOutlined, UserAddOutlined } from '@ant-design/icons';

// ===================================================
// I. CÁC COMPONENT PHỤ CẦN THIẾT
// ===================================================

const tabs = [
  { id: 'overview', label: 'Tổng Quan' },
  { id: 'performance', label: 'Hiệu Suất' },
  { id: 'analysis', label: 'Phân Tích' },
  { id: 'realtime', label: 'Thời Gian Thực' },
];

const PlaceholderContent = ({ tab }: { tab: string }) => (
  <div className="p-8 bg-white rounded-xl shadow-md text-center text-gray-500 border border-gray-100 h-96">
    Nội dung chi tiết cho tab "{tab}" sẽ được tải tại đây.
  </div>
);

// Tab Navigation Component
function TabNavigation({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <div className="w-full">
      {/* Thanh Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                            px-4 py-3 text-sm font-medium transition-colors relative
                            ${activeTab === tab.id
                ? 'text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
              }
                        `}
          >
            {tab.label}
            {/* Thanh gạch chân màu hồng khi tab được chọn */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transition-all duration-200"></span>
            )}
          </button>
        ))}
      </div>

      {/* Nội dung Tab */}
      <div className="p-0">
        {activeTab === 'overview' && <div className="space-y-6">{children}</div>}
     {activeTab === 'performance' && (
          <div className="space-y-6">
            <PerformanceStatsCard />
            <PerformanceKPIs />
            <RevenueAndServiceTrends />
          </div>
        )}
        {activeTab === 'analysis' && <PlaceholderContent tab="Phân Tích" />}
        {activeTab === 'realtime' && <PlaceholderContent tab="Thời Gian Thực" />}
      </div>
    </div>
  );
}


// ===================================================
// II. MAIN COMPONENT (DashboardPage)
// ===================================================

export default function DashboardPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 👈 State Tab mới

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  // Dữ liệu stats ĐÃ SỬA ĐỔI để khớp với thiết kế (màu sắc Icon và màu percent)
  const stats = [
    { title: "Doanh Thu Hôm Nay", value: "12,450,000₫", iconBg: "bg-green-500", percent: "+12.5% so với hôm qua", icon: <DollarOutlined />, percentColor: "text-green-600", iconColor: "bg-green-500" },
    { title: "Lịch Hẹn Hôm Nay", value: "24", iconBg: "bg-blue-500", percent: "+8.2% so với hôm qua", icon: <ScheduleOutlined  />, percentColor: "text-green-600", iconColor: "bg-blue-500" },
    { title: "Khách Hàng Mới", value: "8", iconBg: "bg-purple-500", percent: "+15.3% so với hôm qua", icon: <UserAddOutlined />, percentColor: "text-green-600", iconColor: "bg-purple-500" },
    { title: "Tỷ Lệ Hoàn Thành", value: "94.2%", iconBg: "bg-teal-500", percent: "-2.1% so với hôm qua", percentColor: "text-red-500", icon: <CheckCircleOutlined />, iconColor: "bg-teal-500" },
  ];

  return (
    <div className="w-full min-h-screen bg-pink-50 p-6">

      {/* HEADER - KHÔNG THAY ĐỔI */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Thống Kê Spa</h2>
          <p className="text-gray-500">Tổng quan hiệu suất và doanh thu</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select className="p-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white pr-8 shadow-sm">
              <option>30 ngày qua</option>
              <option>7 ngày qua</option>
              <option>Hôm nay</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <button
            onClick={toggleFilters}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm border ${isFiltersVisible
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>

          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" />
            **Xuất báo cáo**
          </button>
        </div>
      </div>

      {/* BỘ LỌC NÂNG CAO - HIỂN THỊ TRÊN CÁC TAB */}
      {isFiltersVisible && (
        <div className="mb-6">
          <AdvancedFilters />
        </div>
      )}

      {/* 👈 BỌC NỘI DUNG CHÍNH BẰNG TAB NAVIGATION */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab}>

        {/* Nội dung Tab TỔNG QUAN (Chỉ hiển thị khi activeTab='overview') */}

        {/* Cards - SỬ DỤNG BỐ CỤC 4 CỘT HIỆN ĐẠI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100" // Loại bỏ hover:shadow-lg
            >
              {/* BỐ CỤC CHÍNH: Title và Icon nằm trên cùng một hàng */}
              <div className="flex justify-between items-center">

                {/* Cột Trái: Title, Value, Percent */}
                <div>
                  <p className="text-sm text-left  font-medium text-gray-500 mb-2">
                    {item.title}
                  </p>

                  {/* Value */}
                  <h3 className="text-2xl text-left font-bold text-gray-900 mb-2">
                    {item.value}
                  </h3>

                  {/* Percent Tag */}
                  <p className={`text-xs text-left  font-semibold ${item.percentColor || "text-green-600"}`}>
                    {item.percent}
                  </p>
                </div>

                {/* Cột Phải: Icon */}
                <div className={`w-10 h-10  rounded-lg flex items-center justify-center  text-white text-xl shadow-lg ${item.iconColor || item.iconBg}`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts và Phân tích */}
        <div className="mt-6 space-y-6">

          {/* Hàng 1: Biểu đồ lớn (Chart) và Biểu đồ tròn (Donut/Pie) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><StatsChart /></div>
            <div className="lg:col-span-1"><ServiceStats /></div>
          </div>

          {/* Hàng 2: Phân tích Khách hàng và Lịch hẹn (Chia đều 2 cột) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerAnalysis />
            <AppointmentStats />
          </div>
        </div>

      </TabNavigation>
    </div>
  );
}