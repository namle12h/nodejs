import { ArrowUp, ArrowDown, Settings, Calendar, User, ShoppingBag } from 'lucide-react';
import { DollarOutlined } from '@ant-design/icons';

// ===================================================
// DỮ LIỆU MẪU
// ===================================================

interface TrendCardItem {
    period: string;
    currentValue: string;
    prevValue: string;
    changePercent: number; // 7.5, 14.2, v.v.
    isUp: boolean;
}

interface DetailComparisonItem extends TrendCardItem {
    changeAmount: number; // 0.2, 2.3, v.v.
}

// Dữ liệu cho các thẻ xu hướng chính
const trendCards: TrendCardItem[] = [
    { period: "Hôm nay", currentValue: "2.9M₫", prevValue: "2.6M₫", changePercent: 7.5, isUp: true },
    { period: "Tuần này", currentValue: "18.5M₫", prevValue: "16.2M₫", changePercent: 14.2, isUp: true },
    { period: "Tháng này", currentValue: "125.8M₫", prevValue: "108.9M₫", changePercent: 15.5, isUp: true },
    { period: "Quý này", currentValue: "365.4M₫", prevValue: "312.8M₫", changePercent: 16.8, isUp: true },
];

// Dữ liệu cho khối chi tiết so sánh
const detailComparison: DetailComparisonItem[] = [
    { period: "Hôm nay", currentValue: "2.9M₫", prevValue: "2.6M₫", changePercent: 7.5, changeAmount: 0.2, isUp: true },
    { period: "Tuần này", currentValue: "18.5M₫", prevValue: "16.2M₫", changePercent: 14.2, changeAmount: 2.3, isUp: true },
    { period: "Tháng này", currentValue: "125.8M₫", prevValue: "108.9M₫", changePercent: 15.5, changeAmount: 16.9, isUp: true },
    { period: "Quý này", currentValue: "365.4M₫", prevValue: "312.8M₫", changePercent: 16.8, changeAmount: 52.6, isUp: true },
];

// Dữ liệu Phân tích Khách hàng (Mô phỏng)
const customerActivity = {
    totalAppointments: 4,
    lastActivity: "12/11/2025",
    totalSpent: "15.3M₫",
    customerTier: "VIP Gold",
};

// Dữ liệu Lịch sử Giao dịch/Lịch hẹn
const transactionHistory = [
    { type: "Dịch vụ Tắm Trắng", date: "10/11", amount: "5.3M₫", status: "Hoàn thành" },
    { type: "Sản phẩm kem dưỡng", date: "01/11", amount: "1.2M₫", status: "Hoàn thành" },
    { type: "Lịch hẹn Massage", date: "25/10", amount: "0.8M₫", status: "Hủy" },
];

// ===================================================
// COMPONENT PHỤ: THẺ XU HƯỚNG
// ===================================================

const TrendCard = ({ item }: { item: TrendCardItem }) => {
    const changeColor = item.isUp ? 'text-green-600' : 'text-red-500';
    const arrowIcon = item.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-800">{item.period}</p>
                <span className={`flex items-center text-xs font-semibold ${changeColor}`}>
                    {arrowIcon}
                    {item.changePercent}%
                </span>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">{item.currentValue}</h4>
            <p className="text-xs text-gray-500">Trước: {item.prevValue}</p>
        </div>
    );
};



const RevenueComparisonBlock = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <DollarOutlined style={{ fontSize: '16px', color: 'white' }} /> {/* Thay thế bằng icon thực tế */}
                </span>
                <h3 className="text-xl font-semibold text-gray-800">Phân Tích So Sánh</h3>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <p>Doanh thu</p>
                <select className="border rounded-lg px-2 py-1">
                    <option>So với kỳ trước</option>
                    <option>So với năm trước</option>
                </select>
            </div>
        </div>
        
        {/* Hàng Thẻ Xu hướng (Hôm nay, Tuần, Tháng, Quý) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {trendCards.map((item, index) => (
                <TrendCard key={index} item={item} />
            ))}
        </div>

        {/* Khối Chi tiết So sánh */}
        <div className="mt-8 border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Chi Tiết So Sánh</h4>
            
            {detailComparison.map((item, index) => {
                const changeColor = item.isUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50';
                
                return (
                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-100">
                        
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.period}</p>
                            <p className="text-sm text-gray-500">{item.currentValue} vs {item.prevValue}</p>
                        </div>

                        <div className="text-right">
                            <p className={`font-semibold ${item.isUp ? 'text-green-600' : 'text-red-500'}`}>
                                +{item.changeAmount.toFixed(1)}M₫
                            </p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${changeColor}`}>
                                +{item.changePercent}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Nhận xét tự động */}
        <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <h5 className="font-semibold text-blue-700 mb-2">Nhận Xét Tự Động</h5>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Doanh thu tăng trưởng ổn định qua các kỳ.</li>
                <li>Tăng trưởng mạnh nhất ở quý này (+16.8%).</li>
                <li>Xu hướng tích cực, dự kiến tiếp tục tăng.</li>
            </ul>
        </div>
    </div>
);

// ===================================================
// KHỐI PHÂN TÍCH KHÁCH HÀNG (CỘT PHẢI)
// ===================================================

const CustomerAnalysisBlock = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Phân Tích Khách Hàng</h3>

        {/* Thông tin cơ bản */}
        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
                <p className="text-gray-500 flex items-center"><User className="w-4 h-4 mr-2 text-pink-500" /> Tổng Lịch Hẹn</p>
                <p className="font-bold text-gray-900">{customerActivity.totalAppointments}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 text-pink-500" /> Hoạt động gần nhất</p>
                <p className="font-bold text-gray-900">{customerActivity.lastActivity}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-500 flex items-center"><ShoppingBag className="w-4 h-4 mr-2 text-pink-500" /> Tổng chi tiêu</p>
                <p className="font-bold text-gray-900">{customerActivity.totalSpent}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-gray-500 flex items-center"><Settings className="w-4 h-4 mr-2 text-pink-500" /> Hạng thành viên</p>
                <p className={`font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full`}>{customerActivity.customerTier}</p>
            </div>
        </div>

        {/* Lịch sử giao dịch */}
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Lịch Sử Giao Dịch</h4>
        <div className="space-y-2">
            {transactionHistory.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-1">
                    <div className="flex flex-col items-start">
                        <p className="font-medium text-gray-800">{item.type}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <p className={`font-semibold ${item.status === 'Hoàn thành' ? 'text-green-600' : 'text-red-500'}`}>
                        {item.amount}
                    </p>
                </div>
            ))}
        </div>
        
        {/* Nút Call To Action */}
        <div className="mt-6 space-y-3">
            <button className="w-full py-2.5 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition">
                + Tạo Lịch Hẹn Mới
            </button>
            <button className="w-full py-2.5 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition">
                + Thêm Giao Dịch
            </button>
            <button className="w-full py-2.5 rounded-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition">
                + Thêm Ghi Chú
            </button>
        </div>
    </div>
);


export default function RevenueAnalysis() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột Trái (2/3): Phân tích Doanh thu */}
            <div className="lg:col-span-2">
                <RevenueComparisonBlock />
            </div>
            
            {/* Cột Phải (1/3): Phân tích Khách hàng */}
            <div className="lg:col-span-1">
                <CustomerAnalysisBlock />
            </div>
        </div>
    );
}