import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useInvoices } from '../api/useInvoices'; // 👈 Import hook mới
import { Spin } from 'antd';

const OrderProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Lấy danh sách invoice từ backend
  const { data: invoices = [], isLoading } = useInvoices(false); // false = user thường, true = admin

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // 🔍 Lọc dữ liệu theo tab
  const filteredByTab =
    activeTab === 'all'
      ? invoices
      : invoices.filter((i) =>
          activeTab === 'appointment'
            ? i.appointmentId !== null
            : i.appointmentId === null
        );

  // 🔍 Lọc theo từ khóa tìm kiếm
  const filteredData = filteredByTab.filter((inv) =>
    [inv.txnRef, inv.receiverName, inv.paymentMethod]
      .some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">📦 Lịch sử đơn hàng</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
          <FaPlus className="mr-2" /> Tạo đơn mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b pb-3 mb-4">
        {[
          { id: 'all', name: 'Tất cả', count: invoices.length },
          { id: 'product', name: 'Sản phẩm', count: invoices.filter(i => !i.appointmentId).length },
          { id: 'appointment', name: 'Dịch vụ', count: invoices.filter(i => i.appointmentId).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo mã, tên, phương thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          <FaFilter className="mr-2" /> Bộ lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['MÃ HĐ', 'KHÁCH HÀNG', 'TỔNG TIỀN', 'THANH TOÁN', 'TRẠNG THÁI', 'NGÀY TẠO'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((inv) => (
              <tr key={inv.txnRef}>
                <td className="px-6 py-4 text-blue-600 font-semibold">{inv.txnRef}</td>
                <td className="px-6 py-4">{inv.receiverName}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{inv.total?.toLocaleString()}₫</td>
                <td className="px-6 py-4">{inv.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : inv.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderProductPage;
