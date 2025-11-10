import React, { useMemo, useState } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import type { ApiInvoice, Order } from '../../../shared/types/type';
import { useGetAllInvoice } from '../../../shared/services/invoiceApi';
import { useNameLookupMaps, type NameMap } from '../../../shared/services/useNameLookupMaps'

// --- 1. KHAI BÁO KIỂU DỮ LIỆU (INTERFACES) ---

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

// --- 2. HÀM ÁNH XẠ (MAPPER FUNCTION) ---

const mapApiInvoicesToOrders = (
  apiInvoices: ApiInvoice[],
  serviceNameMap: NameMap,
  productNameMap: NameMap,
  customerNameMap: NameMap
): Order[] => {
  if (!apiInvoices || apiInvoices.length === 0) return [];
  console.log("--- START MAPPING DEBUG ---");
  console.log("Service Name Map:", serviceNameMap);
  console.log("Product Name Map:", productNameMap);
  console.log("Customer Name Map:", customerNameMap);
  return apiInvoices.map(invoice => {

    // 1. Xử lý Ngày giờ và Trạng thái
    const dateObj = new Date(invoice.createdAt || Date.now());
    const dateStr = dateObj.toLocaleDateString('vi-VN');
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    let displayStatus: Order['status'];
    switch (invoice.status) {
      case 'PAID': displayStatus = 'Hoàn thành'; break;
      case 'PENDING': displayStatus = 'Đang xử lý'; break;
      case 'FAILED': displayStatus = 'Thất bại'; break;
      default: displayStatus = 'Chờ xử lý';
    }

    // 2. Xử lý Tên Khách hàng (Đã sửa lỗi as any)
    const customerIdFallback = invoice.customerId ?? 'N/A';
    const customerIdNum = invoice.customerId ? Number(invoice.customerId) : null;

    // 🔥 SỬA LỖI TÊN KHÁCH HÀNG: Ưu tiên receiverName/Tên DTO, sau đó là tên định dạng
   const customerName = invoice.receiverName
            ?? invoice.customer?.name 
            // ✅ TRA CỨU TÊN THẬT SỰ TỪ MAP
            ?? (customerIdNum ? customerNameMap[customerIdNum] : null) 
            ?? `Khách hàng #${customerIdFallback}`; 

const customerEmail = invoice.receiverPhone
    ?? invoice.customer?.email
    // ✅ TRA CỨU EMAIL TỪ customerNameMap (GIẢ ĐỊNH BẠN ĐÃ LƯU EMAIL VÀO MAP NÀY)
    ?? (customerIdNum ? customerNameMap[customerIdNum] : null) 
    ?? `khachhang${customerIdFallback}@email.com`;
    // --------------------------------------------------------
    // 🔥 LOGIC SẢN PHẨM/DỊCH VỤ (Hoàn chỉnh với DTO và Tra cứu Map)
    // --------------------------------------------------------
    const primaryItem = invoice.items?.[0];
    let productName: string = invoice.items?.length > 1 ? "Nhiều mục" : "Mục không xác định";

    if (primaryItem) {

      // Ưu tiên 1: Có Object DTO (API mới)
      if (primaryItem.service) {
        productName = `Dịch vụ: ${primaryItem.service.name ?? `#${primaryItem.service.id}`}`;
      } else if (primaryItem.product) {
        productName = `Sản phẩm: ${primaryItem.product.name ?? `#${primaryItem.product.id}`}`;
      }

      // Ưu tiên 2: Không có DTO, sử dụng Map tra cứu ID (API cũ)
      // LƯU Ý: serviceId/productId phải được thêm vào ApiInvoiceItem DTO của bạn.
      const serviceId = (primaryItem as any).serviceId as number | undefined;
      const productId = (primaryItem as any).productId as number | undefined;

      if (serviceId) {
        const name = serviceNameMap[serviceId] ?? `#${serviceId}`;
        productName = `Dịch vụ: ${name}`;
      } else if (productId) {
        const name = productNameMap[productId] ?? `#${productId}`;
        productName = `Sản phẩm: ${name}`;
      }

      // Nếu vẫn là 'Mục không xác định' và không có serviceId/productId, ta giữ nguyên.
    }
    // --------------------------------------------------------

    return {
      id: invoice.txnRef ? `${invoice.txnRef}` : `INV-${invoice.id}`,
      type: invoice.appointmentId !== null ? 'Appointment' : 'Product',
      customer: customerName,
      email: customerEmail,
      product: productName,
      value: invoice.total.toLocaleString('vi-VN') + '₫',
      date: dateStr,
      time: timeStr,
      status: displayStatus,
    };
  });
};

// --- 3. CÁC COMPONENT PHỤ (Giữ nguyên) ---

const statData: StatCardProps[] = [
  { title: 'Tổng đơn hàng', value: '1,234', change: '+12%', isPositive: true, icon: '🛒' },
  { title: 'Đơn hàng hôm nay', value: '45', change: '+8%', isPositive: true, icon: '🗓️' },
  { title: 'Doanh thu tháng', value: '₫125.5M', change: '+15%', isPositive: true, icon: '💸' },
  { title: 'Đơn chờ xử lý', value: '23', change: '-5%', isPositive: false, icon: '⏱️' },
];

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

// --- 4. COMPONENT CHÍNH ---

const OrderProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 1. GỌI HOOK LẤY DỮ LIỆU ĐƠN HÀNG
  const {
    data: apiInvoices,
    isLoading: isLoadingInvoices,
    isError: isErrorInvoices
  } = useGetAllInvoice();

  // 2. GỌI HOOK TRA CỨU
  const {
    serviceNameMap,
    productNameMap,
    customerNameMap,
    isLoading: isLoadingLookup
  } = useNameLookupMaps();

  // 3. XỬ LÝ TRẠNG THÁI TẢI DỮ LIỆU CHUNG
  const isLoading = isLoadingInvoices || isLoadingLookup;
  const isError = isErrorInvoices;

  // 🔄 CHUYỂN ĐỔI VÀ LỌC DỮ LIỆU
  const fetchedOrders: Order[] = useMemo(() => {
    if (!apiInvoices || isLoadingLookup) return [];

    // TRUYỀN MAP VÀO HÀM MAPPING
    return mapApiInvoicesToOrders(apiInvoices, serviceNameMap, productNameMap, customerNameMap);
  }, [apiInvoices, serviceNameMap, productNameMap, customerNameMap, isLoadingLookup]);

  const filteredDataByTab = activeTab === 'all'
    ? fetchedOrders
    : fetchedOrders.filter(order => order.type.toLowerCase() === activeTab);

  const finalFilteredData = filteredDataByTab.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTabs = [
    { id: 'all', name: 'Tất cả đơn hàng', count: fetchedOrders.length },
    { id: 'appointment', name: 'Đơn hàng Appointment', count: fetchedOrders.filter(o => o.type === 'Appointment').length },
    { id: 'product', name: 'Đơn hàng Product', count: fetchedOrders.filter(o => o.type === 'Product').length },
  ];

  // 🛑 HIỂN THỊ TRẠNG THÁI (LOADING/ERROR)
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center pt-20">
        <h1 className="text-xl font-semibold text-blue-600">Đang tải dữ liệu đơn hàng và danh mục... ⏳</h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center pt-20">
        <h1 className="text-xl font-semibold text-red-600">❌ Lỗi tải dữ liệu</h1>
        <p className="text-gray-500">Không thể kết nối API. Vui lòng kiểm tra console.</p>
      </div>
    );
  }
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
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${activeTab === tab.id
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