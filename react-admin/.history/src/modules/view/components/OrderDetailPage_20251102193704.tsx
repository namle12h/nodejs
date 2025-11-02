import { useState } from "react";
import {
  MapPin,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useOrders } from "../../../shared/services/orderApi";
import { Spin, Empty, Pagination } from "antd";

const formatCurrency = (num: number) =>
  (num ?? 0).toLocaleString("vi-VN") + " đ";

// ⚙️ Hàm chuyển status sang tiếng Việt + style
const getStatusDisplay = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return { label: "✅ Đã thanh toán", color: "bg-green-100 text-green-700" };
    case "PENDING":
      return { label: "⌛ Đang xử lý", color: "bg-yellow-100 text-yellow-700" };
    case "UNPAID":
      return { label: "💰 Chưa thanh toán", color: "bg-gray-100 text-gray-700" };
    case "FAILED":
      return { label: "❌ Thanh toán thất bại", color: "bg-red-100 text-red-700" };
    case "COMPLETED":
      return { label: "🎉 Hoàn tất", color: "bg-blue-100 text-blue-700" };
    default:
      return { label: "Không rõ", color: "bg-gray-100 text-gray-600" };
  }
};

export default function OrderList() {
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const { data: orders = [], isLoading, isError } = useOrders(false);

  const toggleOrder = (id: number) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (isError || !orders.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Empty description="Không có đơn hàng nào" />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-[250px] flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        {paginatedOrders.map((order: any) => {
          const statusDisplay = getStatusDisplay(order.status);

          return (
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
                    {order.txnRef || `#${order.id}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Đặt ngày{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "Không xác định"}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <MapPin size={15} className="mr-1 text-pink-500" />
                      {order.receiverAddress || "Chưa có địa chỉ"}
                    </span>
                    <span className="flex items-center">
                      <Package size={15} className="mr-1 text-purple-500" />
                      {order.shippingType || "Giao hàng tiêu chuẩn"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}
                  >
                    {statusDisplay.label}
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

              {/* Chi tiết đơn hàng */}
              {openOrderId === order.id && (
                <div className="mt-5 border-t pt-4 space-y-4 animate-fadeIn">
                  <h3 className="font-semibold text-gray-800">
                    Chi Tiết Sản Phẩm
                  </h3>
                  {order.orderItems?.map((p: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || "/placeholder.jpg"}
                          alt={p.productName}
                          className="w-16 h-16 rounded-md object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {p.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {p.brand || "luice"} • SL: {p.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-gray-800">
                        <p className="font-semibold">
                          {formatCurrency(p.price * p.quantity)}
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
                    {/* <div className="flex justify-between text-gray-600">
                      <span>Phí giao hàng</span>
                      <span>{formatCurrency(order.shippingFee || 0)}</span>
                    </div> */}
                    <div className="flex justify-between text-gray-600">
                      <span>Giảm Giá</span>
                      <span>{formatCurrency(order.discount || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg text-red-600">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-pink-500" />
                      {order.receiverAddress || "Chưa có địa chỉ"}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-blue-500" />
                      Thanh toán: {order.paymentMethod || "Không rõ"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Pagination */}
        <div className="flex justify-center pt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={orders.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
