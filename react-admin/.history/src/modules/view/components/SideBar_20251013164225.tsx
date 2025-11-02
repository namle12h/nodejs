import { User, Lock, List, MapPin, Bell, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { icon: <User size={18} />, label: "Thông tin cá nhân", path: "/profile/info" },
    { icon: <Lock size={18} />, label: "Đổi mật khẩu", path: "/profile/password" },
    { icon: <List size={18} />, label: "Lịch sử đơn hàng", path: "/profile/orders" },
    { icon: <MapPin size={18} />, label: "Địa chỉ giao hàng", path: "/profile/address" },
    { icon: <Bell size={18} />, label: "Cài đặt thông báo", path: "/profile/notifications" },
    { icon: <LogOut size={18} />, label: "Đăng xuất", path: "/logout" },
  ];

  const handleClick = (item: any) => {
    if (item.label === "Đăng xuất") {
      localStorage.clear();
      navigate("/");
      return;
    }
    navigate(item.path);
  };

  return (
    <aside className="w-64 bg-white rounded-r-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Tài khoản của tôi</h2>
      <nav className="space-y-1">
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => handleClick(item)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-all ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
