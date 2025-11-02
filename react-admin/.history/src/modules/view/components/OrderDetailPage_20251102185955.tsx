import { useState } from "react";
import { MapPin, Calendar, Package, ChevronDown, ChevronUp } from "lucide-react";

const orders = [
  {
    id: "ORD-2024-001",
    date: "15 tháng 1, 2024",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    shippingType: "Giao hàng nhanh",
    estimatedDelivery: "18 tháng 1, 2024",
    status: "Đã giao hàng",
    statusColor: "bg-green-100 text-green-700",
    total: 1500000,
    subtotal: 1470000,
    shippingFee: 30000,
    products: [
      {
        name: "Sữa Rửa Mặt Làm Sạch Sâu",
        brand: "Luxury Spa",
        qty: 2,
        price: 450000,
        img: "/product1.jpg",
      },
      {
        name: "Serum Vitamin C Chống Lão Hóa",
        brand: "Glow Beauty",
        qty: 1,
        price: 850000,
        img: "/product2.jpg",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "10 tháng 1, 2024",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    shippingType: "Giao hàng tiêu chuẩn",
    estimatedDelivery: "15 tháng 1, 2024",
    status: "Đang giao hàng",
    statusColor: "bg-blue-100 text-blue-700",
    total: 1150000,
    subtotal: 1120000,
    shippingFee: 30000,
    products: [
      {
        name: "Kem Dưỡng Ẩm Ban Đêm",
        brand: "Luxury Spa",
        qty: 1,
        price: 1120000,
        img: "/product3.jpg",
      },
    ],
  },
];

const formatCurrency = (num: number) => num.toLocaleString("vi-VN") + " đ";

export default function OrderList() {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const toggleOrder = (id: string) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  return (
    <div className="bg-pink-50 min-h-screen py-10 px-4 flex justify-center">
      <div className="max-w-4xl w-full space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300"
          >
            {/* Header đơn hàng */}
            <div
              className="flex justify-between items-start cursor-pointer"
              onClick={() => toggleOrder(order.id)}
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {order.id}
                </h2>
                <p className="text-sm text-gray-500">Đặt ngày {order.date}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <MapPin size={15} className="mr-1 text-pink-500" />
                    {order.address}
                  </span>
                  <span className="flex items-center">
                    <Package size={15} className="mr-1 text-purple-500" />
                    {order.shippingType}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}
                >
                  {order.status}
                </div>
                <div className="text-right text-gray-800 font-semibold">
                  {formatCurrency(order.total)}
                </div>
                {openOrderId === order.id ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Chi tiết mở rộng */}
            {openOrderId === order.id && (
              <div className="mt-5 border-t pt-4 space-y-4 animate-fadeIn">
                <h3 className="font-semibold text-gray-800">Chi Tiết Sản Phẩm</h3>
                {order.products.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.img}
                        alt=""
                        className="w-16 h-16 rounded-md object-cover border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          {p.brand} • Số lượng: {p.qty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-gray-800">
                      <p className="font-semibold">
                        {formatCurrency(p.price * p.qty)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(p.price)} /sp
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    Tổng Kết Đơn Hàng
                  </h3>
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí giao hàng</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg text-red-600">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-pink-500" />{" "}
                    {order.address}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-blue-500" /> Dự kiến
                    giao: {order.estimatedDelivery}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
