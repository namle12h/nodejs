import React from 'react';

// ===================================================
// I. ĐỊNH NGHĨA INTERFACE VÀ DỮ LIỆU
// ===================================================

interface KPIItem {
    label: string;
    currentValue: string;
    targetValue: string;
    unit: string;
    currentPercent: number; // 0-100
    targetPercent: number;  // 0-100 (vị trí thanh mục tiêu)
}

// Dữ liệu mẫu đã được điều chỉnh để khớp với bố cục 4 cột
const kpiData: KPIItem[] = [
    { label: "Hiệu suất nhân viên", currentValue: "87%", targetValue: "90%", unit: "hoàn thành", currentPercent: 87, targetPercent: 90 },
    { label: "Mức độ hài lòng", currentValue: "4.6/5", targetValue: "4.5/5", unit: "hoàn thành", currentPercent: 92, targetPercent: 90 },
    { label: "Tỷ lệ đạt lại", currentValue: "72%", targetValue: "75%", unit: "", currentPercent: 72, targetPercent: 75 }, 
    { label: "Doanh thu/Khách", currentValue: "850Kđ", targetValue: "800Kđ", unit: "hoàn thành", currentPercent: 95, targetPercent: 90 }, 
];

// ===================================================
// II. COMPONENT THANH TIẾN TRÌNH KPI
// ===================================================

const KPIProgressBar = ({ item }: { item: KPIItem }) => {
    // Logic xác định trạng thái Đạt/Chưa đạt
    const isAchieved = item.currentPercent >= item.targetPercent;
    const statusLabel = isAchieved ? 'Đạt' : 'Chưa đạt';
    // Màu sắc cho nhãn trạng thái (text-white đã được loại bỏ theo hình ảnh)
    const statusColor = isAchieved ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700';
    
    // Màu sắc cho thanh tiến trình
    const barColor = isAchieved ? 'bg-green-500' : 'bg-yellow-500';

    return (
        // Khối đơn lẻ, loại bỏ border vì chúng ta dùng gap trong grid
        <div className="flex flex-col space-y-2">
            
            {/* Hàng 1: Tiêu đề và Status */}
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColor}`}>
                    {statusLabel}
                </span>
            </div>

            {/* Hàng 2: Hiện tại & Mục tiêu */}
            <div className="grid grid-cols-2 text-sm space-x-4">
                
                {/* Cột Trái: Hiện tại */}
                <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Hiện tại</p>
                    <p className="font-bold text-gray-900">{item.currentValue}</p>
                </div>
                
                {/* Cột Phải: Mục tiêu */}
                <div className="space-y-1 text-right">
                    <p className="text-gray-500 text-xs">Mục tiêu</p>
                    <p className="font-bold text-gray-900">{item.targetValue}</p>
                </div>
            </div>

            {/* Hàng 3: Thanh tiến trình */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative mt-3">
                {/* Thanh Hiện tại (Thanh này sẽ có màu Vàng/Xanh lá) */}
                <div 
                    className={`h-2.5 rounded-full ${barColor}`}
                    style={{ width: `${item.currentPercent > 100 ? 100 : item.currentPercent}%` }}
                ></div>
            </div>
            
             {/* Text dưới thanh tiến trình (Ví dụ: 96.7% hoàn thành) */}
             <div className="flex justify-between mt-1 text-xs text-gray-500">
                <p>{item.currentPercent}% {item.unit}</p>
                <p>{item.targetPercent}% mục tiêu</p>
            </div>
        </div>
    );
};

// ===================================================
// III. MAIN COMPONENT
// ===================================================

export default function PerformanceKPIs() {
    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Chi Tiêu KPI</h3>
            
            {/* SỬ DỤNG GRID ĐỂ TẠO BỐ CỤC 4 CỘT - KHỚP VỚI HÌNH ẢNH */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((item, index) => (
                    <KPIProgressBar key={index} item={item} />
                ))}
            </div>
        </div>
    );
}