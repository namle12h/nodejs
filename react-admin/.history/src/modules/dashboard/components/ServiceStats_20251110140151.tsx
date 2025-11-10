import React, { useEffect, useState } from "react";
import { useServiceStats } from "../../../shared/services/statsApi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ServiceStats() {
    const [startDate, setStartDate] = useState<string>("2025-10-10");
    const [endDate, setEndDate] = useState<string>("2025-10-30");
    const [period, setPeriod] = useState<string>("last_30_days");

    // Gọi hook để lấy dữ liệu từ API
    const { data, isLoading, error } = useServiceStats(startDate, endDate, period);

    // Nếu dữ liệu đang tải hoặc có lỗi, hiển thị thông báo
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    // Tính tổng số cuộc hẹn từ dữ liệu API
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
                            data={data.appointmentsByService}
                            dataKey="value"
                            innerRadius={45.1}
                            outerRadius={70.1}
                            stroke="none"
                            strokeWidth={0}
                        >
                            {data.appointmentsByService.map((entry:any, i:any) => (
                                <Cell key={i} fill={entry.color} />
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
                {data.appointmentsByService.map((item:any, i:any) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-500 text-sm">{item.value} lượt đặt</p>
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
