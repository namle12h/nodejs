import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { Spin, Empty, message } from "antd";
import { useOrders } from "../../../shared/services/orderApi"; // ✅ import API thật

// --- Type cho dữ liệu đơn hàng ---
interface OrderResponse {
  id: number;
  txnRef: string;
  total: number;
  status: string;
  paymentMethod: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  createdAt?: string;
}

// --- Component hiển thị trạng thái ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let label = status;

  switch (status) {
    case "PAID":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      label = "Đã thanh toán";
      break;
    case "UNPAID":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      label = "Chờ thanh toán";
      break;
    case "PENDING":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      label = "Đang xử lý";
      break;
    case "FAILED":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      label = "Thanh toán thất bại";
      break;
    case "COMPLETED":
      bgColor = "bg-green-200";
      textColor = "text-green-800";
      label = "Hoàn thành";
      break;
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};

// --- Component chính ---
const OrderProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders, isLoading, isError } = useOrders(true); // ✅ gọi API danh sách đơn hàng cho admin

  // Lọc theo từ khóa tìm kiếm
  const filteredOrders =
    orders?.filter(
      (order) =>
        order.txnRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiverAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý Đơn hàng</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
          <FaPlus className="mr-2" />
          Thêm đơn hàng
        </button>
      </div>

      {/* Toolbar (Tìm kiếm / Bộ lọc) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-150">
            <FaFilter className="mr-2" /> Bộ lọc
          </button>
          <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-150">
            <FaCalendarAlt className="mr-2" /> Ngày tạo
          </button>
        </div>
      </div>

      {/* Hiển thị trạng thái tải dữ liệu */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin tip="Đang tải danh sách đơn hàng..." />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="Không thể tải dữ liệu đơn hàng!" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="Không có đơn hàng nào!" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "MÃ ĐƠN",
                    "KHÁCH HÀNG",
                    "ĐỊA CHỈ",
                    "TỔNG TIỀN",
                    "THANH TOÁN",
                    "TRẠNG THÁI",
                    "NGÀY TẠO",
                    "THAO TÁC",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {order.txnRef}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.receiverName || "Không rõ"}
                      <div className="text-xs text-gray-500">
                        {order.receiverPhone || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.receiverAddress || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {order.total?.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.paymentMethod?.toUpperCase() || "Không rõ"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 p-1">
                          <FaEdit />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 p-1">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProductPage;
