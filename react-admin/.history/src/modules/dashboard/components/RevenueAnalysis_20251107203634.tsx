import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Settings, Phone, Calendar, User, ShoppingBag, ChevronDown, Smile, Clock } from 'lucide-react';
import { UserOutlined, DollarOutlined, ScheduleOutlined, SmileOutlined } from '@ant-design/icons'; // Sử dụng Ant Design Icons cho khối chính

// ===================================================
// I. CẤU TRÚC DỮ LIỆU ĐA LOẠI
// ===================================================

interface TrendCardItem {
    period: string;
    currentValue: string;
    prevValue: string;
    changePercent: number; // 7.5, 14.2, v.v.
    isUp: boolean;
    changeAmount: number; // Chỉ dùng cho khối chi tiết
}

interface AnalysisData {
    title: string;
    icon: React.ReactNode;
    iconColor: string;
    trendCards: TrendCardItem[];
    detailComparison: TrendCardItem[];
    unit: string;
}

// Dữ liệu cho các loại phân tích (Doanh thu, Khách hàng, Lịch hẹn, Hài lòng)
const analysisDatasets: Record<string, AnalysisData> = {
    revenue: {
        title: "Doanh thu",
        icon: <DollarOutlined className="w-4 h-4" />,
        iconColor: "bg-teal-500",
        trendCards: [
            { period: "Hôm nay", currentValue: "2.9M₫", prevValue: "2.6M₫", changePercent: 7.5, isUp: true, changeAmount: 0.2 },
            { period: "Tuần này", currentValue: "18.5M₫", prevValue: "16.2M₫", changePercent: 14.2, isUp: true, changeAmount: 2.3 },
            { period: "Tháng này", currentValue: "125.8M₫", prevValue: "108.9M₫", changePercent: 15.5, isUp: true, changeAmount: 16.9 },
            { period: "Quý này", currentValue: "365.4M₫", prevValue: "312.8M₫", changePercent: 16.8, isUp: true, changeAmount: 52.6 },
        ],
        detailComparison: [
            { period: "Hôm nay", currentValue: "2.9M₫", prevValue: "2.6M₫", changePercent: 7.5, isUp: true, changeAmount: 0.2 },
            { period: "Tuần này", currentValue: "18.5M₫", prevValue: "16.2M₫", changePercent: 14.2, isUp: true, changeAmount: 2.3 },
            { period: "Tháng này", currentValue: "125.8M₫", prevValue: "108.9M₫", changePercent: 15.5, isUp: true, changeAmount: 16.9 },
            { period: "Quý này", currentValue: "365.4M₫", prevValue: "312.8M₫", changePercent: 16.8, isUp: true, changeAmount: 52.6 },
        ],
        unit: 'M₫'
    },
    customer: {
        title: "Khách hàng",
        icon: <UserOutlined className="w-4 h-4" />,
        iconColor: "bg-green-500",
        trendCards: [
            { period: "Hôm nay", currentValue: "45", prevValue: "38", changePercent: 18.4, isUp: true, changeAmount: 7 },
            { period: "Tuần này", currentValue: "287", prevValue: "251", changePercent: 14.3, isUp: true, changeAmount: 36 },
            { period: "Tháng này", currentValue: "1.247", prevValue: "1.089", changePercent: 14.5, isUp: true, changeAmount: 158 },
            { period: "Quý này", currentValue: "3.654", prevValue: "3.128", changePercent: 16.8, isUp: true, changeAmount: 526 },
        ],
        detailComparison: [
            { period: "Hôm nay", currentValue: "45", prevValue: "38", changePercent: 18.4, isUp: true, changeAmount: 7 },
            { period: "Tuần này", currentValue: "287", prevValue: "251", changePercent: 14.3, isUp: true, changeAmount: 36 },
            { period: "Tháng này", currentValue: "1.247", prevValue: "1.089", changePercent: 14.5, isUp: true, changeAmount: 158 },
            { period: "Quý này", currentValue: "3.654", prevValue: "3.128", changePercent: 16.8, isUp: true, changeAmount: 526 },
        ],
        unit: '' // Không có đơn vị cho Khách hàng
    },
    appointment: {
        title: "Lịch hẹn",
        icon: <ScheduleOutlined className="w-4 h-4" />,
        iconColor: "bg-blue-500",
        trendCards: [
            { period: "Hôm nay", currentValue: "52", prevValue: "40", changePercent: 30, isUp: true, changeAmount: 12 },
            { period: "Tuần này", currentValue: "350", prevValue: "320", changePercent: 9.3, isUp: true, changeAmount: 30 },
            { period: "Tháng này", currentValue: "1.450", prevValue: "1.300", changePercent: 11.5, isUp: true, changeAmount: 150 },
            { period: "Quý này", currentValue: "4.500", prevValue: "4.100", changePercent: 9.7, isUp: true, changeAmount: 400 },
        ],
        detailComparison: [
            { period: "Hôm nay", currentValue: "52", prevValue: "40", changePercent: 30, isUp: true, changeAmount: 12 },
            { period: "Tuần này", currentValue: "350", prevValue: "320", changePercent: 9.3, isUp: true, changeAmount: 30 },
            { period: "Tháng này", currentValue: "1.450", prevValue: "1.300", changePercent: 11.5, isUp: true, changeAmount: 150 },
            { period: "Quý này", currentValue: "4.500", prevValue: "4.100", changePercent: 9.7, isUp: true, changeAmount: 400 },
        ],
        unit: ''
    },
    satisfaction: {
        title: "Sản Phẩm ",
        icon: <SmileOutlined className="w-4 h-4" />,
        iconColor: "bg-purple-500",
        trendCards: [
            { period: "Hôm nay", currentValue: "95%", prevValue: "92%", changePercent: 3.2, isUp: true, changeAmount: 3 },
            { period: "Tuần này", currentValue: "93%", prevValue: "95%", changePercent: 2.1, isUp: false, changeAmount: 2 },
            { period: "Tháng này", currentValue: "94%", prevValue: "96%", changePercent: 2.0, isUp: false, changeAmount: 2 },
            { period: "Quý này", currentValue: "96%", prevValue: "97%", changePercent: 1.0, isUp: false, changeAmount: 1 },
        ],
        detailComparison: [
            { period: "Hôm nay", currentValue: "95%", prevValue: "92%", changePercent: 3.2, isUp: true, changeAmount: 3 },
            { period: "Tuần này", currentValue: "93%", prevValue: "95%", changePercent: 2.1, isUp: false, changeAmount: 2 },
            { period: "Tháng này", currentValue: "94%", prevValue: "96%", changePercent: 2.0, isUp: false, changeAmount: 2 },
            { period: "Quý này", currentValue: "96%", prevValue: "97%", changePercent: 1.0, isUp: false, changeAmount: 1 },
        ],
        unit: '%'
    }
};



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

