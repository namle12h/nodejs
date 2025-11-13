import { useState } from 'react';
import { DollarSign, User, CheckCircle, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { usePerformanceStats } from '../../../shared/services/statsApi';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CategoryIcon from '@mui/icons-material/Category';
import type { Dayjs } from 'dayjs';

interface StatItem {
    id: number;
    title: string;
    value: string;
    icon: React.ReactNode;
    iconColor: string;
    percent: string;
    percentColor: string;
}

interface PerformanceStatsProps {
    startDate: Dayjs;
    endDate: Dayjs;
}

// Hàm để lấy biểu tượng mũi tên thay đổi (tăng/giảm)
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

// Hàm định dạng số thành đơn vị triệu hoặc nghìn
const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[^\d.-]/g, '')); // Loại bỏ ký tự không phải số
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`; // Format theo triệu
    } else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`; // Format theo nghìn
    }
    return num.toString();
};

export default function PerformanceStatsCard({ startDate, endDate }: PerformanceStatsProps) {
    const [period, setPeriod] = useState("last_30_days");
    const { data, isLoading } = usePerformanceStats(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
        period
    );

    console.log("startDate", startDate)
    console.log("endDate", startDate)
    console.log("period", period)
    console.log("Data", data)
    // Khi dữ liệu đang tải, hiển thị Loading
    if (isLoading) return <div>Loadindata.totalRevenueg...</div>;

    // Dữ liệu thống kê được hiển thị
    const statsData: StatItem[] = [
        {
            id: 1,
            title: "Tổng doanh thu",
            value: data?.totalRevenue ? formatCurrency(data.totalRevenue.toString()) : "0",
            icon: <DollarSign className="w-6 h-6" />,
            iconColor: "bg-blue-500",
            percent: "12.5%",
            percentColor: "text-green-500"
        },
        {
            id: 4,
            title: "Số lượng khách hàng",
            value: data?.customerCount ? data.customerCount.toString() : "0",
            icon: <User className="w-6 h-6" />,
            iconColor: "bg-blue-500",
            percent: "8.2%",
            percentColor: "text-green-500"
        },
        {
            id: 5,
            title: "Tỷ lệ hoàn thành",
            value: data?.completionRate ? `${data.completionRate}%` : "0%",
            icon: <CheckCircle className="w-6 h-6" />,
            iconColor: "bg-teal-500",
            percent: "2.1%",
            percentColor: "text-red-500"
        },
        {
            id: 6,
            title: "Đánh giá trung bình",
            value: data?.averageRating ? data.averageRating.toFixed(1) : "0",
            icon: <Star className="w-6 h-6" />,
            iconColor: "bg-yellow-500",
            percent: "0.3%",
            percentColor: "text-green-500"
        },
        {
            id: 2,
            title: "Doanh thu sản phẩm",
            value: data?.productRevenue ? formatCurrency(data.productRevenue.toString()) : "0",
            icon: <CategoryIcon className="w-6 h-6" />,
            iconColor: "bg-purple-500",
            percent: "5.4%",
            percentColor: "text-green-500"
        },
        {
            id: 3,
            title: "Doanh thu dịch vụ",
            value: data?.serviceRevenue ? formatCurrency(data.serviceRevenue.toString()) : "0",
            icon: <VolunteerActivismIcon className="w-6 h-6" />,
            iconColor: "bg-indigo-500",
            percent: "5.7%",
            percentColor: "text-green-500"
        },
    ];

    return (
        <div className="space-y-6">
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
