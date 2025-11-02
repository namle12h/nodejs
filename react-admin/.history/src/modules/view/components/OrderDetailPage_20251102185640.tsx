import { MapPin, Calendar, Package } from "lucide-react";

const order = {
  id: "ORD-2024-001",
  date: "15 tháng 1, 2024",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  shippingType: "Giao hàng nhanh",
  estimatedDelivery: "18 tháng 1, 2024",
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
};

const formatCurrency = (num: number) => num.toLocaleString("vi-VN") + " đ";

export default function OrderDetails() {
  return (
    <div className=" min-h-screen p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-semibold text-lg">{order.id}</h1>
            <p className="text-sm text-gray-500">Đặt ngày {order.date}</p>
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Đã giao hàng
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin size={16} className="mr-1 text-pink-500" />
            {order.address}
          </div>
          <div className="flex items-center">
            <Package size={16} className="mr-1 text-purple-500" />
            {order.shippingType}
          </div>
        </div>

        <div className="space-y-3 border-t pt-3">
          <h2 className="font-semibold text-gray-800">Chi Tiết Sản Phẩm</h2>
          {order.products.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <img src={p.img} alt="" className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    {p.brand} • Số lượng: {p.qty}
                  </p>
                </div>
              </div>
              <div className="text-right text-gray-800">
                <p className="font-semibold">{formatCurrency(p.price * p.qty)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(p.price)} /sp</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-2">
          <h2 className="font-semibold text-gray-800">Tổng Kết Đơn Hàng</h2>
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
            <MapPin size={16} className="mr-1 text-pink-500" /> {order.address}
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-blue-500" /> Dự kiến giao:{" "}
            {order.estimatedDelivery}
          </div>
        </div>
      </div>
    </div>
  );
}
