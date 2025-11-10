import React from 'react';

interface KPIItem {
    label: string;
    currentValue: string;
    targetValue: string;
    unit: string;
    currentPercent: number; // 0-100
    targetPercent: number;  // 0-100 (vị trí thanh mục tiêu)
}

const kpiData: KPIItem[] = [
    { label: "Hiệu suất nhân viên", currentValue: "87%", targetValue: "90%", unit: "hoàn thành", currentPercent: 87, targetPercent: 90 },
    { label: "Mức độ hài lòng", currentValue: "90%", targetValue: "100%", unit: "hoàn thành", currentPercent: 90, targetPercent: 100 },
    { label: "Tỷ lệ đạt lại", currentValue: "4.6/5", targetValue: "4.5/5", unit: "", currentPercent: 92, targetPercent: 90 }, // 4.6/5 = 92%
    { label: "Doanh thu/Khách", currentValue: "72%", targetValue: "75%", unit: "800Kđ", currentPercent: 72, targetPercent: 75 },
];

const KPIProgressBar = ({ item }: { item: KPIItem }) => {
    const isAchieved = item.currentPercent >= item.targetPercent;
    const statusLabel = isAchieved ? 'Đạt' : 'Chưa đạt';
    const statusColor = isAchieved ? 'bg-green-500' : 'bg-yellow-500';

    return (
        <div className="py-3 border-b last:border-b-0 border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800">{item.label}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusColor} text-white`}>
                    {statusLabel}
                </span>
            </div>

            <div className="flex justify-between text-sm mb-1">
                <p className="font-bold text-gray-900">{item.currentValue}</p>
                <p className="text-gray-500">Mục tiêu: {item.targetValue}</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                {/* Thanh Hiện tại */}
                <div 
                    className={`h-2.5 rounded-full ${isAchieved ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${item.currentPercent > 100 ? 100 : item.currentPercent}%` }}
                ></div>
                
                {/* Dấu Mục tiêu (Thanh dọc nhỏ) */}
                <div 
                    className="absolute top-0 h-full w-0.5 bg-red-500 transform -translate-x-1/2" 
                    style={{ left: `${item.targetPercent > 100 ? 100 : item.targetPercent}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between mt-1 text-xs text-gray-500">
                <p>{item.currentPercent}% {item.unit}</p>
                <p>{item.targetPercent}% mục tiêu</p>
            </div>
        </div>
    );
};

export default function PerformanceKPIs() {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Chi Tiêu KPI</h3>
            <div className="space-y-4">
                {kpiData.map((item, index) => (
                    <KPIProgressBar key={index} item={item} />
                ))}
            </div>
        </div>
    );
}