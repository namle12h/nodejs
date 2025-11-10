import { useState, useEffect } from "react";
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
    icon: Icon,
    type,
    count,
    percent,
    color
}: CustomerTypeProps) => (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0 border-gray-100">
        <div className={`p-2 rounded-lg bg-pink-100/50 ${color}`}>
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

export default function CustomerAnalysis() {
    const [startDate, setStartDate] = useState("2025-10-10");
    const [endDate, setEndDate] = useState("2025-11-10");
    const [period, setPeriod] = useState("last_30_days");
    const { data, isLoading } = useCustomerStats(startDate, endDate, period);

    // Nếu dữ liệu đang tải, hiển thị thông báo "Loading..."
    if (isLoading) return <div>Loading...</div>;

    // Kiểu dữ liệu cho ageGroups từ API
    interface AgeGroups {
        "18-24": number;
        "25-34": number;
        "35-50": number;
    }

    // Đảm bảo TypeScript hiểu rằng `data.ageGroups` có kiểu `AgeGroups`
    const ageGroups = data.ageGroups as AgeGroups;

    // Dữ liệu phân bố độ tuổi
    const ageData = [
        {
            label: "18-24",
            value: ageGroups["18-24"],
            percent: `${(ageGroups["18-24"] / Object.values(ageGroups).reduce((a, b) => a + b, 0)) * 100}%`,
            color: "#ec4899"
        },
        {
            label: "25-34",
            value: ageGroups["25-34"],
            percent: `${(ageGroups["25-34"] / Object.values(ageGroups).reduce((a, b) => a + b, 0)) * 100}%`,
            color: "#a855f7"
        },
        {
            label: "35-50",
            value: ageGroups["35-50"],
            percent: `${(ageGroups["35-50"] / Object.values(ageGroups).reduce((a, b) => a + b, 0)) * 100}%`,
            color: "#3b82f6"
        },

    ];

    // Dữ liệu phân loại khách hàng
    const customerData = [
        {
            type: "Khách hàng mới",
            count: data.newCustomers,
            percent: `${Math.round((data.newCustomers / (data.newCustomers + data.returningCustomers + data.vipCustomers)) * 100)}%`,
            color: "#ec4899",
            Icon: () => '♀️'
        },
        {
            type: "Khách hàng quay lại",
            count: data.returningCustomers,
           percent: `${Math.round((data.returningCustomers / (data.newCustomers + data.returningCustomers + data.vipCustomers)) * 100)}%`, 
            color: "#a855f7",
            Icon: () => '🔁'
        },
        {
            type: "Khách hàng VIP",
            count: data.vipCustomers,
            percent: `${Math.round((data.newCustomers / (data.newCustomers + data.returningCustomers + data.vipCustomers)) * 100)}%`,
            color: "#f43f5e",
            Icon: () => '👑'
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow p-6">
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
