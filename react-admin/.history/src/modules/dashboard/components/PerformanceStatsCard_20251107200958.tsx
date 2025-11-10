import React from 'react';
import { DollarSign, User, CheckCircle, Star, Clock, Repeat2, ArrowUp, ArrowDown } from 'lucide-react';

interface StatItem {
    id: number;
    title: string;
    value: string;
    icon: React.ReactNode;
    iconColor: string;
    percent: string;
    percentColor: string;
}

const statsData: StatItem[] = [
    { id: 1, title: "Tổng doanh thu", value: "125.8M", icon: <DollarSign className="w-6 h-6" />, iconColor: "bg-blue-500", percent: "12.5%", percentColor: "text-green-500" },
    { id: 2, title: "Số lượng khách hàng", value: "2,847", icon: <User className="w-6 h-6" />, iconColor: "bg-blue-500", percent: "8.2%", percentColor: "text-green-500" },
    { id: 3, title: "Tỷ lệ hoàn thành", value: "94.2%", icon: <CheckCircle className="w-6 h-6" />, iconColor: "bg-teal-500", percent: "2.1%", percentColor: "text-red-500" },
    
    { id: 4, title: "Đánh giá trung bình", value: "4.8/5", icon: <Star className="w-6 h-6" />, iconColor: "bg-yellow-500", percent: "0.3%", percentColor: "text-green-500" },
    { id: 5, title: "Thời gian chờ TB", value: "12 phút", icon: <Clock className="w-6 h-6" />, iconColor: "bg-purple-500", percent: "5.4%", percentColor: "text-green-500" },
    { id: 6, title: "Tỷ lệ quay lại", value: "68.5%", icon: <Repeat2 className="w-6 h-6" />, iconColor: "bg-indigo-500", percent: "5.7%", percentColor: "text-green-500" },
];

const getArrowIcon = (percent: string, percentColor: string) => {
    const isPositive = percentColor !== "text-red-500";
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
        <span className={`flex items-center text-xs font-semibold ${percentColor}`}>
            <Icon className="w-3 h-3 mr-0.5" />
            {percent}
        </span>
    );
};


export default function PerformanceStatsCard() {
    return (
        <div className="space-y-6">
            {/* <h3 className="text-xl font-semibold text-gray-800">Chỉ Số Hiệu Suất</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {statsData.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-start">
                        
                        {/* Nội dung trái: Giá trị và Tiêu đề */}
                        <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h4>
                            <p className="text-sm font-medium text-gray-500">{item.title}</p>
                        </div>

                        {/* Nội dung phải: Icon và Percent */}
                        <div className="flex flex-col items-end space-y-2">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${item.iconColor}`}>
                                {item.icon}
                            </div>
                            {/* Percent */}
                            {getArrowIcon(item.percent, item.percentColor)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}