interface CustomerListItemProps {
  avatar: string; // URL ảnh
  name: string;
  time: string;
  revenue: string;
  visits: number;
}
const CustomerListItem: React.FC<CustomerListItemProps> = ({ avatar, name, time, revenue, visits }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0">
    <div className="flex items-center space-x-3">
      {/* Avatar Placeholder */}
      <img
        src={avatar} 
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-green-600">{revenue}</p>
      <p className="text-xs text-gray-500">{visits} lần</p>
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
        <CustomerListItem
          avatar="https://via.placeholder.com/150"
          name="Nguyễn Văn A"
          time="1 giờ trước"
          revenue="1.200.000₫"
          visits={5}
        />
        <CustomerListItem
          avatar="https://via.placeholder.com/150"
          name="Trần Thị B"
          time="2 giờ trước"
          revenue="800.000₫"
          visits={3}
        />
        <CustomerListItem
          avatar="https://via.placeholder.com/150"
          name="Lê Văn C"
          time="3 giờ trước"
          revenue="600.000₫"
          visits={2}
        />
        <CustomerListItem
          avatar="https://via.placeholder.com/150"
          name="Nguyễn Văn D"
          time="4 giờ trước"
          revenue="400.000₫"
          visits={1}
        />
      
      </div>
    </div>
  );
}

export default CustomerOverviewCard;