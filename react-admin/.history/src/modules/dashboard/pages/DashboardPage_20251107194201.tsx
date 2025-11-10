import React, { useState } from 'react';
import { ArrowDownToLine, ChevronDown, Filter } from "lucide-react";
import StatsChart from "../components/StatsChart";
import ServiceStats from "../components/ServiceStats";
import CustomerAnalysis from "../components/CustomerAnalysis";
import AppointmentStats from "../components/AppointmentStats";
import AdvancedFilters from "../components/AdvancedFilters"; // Giả định đã có

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
                {activeTab === 'performance' && <PlaceholderContent tab="Hiệu Suất" />}
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

    const stats = [
        // Dữ liệu stats (đã làm giàu với icon placeholder)
        { title: "Tổng Doanh Thu", value: "2,450,000,000 VND", iconBg: "bg-green-500", percent: "+12.5%", icon: '💰' },
        { title: "Khách Hàng Mới", value: "1,247 người", iconBg: "bg-blue-500", percent: "+8.2%", icon: '🧑‍🤝‍🧑' },
        { title: "Lịch Hẹn Hôm Nay", value: "3,892 lịch", iconBg: "bg-purple-500", percent: "+15.3%", icon: '📅' },
        { title: "Doanh Thu Hôm Nay", value: "15,000,000 VND", iconBg: "bg-pink-500", percent: "+2.1%", icon: '🗓️' },
        { title: "Tỷ lệ quay lại", value: "68.5%", iconBg: "bg-red-500", percent: "-3.2%", percentColor: "text-red-500 bg-red-100", icon: '🔁' },
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
                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm border ${
                            isFiltersVisible 
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
                
                {/* Cards (8 cột, dùng grid-cols-4 để cân đối 2 hàng) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative border border-gray-100"
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg ${item.iconBg} mb-3 flex items-center justify-center text-white text-xl`}>
                                {item.icon}
                            </div>
                            {/* Value */}
                            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                            {/* Title */}
                            <p className="text-gray-500 text-sm mt-1">{item.title}</p>
                            {/* Percent Tag */}
                            <span
                                className={`absolute top-4 right-4 text-sm font-semibold px-2 py-1 rounded-full ${item.percentColor ? item.percentColor : "text-green-600 bg-green-100"}`}
                            >
                                {item.percent}
                            </span>
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