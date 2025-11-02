import { Menu, Input, Button, Dropdown, Badge } from "antd";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { MdSpa } from "react-icons/md";
import UserInfo from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useSearchParams } from "react-router-dom";
import { useServices } from "../services/serviceApi";
import { useEffect, useRef, useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { getNotifications } from "../services/notificationApi";

export default function Header() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: services = [] } = useServices(1, 10);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationSound = useRef(new Audio("/sounds/news-ting-6832.mp3"));
  const prevCount = useRef<number>(0);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const data = await getNotifications(user.id);

      // ✅ Chuẩn hóa dữ liệu
      const normalized = (data || []).map((n: any) => ({
        ...n,
        read: n.read ?? n.Read ?? n.isRead ?? false,
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));

      // ✅ Sắp xếp mới nhất lên đầu
      const sorted = normalized.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setNotifications(sorted);

      const unread = sorted.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    }
  };

  // ⏱ Auto refresh 30s
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // 🔔 Âm thanh khi có thêm thông báo mới
  useEffect(() => {
    if (notifications.length > prevCount.current) {
      notificationSound.current.play().catch(() => {});
    }
    prevCount.current = notifications.length;
  }, [notifications]);

  const menuItems = [
    { key: "home", label: "Trang Chủ", onClick: () => navigate("/home") },
    {
      key: "services",
      label: "Dịch Vụ",
      children: services.map((s: any) => ({
        key: `service-${s.id}`,
        label: s.name,
        onClick: () => navigate(`/services/${s.id}`),
      })),
    },
    { key: "product", label: "Sản Phẩm", onClick: () => navigate(`/products`) },
    { key: "booking", label: "Đặt Lịch" },
    { key: "about", label: "Về Chúng Tôi" },
    { key: "contact", label: "Liên Hệ" },
  ];

  return (
    <header className="fixed w-full z-30 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer"
        >
          <MdSpa className="text-pink-500 text-2xl m-2" />
          <div className="font-bold text-pink-600 text-xl">Bella Spa</div>
        </div>

        <Menu
          mode="horizontal"
          className="hidden md:flex flex-1 justify-center border-none"
          items={menuItems}
        />

        <div className="flex items-center gap-3">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm dịch vụ..."
            className="hidden md:block w-60"
          />

          {/* 🔔 Dropdown thông báo */}
          <Dropdown
            overlay={
              <NotificationPanel
                notifications={notifications}
                setNotifications={setNotifications}
                fetchNotifications={fetchNotifications}
                setUnreadCount={setUnreadCount}
              />
            }
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{ padding: 0 }}
          >
            <Badge count={unreadCount} size="small" offset={[-5, 5]}>
              <BellOutlined className="text-xl cursor-pointer text-gray-700 hover:text-pink-600" />
            </Badge>
          </Dropdown>

          {user ? (
            <UserInfo />
          ) : (
            <Button
              type="default"
              icon={<UserOutlined className="!text-white" />}
              className="!bg-pink-700"
              onClick={() => navigate("/login")}
            >
              <span className="text-white">Đăng Nhập</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
