import { useState } from "react";
import { useCustomerStats } from "../../../shared/services/statsApi";

// Biểu đồ đơn giản cho thanh tiến trình
interface ProgressItem {
    label: string;
    value: number;
    percent: string;
    color: string;
}

interface CustomerTypeProps {

    icon: React.ComponentType<any>;
    type: string;
    count: number;
    percent: string;
    color: string;
}
const ProgressBar = ({ label, value, percent, color }: ProgressItem) => (
    <div className="py-2">
        <div className="flex justify-between text-sm text-gray-700">
            <span>{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
                className="h-2.5 rounded-full"
                style={{ width: percent, backgroundColor: color }}
            ></div>
        </div>
        <p className="text-xs text-gray-500 text-right mt-1">{percent} tổng số</p>
    </div>
);

// Danh sách khách hàng
const CustomerType = ({
    icon: Icon, // Sau khi gán kiểu cho icon, Icon sẽ có kiểu tương ứng
    type,
    count,
    percent,
    color
}: CustomerTypeProps) => (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0 border-gray-100">
        <div className={`p-2 rounded-lg bg-pink-100/50 ${color}`}>
            {/* Giả định Icon là một React Component hoặc chỉ là placeholder */}
            <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
        <div>
            <p className="font-semibold text-gray-800">{type}</p>
            <p className="text-sm text-gray-500">
                {percent} tổng số
                <span className="font-semibold text-gray-800 ml-2">{count} người</span>
            </p>
        </div>
    </div>
);

// Dữ liệu mẫu (sử dụng màu Tailwind thay vì HEX để đơn giản)
const ageData = [
    { label: "18-25", value: 342, percent: "22.5%", color: "#ec4899" }, // pink-500
    { label: "26-35", value: 456, percent: "30%", color: "#a855f7" }, // purple-500
    { label: "36-45", value: 389, percent: "25.6%", color: "#3b82f6" }, // blue-500
    { label: "46-55", value: 234, percent: "15.4%", color: "#22c55e" }, // green-500
    { label: "55+", value: 98, percent: "6.5%", color: "#f97316" }, // orange-500
];

// Dữ liệu khách hàng
const customerData = [
    { type: "Khách hàng mới", count: 1247, percent: "45.2%", color: "#ec4899", Icon: () => '♀️' }, // Tạm dùng emoji
    { type: "Khách hàng quay lại", count: 892, percent: "32.3%", color: "#a855f7", Icon: () => '🔁' },
    { type: "Khách hàng VIP", count: 623, percent: "22.5%", color: "#f43f5e", Icon: () => '👑' },
];

export default function CustomerAnalysis() {

    const [startDate, setStartDate] = useState("2025-10-10");
    const [endDate, setEndDate] = useState("2025-11-10");
    const [period, setPeriod] = useState("last_30_days");
    const { data, isLoading, refetch } = useCustomerStats(startDate, endDate, period);

      if (isLoading) return <div>Loading...</div>;
    return (
        <div className="bg-white rounded-xl shadow p-6">

            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Phân Tích Khách Hàng</h3>
                <button className="text-pink-600 text-sm font-semibold hover:underline">Chi tiết</button>
            </div>

            {/* Phân Bố Độ Tuổi */}
            <h4 className="text-lg font-medium text-gray-700 mb-4">Phân Bố Độ Tuổi</h4>
            <div className="space-y-2">
                {ageData.map((item, i) => (
                    <ProgressBar
                        key={i}
                        label={item.label}
                        value={item.value}
                        percent={item.percent}
                        color={item.color}
                    />
                ))}
            </div>

            <div className="my-6 border-t border-gray-100"></div>

            {/* Phân Loại Khách Hàng */}
            <h4 className="text-lg font-medium text-gray-700 mb-4">Phân Loại Khách Hàng</h4>
            <div className="space-y-3">
                {customerData.map((item, i) => (
                    <CustomerType
                        key={i}
                        icon={item.Icon}
                        type={item.type}
                        count={item.count}
                        percent={item.percent}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}