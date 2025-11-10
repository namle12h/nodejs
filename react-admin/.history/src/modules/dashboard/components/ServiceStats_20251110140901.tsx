import {
    PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { useServiceStats } from "../../../shared/services/statsApi";
import { useState } from "react";


export default function ServiceStats() {

    const [startDate, setStartDate] = useState("2025-10-10");
    const [endDate, setEndDate] = useState("2025-10-30");
    const [period, setPeriod] = useState("last_30_days")
    const { data, isLoading, refetch } = useServiceStats(startDate, endDate, period);
    // const data = [
    //     { name: "Massage Thư Giãn", value: 892, percent: "24.1%", color: "#ec4899", money: "445M VND" },
    //     { name: "Chăm Sóc Da Mặt", value: 756, percent: "20.4%", color: "#a855f7", money: "378M VND" },
    //     { name: "Tắm Trắng Toàn Thân", value: 634, percent: "17.1%", color: "#3b82f6", money: "317M VND" },
    //     { name: "Nail Art & Spa", value: 523, percent: "14.1%", color: "#22c55e", money: "262M VND" },
    // ];

    // Hiển thị thông báo nếu đang tải dữ liệu
    if (isLoading) return <div>Loading...</div>;


    const total = data?.totalAppointments || 0;

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Thống Kê Dịch Vụ</h3>
                    <p className="text-gray-500 text-sm">Phân tích hiệu suất các dịch vụ spa</p>
                </div>
                <button className="text-pink-600 text-sm font-semibold hover:underline">Xem chi tiết</button>
            </div>

            {/* Donut chart */}
            <div className="h-48 relative flex justify-center items-center">
                <ResponsiveContainer width="60%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            innerRadius={45.1} // THAY ĐỔI
                            outerRadius={70.1} // THAY ĐỔI
                            stroke="none"
                            strokeWidth={0}
                        >
                            {data.appointmentsByService.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.color}
                                    stroke="none" // Trở về "none" để không dùng viền trắng
                                    strokeWidth={0} // Trở về 0
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Middle text */}
                <div className="absolute text-center">
                    <h3 className="text-2xl font-bold">{total}</h3>
                    <p className="text-gray-500 text-sm">Tổng lịch hẹn</p>
                </div>
            </div>

            {/* List */}
            <div className="mt-3 space-y-3">
                {data.appointmentsByService.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                            <div>
                                <p className="font-medium">{item.serviceName}</p>
                                <p className="text-gray-500 text-sm">{item.totalAppointments} lượt đặt</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">{item.percent}</p>
                            <p className="text-gray-500 text-sm">{item.money}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
