import React from 'react';
// Import các icon cần thiết từ lucide-react
import { ShoppingBag, Loader, Truck, CheckCircle, XCircle, MapPin, Calendar, Award, Clock, ArrowRight, Package, DollarSign } from 'lucide-react';

// --- Dữ liệu giả định (Mock Data) ---

const MOCK_ORDER_DATA = {
    id: 'ORD-2024-001',
    date: '15 tháng 1, 2024',
    status: 'Đã giao hàng',
    totalPrice: 1500000,
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    shippingType: 'Giao nhanh',
    estimatedDelivery: '18 tháng 1, 2024',
    products: [
        {
            name: 'Sữa Rửa Mặt Làm Sạch Sâu',
            brand: 'Luxury Spa',
            quantity: 2,
            price: 450000,
            imagePlaceholder: '',
        },
        {
            name: 'Serum Vitamin C Chống Lão Hóa',
            brand: 'Glow Beauty',
            quantity: 1,
            price: 850000,
            imagePlaceholder: '',
        },
    ],
    summary: {
        subtotal: 1470000, // 900.000 + 850.000 = 1.750.000 -> Đang sai, mô phỏng lại theo ảnh
        subtotal_actual: 1750000, // Tổng 2 sản phẩm
        discount: 280000, // Giả định có giảm giá để ra Tam tính là 1.470.000
        shippingFee: 30000,
        total: 1500000,
    }
};

const MOCK_SIDEBAR_DATA = {
    filters: [
        { name: 'Tất cả', count: 3, isActive: true, icon: ShoppingBag },
        { name: 'Đang xử lý', count: 1, isActive: false, icon: Loader },
        { name: 'Đang giao hàng', count: 1, isActive: false, icon: Truck },
        { name: 'Đã giao hàng', count: 1, isActive: false, icon: CheckCircle },
        { name: 'Đã hủy', count: 0, isActive: false, icon: XCircle },
    ],
    stats: {
        totalSpent: '3.850.000',
        totalProducts: 9,
        loyaltyPoints: 385,
    },
    membership: {
        currentLevel: 'Gold',
        pointsNeeded: 615,
        nextLevel: 'Platinum',
        progress: 38.5, // 385 / (385 + 615) = 38.5%
    },
    activity: [
        { status: 'Đã giao hàng', orderId: 'ORD-2024-001', time: '2 ngày trước', icon: CheckCircle, color: 'text-green-600' },
        { status: 'Đang giao hàng', orderId: 'ORD-2024-002', time: '5 giờ trước', icon: Truck, color: 'text-blue-600' },
    ],
};

// Hàm định dạng tiền tệ (VD: 1500000 -> 1.500.000)
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --- Component Chi tiết Sản phẩm ---
const ProductItem = ({ product }) => (
    <div className="flex justify-between items-start py-4 border-b border-gray-100">
        <div className="flex items-start">
            {/* Hình ảnh sản phẩm (placeholder) */}
            <div className="w-16 h-16 mr-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs overflow-hidden">
                {product.imagePlaceholder}
            </div>
            <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">
                    {product.brand} | <span className="text-red-500">Số lượng: {product.quantity}</span>
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-gray-800">{formatCurrency(product.price * product.quantity)} đ</p>
            <p className="text-sm text-gray-400">{formatCurrency(product.price)} đ/sp</p>
        </div>
    </div>
);

