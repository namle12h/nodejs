import { ShoppingBag, Loader, Truck, CheckCircle, XCircle, MapPin, Calendar, Award, Package } from "lucide-react";

const MOCK_ORDER_DATA = {
  id: "ORD-2024-001",
  date: "15 tháng 1, 2024",
  status: "Đã giao hàng",
  totalPrice: 1500000,
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  shippingType: "Giao nhanh",
  estimatedDelivery: "18 tháng 1, 2024",
  products: [
    { name: "Sữa Rửa Mặt Làm Sạch Sâu", brand: "Luxury Spa", quantity: 2, price: 450000 },
    { name: "Serum Vitamin C Chống Lão Hóa", brand: "Glow Beauty", quantity: 1, price: 850000 },
  ],
  summary: {
    subtotal: 1470000,
    shippingFee: 30000,
    total: 1500000,
  },
};

const MOCK_SIDEBAR_DATA = {
  filters: [
    { name: "Tất cả", count: 3, isActive: true, icon: ShoppingBag },
    { name: "Đang xử lý", count: 1, isActive: false, icon: Loader },
    { name: "Đang giao hàng", count: 1, isActive: false, icon: Truck },
    { name: "Đã giao hàng", count: 1, isActive: false, icon: CheckCircle },
    { name: "Đã hủy", count: 0, isActive: false, icon: XCircle },
  ],
  stats: { totalSpent: "3.850.000", totalProducts: 9, loyaltyPoints: 385 },
  membership: { currentLevel: "Gold", pointsNeeded: 615, nextLevel: "Platinum", progress: 38.5 },
};

const formatCurrency = (amount: any) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const ProductItem = ({ product }: { product: any }) => (
  <div className="flex justify-between items-start text-sm">
    <div>
      <p className="font-semibold text-gray-800">{product.name}</p>
      <p className="text-gray-500">
        {product.brand} | <span className="text-red-500">SL: {product.quantity}</span>
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold">{formatCurrency(product.price * product.quantity)} đ</p>
      <p className="text-xs text-gray-400">{formatCurrency(product.price)} đ/sp</p>
    </div>
  </div>
);

const OrderDetailsPage = () => {
  const { filters, stats, membership } = MOCK_SIDEBAR_DATA;
  const order = MOCK_ORDER_DATA;
  const totalProductsInOrder = order.products.reduce((s, p) => s + p.quantity, 0);

  return (
    <div className="flex bg-gray-50 min-h-screen p-3 lg:p-6 gap-4">
      {/* Sidebar */}
      <div className="w-1/4 space-y-3">
        {/* Bộ lọc */}
        <div className="bg-white rounded-lg shadow p-3">
          <h2 className="font-bold mb-2 text-sm">Bộ lọc đơn hàng</h2>
          <div className="space-y-1">
            {filters.map((f) => (
              <div
                key={f.name}
                className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer text-sm ${
                  f.isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-50 hover:text-purple-600 text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <f.icon size={16} className="mr-2" />
                  {f.name}
                </div>
                {f.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      f.isActive ? "bg-white text-purple-600" : "bg-gray-200"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thống kê */}
        <div className="bg-white rounded-lg shadow p-3 text-sm">
          <h3 className="font-bold mb-2">Thống kê mua hàng</h3>
          <div className="space-y-1 text-gray-700">
            <div className="flex justify-between">
              <span>Tổng chi tiêu</span> <b>{stats.totalSpent} đ</b>
            </div>
            <div className="flex justify-between">
              <span>Sản phẩm</span> <b>{stats.totalProducts}</b>
            </div>
            <div className="flex justify-between">
              <span>Điểm tích lũy</span>{" "}
              <b className="text-red-500">{stats.loyaltyPoints}</b>
            </div>
          </div>
        </div>

        {/* Thành viên */}
        <div className="bg-pink-50 rounded-lg shadow p-3 text-sm">
          <div className="flex items-center mb-2 text-pink-600 font-bold">
            <Award size={16} className="mr-1" /> Thành viên {membership.currentLevel}
          </div>
          <p className="text-gray-700 mb-2">
            Còn <b className="text-pink-600">{formatCurrency(membership.pointsNeeded)}</b> điểm lên{" "}
            {membership.nextLevel}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full"
              style={{ width: `${membership.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white rounded-lg shadow p-4 text-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-base">{order.id}</h1>
            <p className="text-gray-500 text-xs">Đặt ngày {order.date}</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle size={12} className="inline mr-1" />
            {order.status}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-700">
          <div className="flex items-center text-xs space-x-3">
            <span className="flex items-center">
              <MapPin size={14} className="mr-1 text-red-500" /> {order.address}
            </span>
            <span className="flex items-center">
              <Truck size={14} className="mr-1 text-blue-500" /> {order.shippingType}
            </span>
          </div>
          <b className="text-red-600 text-base">{formatCurrency(order.totalPrice)} đ</b>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Chi tiết sản phẩm ({totalProductsInOrder})</h2>
          <div className="space-y-2">
            {order.products.map((p, i) => (
              <ProductItem key={i} product={p} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Tổng kết đơn hàng</h2>
          <div className="space-y-1 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.summary.subtotal)} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng</span>
              <span>{formatCurrency(order.summary.shippingFee)} đ</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-red-600">
              <span>Tổng cộng</span>
              <span>{formatCurrency(order.summary.total)} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
