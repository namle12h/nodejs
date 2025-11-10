import React from "react";

// --- SVG Icons ---
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a4.5 4.5 0 01-4.737 4.439v.041c.2.146.368.324.498.536.27.427.324.938.148 1.455-.176.517-.655.877-1.18.995h-7.662c-.525-.118-1.004-.478-1.18-.995-.176-.517-.122-1.028.148-1.455.13-.212.298-.39.498-.536v-.04c.257-.042.5-.138.723-.284v-.04A4.5 4.5 0 016 6.75v-.243"
    />
  </svg>
);

const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.501a12.001 12.001 0 002.35 1.488 15.004 15.004 0 0011.666 0 12.001 12.001 0 002.35-1.488M12 14.25a6.75 6.75 0 00-6.75 6.75h13.5A6.75 6.75 0 0012 14.25z"
    />
  </svg>
);

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
    />
  </svg>
);

// =================== CUSTOMER OVERVIEW CARD ===================
interface CustomerItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  count: number;
  color: string;
}

const CustomerOverviewCard = () => {
  const CustomerItem = ({ icon: Icon, title, count, color }: CustomerItemProps) => (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xl font-semibold text-gray-800">{count}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống Kê Khách Hàng</h2>

      <div className="space-y-2">
        <CustomerItem icon={MailIcon} title="Khách Hàng Thân Thiết" count={156} color="bg-amber-500" />
        <CustomerItem icon={UserGroupIcon} title="Khách Hàng Mới" count={23} color="bg-green-500" />
        <CustomerItem icon={RefreshIcon} title="Tái Khám Tháng Này" count={89} color="bg-blue-500" />
      </div>
    </div>
  );
};

// =================== KHÁCH HÀNG GẦN ĐÂY ===================
interface CustomerListItemProps {
  avatar: string;
  name: string;
  time: string;
  revenue: string;
  visits: number;
}

const RecentCustomersCard = () => {
  const CustomerListItem = ({ avatar, name, time, revenue, visits }: CustomerListItemProps) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-sm text-left text-gray-500">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-800">{revenue}</p>
        <p className="text-xs text-gray-500">{visits} lần</p>
      </div>
    </div>
  );

  const customers = [
    { name: "Nguyễn Thị Hoa", time: "2 ngày trước", revenue: "2.4Mđ", visits: 12, avatar: "https://public.readdy.ai/ai/img_res/687ca7caddff0829878aefecfbf0bff9.jpg" },
    { name: "Trần Văn Nam", time: "1 tuần trước", revenue: "1.8Mđ", visits: 8, avatar: "https://public.readdy.ai/ai/img_res/687ca7caddff0829878aefecfbf0bff9.jpg" },
    { name: "Lê Thị Minh", time: "3 ngày trước", revenue: "3.2Mđ", visits: 15, avatar: "https://public.readdy.ai/ai/img_res/687ca7caddff0829878aefecfbf0bff9.jpg" },
    { name: "Phạm Minh Đức", time: "5 ngày trước", revenue: "1.5Mđ", visits: 6, avatar: "https://public.readdy.ai/ai/img_res/687ca7caddff0829878aefecfbf0bff9.jpg" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Khách Hàng Gần Đây</h2>
        <button className="text-blue-500 text-sm font-medium hover:text-blue-700">Xem tất cả</button>
      </div>

      <div className="space-y-1">
        {customers.map((c, index) => (
          <CustomerListItem key={index} {...c} />
        ))}
      </div>
    </div>
  );
};

// =================== SERVICE STATS ===================
interface ServiceItemProps {
  iconColor: string;
  title: string;
  amount: string;
  count: number;
  percentage: string;
}

const ServiceStatsCard = () => {
  const ServiceItem = ({ iconColor, title, amount, count, percentage }: ServiceItemProps) => (
    <div className="flex items-center justify-between py-3 border-b h-full border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3 w-1/2">
        <div className={`w-3 h-3 rounded-full ${iconColor}`}></div>
        <p className="font-medium text-gray-700">{title}</p>
      </div>
      <div className="text-right w-1/4">
        <p className="font-semibold text-gray-800">{amount}</p>
        <p className="text-xs text-gray-500">{count} lượt đặt</p>
      </div>
      <div className="text-right w-1/4">
        <p className="text-sm font-semibold">{percentage}</p>
      </div>
    </div>
  );

  const services = [
    { title: "Massage Thư Giãn", amount: "22.5Mđ", count: 45, percentage: "35%", iconColor: "bg-teal-500" },
    { title: "Chăm Sóc Da Mặt", amount: "19.2Mđ", count: 32, percentage: "28%", iconColor: "bg-purple-500" },
    { title: "Tắm Trắng Body", amount: "16.8Mđ", count: 28, percentage: "22%", iconColor: "bg-blue-500" },
    { title: "Nail & Spa", amount: "9.0Mđ", count: 18, percentage: "15%", iconColor: "bg-pink-500" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Thống Kê Dịch Vụ</h2>
        <button className="text-blue-500 text-sm font-medium hover:text-blue-700">Xem tất cả</button>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-500 mb-4">Top dịch vụ được đặt nhiều nhất</p>

        {services.map((s, index) => (
          <ServiceItem key={index} {...s} />
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
        <p className="font-medium text-gray-700">Tổng doanh thu dịch vụ</p>
        <p className="text-xl font-bold text-gray-900">67.5Mđ</p>
      </div>
    </div>
  );
};

export { CustomerOverviewCard, RecentCustomersCard, ServiceStatsCard };
