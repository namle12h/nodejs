// CustomerOverviewCard.jsx
import React from 'react';

const CustomerItem = ({ icon: Icon, title, count, color }) => (
  <div className="flex items-center space-x-4 p-4 border-b last:border-b-0">
    <div className={`p-3 rounded-xl ${color} text-white`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xl font-semibold text-gray-800">{count}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

// Sử dụng React Icons (ví dụ: Heroicons) cho các Icon
// import { MailIcon, UserGroupIcon, RefreshIcon } from '@heroicons/react/solid' 
const MailIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a4.5 4.5 0 01-4.737 4.439v.041c.2.146.368.324.498.536.27.427.324.938.148 1.455-.176.517-.655.877-1.18.995h-7.662c-.525-.118-1.004-.478-1.18-.995-.176-.517-.122-1.028.148-1.455.13-.212.298-.39.498-.536v-.04c.257-.042.5-.138.723-.284v-.04A4.5 4.5 0 016 6.75v-.243" /></svg>;
const UserGroupIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.501a12.001 12.001 0 002.35 1.488 15.004 15.004 0 0011.666 0 12.001 12.001 0 002.35-1.488M12 14.25a6.75 6.75 0 00-6.75 6.75h13.5A6.75 6.75 0 0012 14.25z" /></svg>;
const RefreshIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>;

function CustomerOverviewCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống Kê Khách Hàng</h2>
      <div className="space-y-2">
        <CustomerItem
          icon={MailIcon}
          title="Khách Hàng Thân Thiết"
          count={156}
          color="bg-amber-500" // Màu vàng cam
        />
        <CustomerItem
          icon={UserGroupIcon}
          title="Khách Hàng Mới"
          count={23}
          color="bg-green-500" // Màu xanh lá
        />
        <CustomerItem
          icon={RefreshIcon}
          title="Tái Khám Tháng Này"
          count={89}
          color="bg-blue-500" // Màu xanh dương
        />
      </div>
    </div>
  );
}

export default CustomerOverviewCard;