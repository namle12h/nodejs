import { ShoppingBag, Loader, Truck, CheckCircle, XCircle, MapPin, TruckIcon, Tag } from "lucide-react";

const orders = [
  {
    id: "ORD-2024-001",
    date: "15 tháng 1, 2024",
    status: "Đã giao hàng",
    statusColor: "bg-green-100 text-green-600",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    shippingType: "Giao hàng nhanh",
    total: 1500000,
    itemsCount: 2,
    images: ["/img1.jpg", "/img2.jpg"]
  },
  {
    id: "ORD-2024-002",
    date: "10 tháng 1, 2024",
    status: "Đang giao hàng",
    statusColor: "bg-blue-100 text-blue-600",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    shippingType: "Giao hàng tiêu chuẩn",
    total: 1150000,
    itemsCount: 2,
    images: ["/img1.jpg", "/img2.jpg"]
  }
];

const formatCurrency = (num: number) => num.toLocaleString("vi-VN") + " đ";

export default function OrderHistory() {
  return (
    <div className="flex gap-6 p-6 bg-pink-50 min-h-screen">
      {/* Bộ lọc bên trái */}
      <aside className="w-72 bg-white p-4 rounded-2xl shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Bộ Lọc Đơn Hàng</h2>
        <div className="space-y-2">
          {[
            { name: "Tất cả", icon: ShoppingBag, active: true },
            { name: "Đang xử lý", icon: Loader },
            { name: "Đang giao hàng", icon: Truck },
            { name: "Đã giao hàng", icon: CheckCircle },
            { name: "Đã hủy", icon: XCircle },
          ].map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                f.active ? "bg-purple-600 text-white shadow-md" : "hover:bg-purple-50 text-gray-700"
              }`}
            >
              <f.icon size={18} />
              <span>{f.name}</span>
            </div>
          ))}
        </div>

        {/* Thống kê */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Thống Kê Mua Hàng</h3>
          <p className="text-sm text-gray-600 flex justify-between">
            Tổng chi tiêu <span className="font-semibold text-gray-800">3.850.000 đ</span>
          </p>
          <p className="text-sm text-gray-600 flex justify-between">
            Sản phẩm đã mua <span className="font-semibold">9</span>
          </p>
          <p className="text-sm text-gray-600 flex justify-between">
            Điểm tích lũy <span className="text-red-500 font-semibold">385</span>
          </p>
        </div>
      </aside>

      {/* Danh sách đơn hàng */}
      <div className="flex-1 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-start hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{order.id}</h3>
              <p className="text-sm text-gray-500">Đặt ngày {order.date}</p>
              <div className="flex items-center text-gray-500 mt-2">
                <MapPin size={15} className="mr-1 text-pink-500" /> {order.address}
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <TruckIcon size={15} className="mr-1 text-purple-500" /> {order.shippingType}
              </div>
              <div className="flex mt-2 space-x-1">
                {order.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{order.itemsCount} sản phẩm</p>
            </div>

            <div className="text-right">
              <div
                className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2 ${order.statusColor}`}
              >
                {order.status}
              </div>
              <div className="flex items-center justify-end text-pink-600 font-bold text-lg">
                <Tag size={14} className="mr-1" /> {formatCurrency(order.total)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
