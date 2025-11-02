import { List, Typography, message } from "antd";
import {
  SettingOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { markRead, markAllRead, deleteAll } from "../services/notificationApi";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface NotificationPanelProps {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  fetchNotifications: () => Promise<void>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function NotificationPanel({
  notifications,
  setNotifications,
  fetchNotifications,
  setUnreadCount,
}: NotificationPanelProps) {
  const { user } = useAuthStore();
  const userId = user?.id;
  const navigate = useNavigate();


  // ✅ Đánh dấu 1 thông báo đã đọc
  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id);
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.read).length);
    } catch {
      message.error("Không thể đánh dấu đã đọc");
    }
  };

  // ✅ Đánh dấu tất cả đã đọc (truyền userId)
  const handleMarkAllRead = async () => {
    try {
      if (!userId) return;
      await markAllRead(userId);
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      setUnreadCount(0);
    } catch {
      message.error("Không thể đánh dấu tất cả đã đọc");
    }
  };

  // ✅ Xóa tất cả (truyền userId)
  const handleDeleteAll = async () => {
    try {
      if (!userId) return;
      await deleteAll(userId);
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      message.error("Không thể xóa tất cả");
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "system":
      case "update":
        return <SettingOutlined className="text-blue-500" />;
      case "message":
        return <MessageOutlined className="text-green-500" />;
      case "alert":
        return <ExclamationCircleOutlined className="text-yellow-500" />;
      default:
        return <SettingOutlined />;
    }
  };

  const handleNotificationClick = async (item: any) => {
  try {
    // Đánh dấu đã đọc
    await markRead(item.id);

    // Cập nhật lại list trong UI
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);

    // 👉 Điều hướng dựa vào entityType
    switch (item.entityType?.toUpperCase()) {
      case "BOOKING":
      case "APPOINTMENT":
        navigate(`/profile/orders/${item.entityId}`);
        break;
      case "PAYMENT":
        navigate(`/payment/${item.entityId}`);
        break;
      case "VOUCHER":
        navigate(`/voucher/${item.entityId}`);
        break;
      case "REVIEW":
        navigate(`/reviews/${item.entityId}`);
        break;
      default:
        message.info("Thông báo không có đường dẫn chi tiết.");
    }
  } catch (err) {
    message.error("Không thể mở thông báo này.");
  }
};


  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-[380px] max-h-[500px] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-base">Thông báo</h3>
        <div className="space-x-3 text-sm">
          <button
            onClick={handleMarkAllRead}
            className="text-blue-600 hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
          <button
            onClick={handleDeleteAll}
            className="text-red-500 hover:underline"
          >
            Xóa tất cả
          </button>
        </div>
      </div>

      <Text className="block mb-3 text-gray-500 text-sm">
        Bạn có <b>{unread}</b> thông báo chưa đọc
      </Text>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          Không có thông báo nào
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`rounded-lg p-3 mb-2 ${
                item.read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <List.Item.Meta
                avatar={getIcon(item.type)}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.title}</span>
                    {!item.read && (
                      <button
                        onClick={() => handleMarkRead(item.id)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                }
                description={
                  <div>
                    <p className="text-gray-600">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString("vi-VN")
                        : ""}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* Footer */}
      <div className="text-center border-t mt-2 pt-2">
        <button
          onClick={fetchNotifications}
          className="text-blue-600 text-sm hover:underline"
        >
          Làm mới
        </button>
      </div>
    </div>
  );
}
