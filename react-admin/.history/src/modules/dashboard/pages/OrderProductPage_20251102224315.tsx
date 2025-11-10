import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import { useOrders } from "../../../shared/services/orderApi" // ⚠️ Đường dẫn tuỳ dự án

const tabs = [
  { id: "all", name: "Tất cả đơn hàng" },
  { id: "appointment", name: "Đơn hàng Appointment" },
  { id: "product", name: "Đơn hàng Product" },
];

const OrderProductPage: React.FC = () => {
  // --- 1️⃣ Gọi API ---
  const { data: orderData = [], isLoading, isError } = useOrders(true);

  // --- 2️⃣ State cơ bản ---
  const [activeTab, setActiveTab] = useState("product"); // mặc định vào tab Product
  const [searchTerm, setSearchTerm] = useState("");

  // --- 3️⃣ Xử lý loading / lỗi ---
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center text-lg font-semibold">
        Đang tải dữ liệu đơn hàng...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center text-lg font-semibold text-red-600">
        Lỗi: Không thể tải dữ liệu đơn hàng.
      </div>
    );
  }

  // --- 4️⃣ Lọc dữ liệu theo tab ---
  const filteredByTab = useMemo(() => {
    if (activeTab === "appointment")
      return orderData.filter((o: any) => o.appointment !== null);
    if (activeTab === "product")
      return orderData.filter((o: any) => o.appointment === null);
    return orderData;
  }, [orderData, activeTab]);

  // --- 5️⃣ Lọc theo ô tìm kiếm ---
  const finalFilteredData = useMemo(() => {
    if (!searchTerm) return filteredByTab;

    const lower = searchTerm.toLowerCase();
    return filteredByTab.filter(
      (o: any) =>
        o.txnRef?.toLowerCase().includes(lower) ||
        o.receiverName?.toLowerCase().includes(lower) ||
        o.customerName?.toLowerCase().includes(lower)
    );
  }, [filteredByTab, searchTerm]);

  // --- 6️⃣ Tính thống kê (nếu cần) ---
  const statCards = [
    {
      title: "Tổng đơn hàng",
      value: orderData.length,
      color: "bg-blue-500",
    },
    {
      title: "Đơn Product",
      value: orderData.filter((o: any) => o.appointment === null).length,
      color: "bg-green-500",
    },
    {
      title: "Đơn Appointment",
      value: orderData.filter((o: any) => o.appointment !== null).length,
      color: "bg-purple-500",
    },
  ];

  // --- 7️⃣ Render ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý Đơn hàng Product
        </h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
          <FaPlus className="mr-2" />
          Thêm đơn hàng
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* {statCards.map((s, i) => (
          // <StatCard key={i} {...s} />
        ))} */}
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-gray-100 pb-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, khách hàng, sản phẩm..."
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
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150">
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      {/* <OrderTable data={finalFilteredData} /> */}
    </div>
  );
};

export default OrderProductPage;
