import React from 'react';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

// Dữ liệu Xu hướng
const revenueTrends = [
    { period: "Tuần này", amount: "28.5M", change: 12.5, isUp: true },
    { period: "Tuần trước", amount: "25.3M", change: 8.2, isUp: true },
    { period: "Tháng này", amount: "125.8M", change: 15.7, isUp: true },
    { period: "Tháng trước", amount: "108.9M", change: 5.4, isUp: false },
];

// Dữ liệu Top Dịch vụ
const topServices = [
    { name: "Massage toàn thân", appointments: 156, revenue: "18.2M", change: 15.2, isUp: true },
    { name: "Chăm sóc da mặt", appointments: 134, revenue: "15.8M", change: 12.8, isUp: true },
    { name: "Massage đá nóng", appointments: 98, revenue: "12.6M", change: 8.9, isUp: true },
];

const TrendItem = ({ period, amount, change, isUp }: { period: string, amount: string, change: number, isUp: boolean }) => {
    const changeColor = isUp ? 'text-green-600' : 'text-red-500';
    const Icon = isUp ? ArrowUp : ArrowDown;

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <p className="text-sm text-gray-700">{period}</p>
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

const ServiceItem = ({ name, appointments, revenue, change, isUp }: { name: string, appointments: number, revenue: string, change: number, isUp: boolean }) => {
    const changeColor = isUp ? 'text-green-600' : 'text-red-500';
    const Icon = isUp ? ArrowUp : ArrowDown;

    return (
        <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex flex-col">
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{appointments} lượt đặt</p>
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

export default function RevenueAndServiceTrends() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Cột Trái: Xu Hướng Doanh Thu */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Xu Hướng Doanh Thu</h3>
                <div className="space-y-2">
                    {revenueTrends.map((trend, index) => (
                        <TrendItem key={index} {...trend} />
                    ))}
                </div>
            </div>

            {/* Cột Phải: Top Dịch Vụ */}
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <h3 className="text-xl text-left font-semibold text-gray-800 mb-4">Top Dịch Vụ</h3>
                <div className="space-y-2">
                    {topServices.map((service, index) => (
                        <ServiceItem key={index} {...service} />
                    ))}
                </div>
            </div>
        </div>
    );
}