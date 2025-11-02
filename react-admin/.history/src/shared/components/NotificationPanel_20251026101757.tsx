import { useEffect, useState } from "react";
import { List, Typography, Spin, message } from "antd";
import {
  SettingOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteAll,
} from "../services/notificationApi"; // ⚙️ import các hàm gọi API
import { useAuthStore } from "../stores/authStore";

const { Text } = Typography;

export default function NotificationPanel() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);


  // 🔁 Load thông báo từ backend
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(userId);
      setNotifications(data || []);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
      message.error("Không thể tải thông báo!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đánh dấu 1 thông báo đã đọc
  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      message.error("Không thể đánh dấu đã đọc");
    }
  };

  // ✅ Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    try {
      await markAllRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      message.error("Không thể đánh dấu tất cả đã đọc");
    }
  };

  // 🗑 Ẩn (xóa mềm) toàn bộ
  const handleDeleteAll = async () => {
    try {
      await deleteAll(userId);
      setNotifications([]);
    } catch {
      message.error("Không thể xóa tất cả thông báo");
    }
  };

  // 🧩 Icon theo loại thông báo
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spin />
      </div>
    );
  }

  return (
    <div className="w-[380px] max-h-[500px] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 p-3 relative z-[2000]">
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
        Bạn có {notifications.filter((n) => !n.isRead).length} thông báo chưa đọc
      </Text>

      {/* Danh sách thông báo */}
      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-6">Không có thông báo nào</div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={`rounded-lg p-3 mb-2 ${item.isRead ? "bg-gray-50" : "bg-blue-50"
                }`}
            >
              <List.Item.Meta
                avatar={getIcon(item.type)}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.title}</span>
                    {!item.isRead && (
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
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
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