// --- Component Chính: OrderDetailsPage ---
const OrderDetailsPage = () => {
    const { filters, stats, membership, activity } = MOCK_SIDEBAR_DATA;
    const order = MOCK_ORDER_DATA;
    const totalProductsInOrder = order.products.reduce((sum, p) => sum + p.quantity, 0);

    return (
        <div className="flex bg-gray-50 min-h-screen p-6 lg:p-10">
            {/* Cột Trái: Sidebar */}
            <div className="w-full lg:w-1/4 mr-8 space-y-6">
                
                {/* 1. Bộ Lọc Đơn Hàng */}
                <div className="p-4 bg-white rounded-xl shadow-md">
                    <h2 className="font-bold text-lg mb-3">Bộ Lọc Đơn Hàng</h2>
                    <div className="space-y-1">
                        {filters.map((item) => (
                            <div
                                key={item.name}
                                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors 
                                    ${item.isActive
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <item.icon size={20} className="mr-3" />
                                    <span>{item.name}</span>
                                </div>
                                {item.count > 0 && (
                                    <span
                                        className={`px-3 py-1 text-xs font-bold rounded-full 
                                            ${item.isActive ? 'bg-white text-purple-600' : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {item.count}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Thống Kê Mua Hàng */}
                <div className="p-4 bg-white rounded-xl shadow-md space-y-2">
                    <h3 className="font-bold text-lg mb-2">Thống Kê Mua Hàng</h3>
                    <div className="text-gray-600">
                        <div className="flex justify-between py-1"><span>Tổng chi tiêu</span><span className="font-semibold text-gray-800">{stats.totalSpent} đ</span></div>
                        <div className="flex justify-between py-1"><span>Sản phẩm đã mua</span><span className="font-semibold text-gray-800">{stats.totalProducts} sản phẩm</span></div>
                        <div className="flex justify-between py-1"><span>Điểm tích lũy</span><span className="font-semibold text-red-500">{stats.loyaltyPoints} điểm</span></div>
                    </div>
                </div>

                {/* 3. Thành viên Gold */}
                <div className="p-4 bg-pink-50 rounded-xl shadow-md">
                    <div className="flex items-center mb-3">
                        <Award size={20} className="text-pink-600 mr-2" />
                        <span className="font-bold text-pink-600">Thành viên {membership.currentLevel}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                        Còn <span className="font-bold text-pink-600">{formatCurrency(membership.pointsNeeded)} điểm</span> nữa lên hạng {membership.nextLevel}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-pink-500 h-2.5 rounded-full"
                            style={{ width: `${membership.progress}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* 4. Hoạt Động Gần Đây */}
                <div className="p-4 bg-white rounded-xl shadow-md">
                    <h3 className="font-bold text-lg mb-3">Hoạt Động Gần Đây</h3>
                    <div className="space-y-3">
                        {activity.map((item, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                                <item.icon size={16} className={`${item.color} mr-2`} />
                                <div>
                                    <span className="font-medium text-gray-800">{item.status}</span>
                                    <span className="text-gray-500"> {item.orderId} - {item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cột Phải: Chi Tiết Đơn Hàng */}
            <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-6">
                    {/* Header Đơn hàng */}
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Package size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{order.id}</h1>
                                <p className="text-sm text-gray-500">Đặt ngày {order.date}</p>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                            <CheckCircle size={14} className="inline mr-1" />
                            {order.status}
                        </div>
                    </div>

                    {/* Shipping Bar (Địa chỉ & Tổng tiền) */}
                    <div className="flex justify-between items-center text-gray-600 text-sm mb-6 pb-4 border-b">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center"><MapPin size={16} className="mr-1 text-red-500" /> {order.address}</div>
                            <div className="flex items-center"><Truck size={16} className="mr-1 text-blue-500" /> {order.shippingType}</div>
                        </div>
                        <p className="font-bold text-lg text-red-600">{formatCurrency(order.totalPrice)} đ</p>
                    </div>

                    {/* Chi Tiết Sản Phẩm */}
                    <h2 className="font-bold text-xl mb-4 border-b pb-2">Chi Tiết Sản Phẩm ({totalProductsInOrder} sản phẩm)</h2>
                    <div className="space-y-4 mb-6">
                        {order.products.map((product, index) => (
                            <ProductItem key={index} product={product} />
                        ))}
                    </div>

                    {/* Thông Tin Giao Hàng */}
                    <h2 className="font-bold text-xl mb-4 border-b pb-2">Thông Tin Giao Hàng</h2>
                    <div className="flex justify-between mb-6 text-gray-700">
                        <div className="flex items-center text-base">
                            <MapPin size={18} className="mr-2 text-red-500" />
                            <span className="font-semibold">Địa chỉ giao hàng:</span> {order.address}
                        </div>
                        <div className="flex items-center text-base">
                            <Calendar size={18} className="mr-2 text-blue-500" />
                            <span className="font-semibold">Dự kiến giao hàng:</span> {order.estimatedDelivery}
                        </div>
                    </div>

                    {/* Tổng Kết Đơn Hàng */}
                    <h2 className="font-bold text-xl mb-4 border-b pb-2">Tổng Kết Đơn Hàng</h2>
                    <div className="space-y-2 max-w-sm ml-auto">
                        <div className="flex justify-between text-gray-700">
                            <span>Tam tính</span>
                            <span>{formatCurrency(order.summary.subtotal)} đ</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Phí giao hàng</span>
                            <span>{formatCurrency(order.summary.shippingFee)} đ</span>
                        </div>
                        {/* Tổng cộng */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="font-bold text-xl text-gray-800">Tổng cộng</span>
                            <span className="font-bold text-2xl text-red-600">{formatCurrency(order.summary.total)} đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;