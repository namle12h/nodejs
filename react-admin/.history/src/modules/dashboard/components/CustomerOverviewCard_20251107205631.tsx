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