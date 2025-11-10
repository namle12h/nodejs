import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import type { ApiInvoice } from '../../../shared/types/type';
// --- 1. KHAI BÁO KIỂU DỮ LIỆU (INTERFACES) ---

interface Order {
  id: string;
  type: 'Appointment' | 'Product';
  customer: string;
  email: string;
  product: string;
  value: string;
  date: string;
  time: string;
  status: 'Hoàn thành' | 'Đang xử lý' | 'Chờ xử lý';
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

interface Tab {
  id: string;
  name: string;
  count: number;
}

// --- 2. DỮ LIỆU MẪU (MOCK DATA) ---

const orderData: Order[] = [
  { id: 'HORD-2024-001', type: 'Appointment', customer: 'Nguyễn Văn An', email: 'an.nguyen@email.com', product: 'Tư vấn thiết kế nội thất', value: '2.000.000₫', date: '15/01/2024', time: '14:00', status: 'Hoàn thành' },
  { id: 'HORD-2024-002', type: 'Product', customer: 'Trần Thị Bình', email: 'binh.tran@email.com', product: 'Ghế sofa da cao cấp', value: '18.500.000₫', date: '14/01/2024', time: '16:00', status: 'Đang xử lý' },
  { id: 'HORD-2024-003', type: 'Appointment', customer: 'Lê Minh Cường', email: 'cuong@email.com', product: 'Khám sức khỏe tổng quát', value: '1.500.000₫', date: '13/01/2024', time: '09:30', status: 'Chờ xử lý' },
  { id: 'HORD-2024-004', type: 'Product', customer: 'Phạm Thị Dung', email: 'dung.pham@email.com', product: 'Tủ quần áo 3 cánh', value: '22.900.000₫', date: '12/01/2024', time: '10:00', status: 'Hoàn thành' },
  { id: 'HORD-2024-005', type: 'Appointment', customer: 'Hoàng Văn Em', email: 'em.hoang@email.com', product: 'Tư vấn pháp lý doanh nghiệp', value: '3.000.000₫', date: '11/01/2024', time: '10:00', status: 'Đang xử lý' },
];

const statData: StatCardProps[] = [
    { title: 'Tổng đơn hàng', value: '1,234', change: '+12%', isPositive: true, icon: '🛒' },
    { title: 'Đơn hàng hôm nay', value: '45', change: '+8%', isPositive: true, icon: '🗓️' },
    { title: 'Doanh thu tháng', value: '₫125.5M', change: '+15%', isPositive: true, icon: '💸' },
    { title: 'Đơn chờ xử lý', value: '23', change: '-5%', isPositive: false, icon: '⏱️' },
];

const tabs: Tab[] = [
  { id: 'all', name: 'Tất cả đơn hàng', count: 156 },
  { id: 'appointment', name: 'Đơn hàng Appointment', count: 89 },
  { id: 'product', name: 'Đơn hàng Product', count: 67 },
];

// ----------------------------------------------------------------------------------------------------
// --- 3. COMPONENTS ---
// ----------------------------------------------------------------------------------------------------

// Component StatCard
const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => {
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const iconBg = isPositive ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-start border border-gray-100">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
        <p className={`text-xs mt-1 ${changeColor}`}>
          <span className="font-semibold">{change}</span> so với tháng trước
        </p>
      </div>
      <div className={`p-3 rounded-full ${iconBg} text-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
};

// Component StatusBadge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let bgColor: string, textColor: string;

  switch (status) {
    case 'Hoàn thành':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Đang xử lý':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Chờ xử lý':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

// Component OrderTable
const OrderTable: React.FC<{ data: Order[] }> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-700">Danh sách đơn hàng ({data.length})</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['ID & LOẠI', 'KHÁCH HÀNG', 'SẢN PHẨM/DỊCH VỤ', 'GIÁ TRỊ', 'NGÀY TẠO', 'TRẠNG THÁI', 'THAO TÁC'].map((header) => (
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
          {data.map((order) => (
            <tr key={order.id}>
              {/* ID & Loại */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <p className="text-blue-600 font-semibold">{order.id}</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{order.type}</span>
              </td>

              {/* Khách hàng */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {order.customer.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </div>
                </div>
              </td>

              {/* Sản phẩm/Dịch vụ */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.product}
              </td>

              {/* Giá trị */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {order.value}
              </td>

              {/* Ngày tạo */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.date}
                <p className="text-xs text-gray-400">Hẹn: {order.time}</p>
              </td>

              {/* Trạng thái */}
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={order.status} />
              </td>

              {/* Thao tác */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
  );
};

// ----------------------------------------------------------------------------------------------------
// --- 4. DASHBOARD CHÍNH ---
// ----------------------------------------------------------------------------------------------------

const OrderProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Logic lọc đơn hàng theo tab (loại)
  const filteredDataByTab = activeTab === 'all' 
    ? orderData 
    : orderData.filter(order => order.type.toLowerCase() === activeTab);

  // Logic lọc theo từ khóa tìm kiếm
  const finalFilteredData = filteredDataByTab.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        
        {/* Tabs */}
        <div className="flex space-x-3 border-b border-gray-100 pb-3 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Toolbar (Search, Filters, Export) */}
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

        {/* Order Table */}
        <OrderTable data={finalFilteredData} />
      </div>
    </div>
  );
};

export default OrderProductPage;