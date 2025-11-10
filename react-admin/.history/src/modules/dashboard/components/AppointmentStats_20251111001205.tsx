import { useState } from "react";

// Dữ liệu Lịch hẹn theo ngày
const dailyData = [
    { day: "T2", count: 45 },
    { day: "T3", count: 52 },
    { day: "T4", count: 38 },
    { day: "T5", count: 67 },
    { day: "T6", count: 89 },
    { day: "T7", count: 78 },
    { day: "CN", count: 92 },
];

// Dữ liệu Khung giờ phổ biến
const timeSlotData = [
    { time: "8:00-10:00", count: 45, percent: "12.5%" },
    { time: "10:00-12:00", count: 78, percent: "21.7%" },
    { time: "12:00-14:00", count: 34, percent: "9.4%" },
    { time: "14:00-16:00", count: 89, percent: "24.7%" },
    { time: "16:00-18:00", count: 67, percent: "18.6%" },
    { time: "18:00-20:00", count: 48, percent: "13.3%" },
];

// Dữ liệu Trạng thái (để tạo chú thích)
const statusLegend = [
    { label: "Thấp", color: "#f87171" }, // red-400
    { label: "Bình thường", color: "#22c55e" }, // green-500
    { label: "Cao", color: "#3b82f6" }, // blue-500
    { label: "Đỉnh", color: "#a855f7" }, // purple-500
];

export default function AppointmentStats() {

    const [startDate, setStartDate] = useState("2025-10-10");
    const [endDate, setEndDate] = useState("2025-11-10");
    const [period, setPeriod] = useState("last_30_days");
    const { data, isLoading } = useServiceStats(startDate, endDate, period);

    // Nếu dữ liệu đang tải, hiển thị thông báo "Loading..."
    if (isLoading) return <div>Loading...</div>;
    return (
        <div className="bg-white rounded-xl shadow p-6">

            {/* Tiêu đề & Chú thích trạng thái */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Thống Kê Lịch Hẹn</h3>
                </div>
                <p className="text-gray-500 text-sm">Phân tích thời gian và tần suất đặt lịch</p>
                <div className="mt-3 flex gap-4 text-xs text-gray-600">
                    <span className="font-semibold">Trạng thái:</span>
                    {statusLegend.map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lịch Hẹn Theo Ngày */}
            <h4 className="text-lg font-medium text-gray-700 mb-4">Lịch Hẹn Theo Ngày</h4>
            <div className="flex justify-between items-end border-b pb-3 border-gray-100">
                {dailyData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        {/* Thanh Bar (chỉ là div mô phỏng, cần tính toán chiều cao thực tế) */}
                        <div
                            className="w-4 rounded-t-lg transition-all duration-300"
                            style={{
                                height: `${item.count / 1.5}px`, // Chiều cao mô phỏng
                                backgroundColor: item.count > 80 ? '#a855f7' : (item.count > 60 ? '#3b82f6' : (item.count > 40 ? '#22c55e' : '#f87171'))
                            }}
                        ></div>
                        <p className="text-xs text-gray-800 font-medium mt-1">{item.count}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.day}</p>
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-gray-100"></div>

            {/* Khung Giờ Phổ Biến */}
            <h4 className="text-lg font-medium text-gray-700 mb-4">Khung Giờ Phổ Biến</h4>
            <div className="space-y-3">
                {timeSlotData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <p className="text-gray-700 font-medium">{item.time}</p>
                        <div className="text-right">
                            <p className="text-gray-800 font-semibold">{item.count}</p>
                            <p className="text-gray-500 text-xs">{item.percent}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <StatBox label="Lịch tuần này" value={461} color="text-pink-600" />
                <StatBox label="Tăng trưởng" value={1.5} color="text-green-500" />
                <StatBox label="Tỷ lệ hoàn thành" value={92} color="text-blue-500" />
            </div>

        </div>
    );
}

interface AgeData {
    label: string; // Kiểu string cho '18-25', '26-35', v.v.
    value: number; // Kiểu number cho số lượng (342, 456, v.v.)
    color: string;
}

// Component phụ cho ô thống kê dưới cùng
const StatBox = ({ label, value, color }: AgeData) => (
    <div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
);