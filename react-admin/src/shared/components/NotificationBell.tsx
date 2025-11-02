import { useEffect, useRef, useState } from "react";
import { Dropdown, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { getNotifications } from "../services/notificationApi";
import NotificationPanel from "./NotificationPanel";
import { useAuthStore } from "../stores/authStore";

export default function NotificationBell() {
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationSound = useRef(new Audio("/sounds/news-ting-6832.mp3"));
  const prevLatestId = useRef<number | null>(null);
  const firstLoad = useRef(true);

  // 🧩 Load thông báo
  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const data = await getNotifications(user.id);
      const normalized = (data || []).map((n: any) => ({
        ...n,
        read: n.read ?? n.Read ?? n.isRead ?? false,
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));

      const sorted = normalized.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setNotifications(sorted);
      setUnreadCount(sorted.filter((n: any) => !n.read).length);

      const latestId = sorted[0]?.id;
      if (firstLoad.current) {
        firstLoad.current = false;
        prevLatestId.current = latestId;
        return;
      }

      // 🧠 Phát âm thanh nếu có thông báo mới và tab đang active
      if (
        latestId &&
        prevLatestId.current &&
        latestId !== prevLatestId.current &&
        document.visibilityState === "visible"
      ) {
        notificationSound.current.play().catch(() => {});
      }

      prevLatestId.current = latestId;
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    }
  };

  // 🔁 Tự refresh mỗi 5 giây
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
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
  );
}
