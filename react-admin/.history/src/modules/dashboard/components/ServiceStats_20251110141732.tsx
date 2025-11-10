import React, { useState } from "react";
import { useServiceStats } from "../../../shared/services/statsApi"; // Import hook từ API
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ServiceStats() {
    const [startDate, setStartDate] = useState("2025-10-10");
    const [endDate, setEndDate] = useState("2025-10-30");
    const [period, setPeriod] = useState("last_30_days");
    const { data, isLoading, refetch } = useServiceStats(startDate, endDate, period);

    // Hiển thị thông báo nếu đang tải dữ liệu
    if (isLoading) return <div>Loading...</div>;

    const total = data?.totalAppointments || 0;

       const topServices = data.appointmentsByService.slice(0, 5);

    // Gán màu thủ công nếu không có trường `color` trong dữ liệu API
    const colors = [
        "#ec4899", "#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#10b981", "#8b5cf6", "#ff6347"
    ];

    // Nếu dữ liệu từ API không có trường `color`, chúng ta sẽ gán màu thủ công
       const dataWithColors = topServices.map((item, index) => ({
        ...item,
        color: item.color || colors[index % colors.length] // Gán màu nếu không có trường `color`
    }));

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
                            data={dataWithColors} // Dữ liệu đã được gán màu
                            dataKey="totalAppointments" // Sử dụng `totalAppointments` để vẽ
                            innerRadius={45.1}
                            outerRadius={70.1}
                            stroke="none"
                            strokeWidth={0}
                        >
                            {dataWithColors.map((entry, i) => (
                                <Cell key={i} fill={entry.color} /> // Gán màu cho từng phần tử
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
            <div className="mt-3 text-left space-y-3">
                {dataWithColors.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                            <div>
                                <p className="font-medium">{item.serviceName}</p>
                                <p className="text-gray-500 text-sm">{item.totalAppointments} lượt đặt</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">{((item.totalAppointments / total) * 100).toFixed(1)}%</p>
                            <p className="text-gray-500 text-sm">{item.revenueShare} VND</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
