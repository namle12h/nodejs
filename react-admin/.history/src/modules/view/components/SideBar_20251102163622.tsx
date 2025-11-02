import { User, Lock, List, MapPin, Bell, LogOut, ShoppingCart, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openOrders, setOpenOrders] = useState(false); // 👈 trạng thái mở/đóng submenu

  const menu = [
    { icon: <User size={18} />, label: "Thông tin cá nhân", path: "/profile/info" },
    { icon: <Lock size={18} />, label: "Đổi mật khẩu", path: "/profile/password" },
    {
      icon: <List size={18} />,
      label: "Lịch sử đơn hàng",
      children: [
        { icon: <ShoppingCart size={16} />, label: "Đơn hàng sản phẩm", path: "/profile/products" },
        { icon: <Calendar size={16} />, label: "Đơn hàng dịch vụ", path: "/profile/orders" },
      ],
    },
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

    if (item.children) {
      // Nếu là mục có submenu → toggle mở/đóng
      setOpenOrders(!openOrders);
      return;
    }

    navigate(item.path);
  };

  return (
    <aside className="w-64 bg-white rounded-r-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Tài khoản của tôi</h2>
      <nav className="space-y-1">
        {menu.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => handleClick(item)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-left transition-all ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.children && (
                <span className="text-xs">{openOrders ? "▲" : "▼"}</span>
              )}
            </button>

            {/* Hiển thị submenu nếu có */}
            {item.children && openOrders && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child, j) => (
                  <button
                    key={j}
                    onClick={() => navigate(child.path)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-sm transition-all ${
                      location.pathname === child.path
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {child.icon}
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