// ===================================================
// KHỐI CHÍNH: PHÂN TÍCH DOANH THU & SO SÁNH
// ===================================================

const RevenueComparisonBlock = ({ dataCategory }: { dataCategory: string }) => {
    const data = analysisDatasets[dataCategory];

    // Đảm bảo không hiển thị khi dữ liệu rỗng
    if (!data) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-left space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${data.iconColor}`}>
                        {data.icon}
                    </span>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{data.title}</h3>
                        <p className="text-sm text-gray-500">Phân tích xu hướng và so sánh</p>
                    </div>
                </div>

                {/* Dropdown So với kỳ trước (không thay đổi) */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <select className="border rounded-lg px-2 py-1">
                        <option>So với kỳ trước</option>
                        <option>So với năm trước</option>
                    </select>
                </div>
            </div>

            {/* Hàng Thẻ Xu hướng (Hôm nay, Tuần, Tháng, Quý) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-left">
                {data.trendCards.map((item, index) => (
                    <TrendCard key={index} item={item} />
                ))}
            </div>

            {/* Khối Chi tiết So sánh */}
            <div className="mt-8 border-t text-left pt-4">
                <h4 className="text-lg font-semibold  text-gray-800 mb-4">Chi Tiết So Sánh</h4>

                {data.detailComparison.map((item, index) => {
                    const changeColor = item.isUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50';

                    return (
                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-100">

                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.period}</p>
                                <p className="text-sm text-gray-500">{item.currentValue} vs {item.prevValue}</p>
                            </div>

                            <div className="text-right">
                                {/* Hiển thị Số lượng thay đổi (dùng changeAmount) */}
                                <p className={`font-semibold ${item.isUp ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.isUp ? '+' : '-'}
                                    {item.changeAmount}
                                    {data.unit}
                                </p>
                                {/* Hiển thị Phần trăm thay đổi */}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${changeColor}`}>
                                    {item.isUp ? '+' : ''}
                                    {item.changePercent}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nhận xét tự động */}
            <div className="mt-6 p-4 text-left bg-blue-50/50 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-blue-700 mb-2">Nhận Xét Tự Động</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>{data.title} tăng trưởng ổn định qua các kỳ.</li>
                    <li>Tăng trưởng mạnh nhất ở quý này ({data.trendCards[3].isUp ? '+' : '-'}{data.trendCards[3].changePercent}% ).</li>
                    <li>Xu hướng tích cực, dự kiến tiếp tục tăng.</li>
                </ul>
            </div>
        </div>
    );
};



export default function RevenueAnalysis() {
    // State để chọn loại dữ liệu, mặc định là 'customer' theo hình ảnh mới
    const [dataCategory, setDataCategory] = useState<'revenue' | 'customer' | 'appointment' | 'product'>('customer');

    // Tùy chọn Dropdown
    const categoryOptions = [
        { key: 'customer', label: 'Khách hàng' },
        { key: 'revenue', label: 'Doanh thu' },
        { key: 'appointment', label: 'Lịch hẹn' },
        { key: 'product', label: 'Sản Phẩm' },
    ];

    return (
        <div className="grid  gap-6">

            {/* Cột Trái (2/3): Phân tích So sánh */}
            <div className="lg:col-span-2">

                {/* Vùng Dropdown điều khiển */}
                {/* <div className="flex justify-end items-center mb-4 space-x-2">
                    <select
                        className="border rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 appearance-none bg-white shadow-sm"
                        value={dataCategory}
                        onChange={(e) => setDataCategory(e.target.value as 'revenue' | 'customer' | 'appointment' | 'product')}
                    >
                        {categoryOptions.map(option => (
                            <option key={option.key} value={option.key}>{option.label}</option>
                        ))}
                    </select>

                    <select className="border rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 appearance-none bg-white shadow-sm">
                        <option>So với kỳ trước</option>
                        <option>So với năm trước</option>
                    </select>
                </div> */}

                <RevenueComparisonBlock dataCategory={dataCategory} />
            </div>

            
        </div>
    );
}