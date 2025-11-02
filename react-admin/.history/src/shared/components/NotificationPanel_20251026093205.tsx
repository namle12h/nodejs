import { useState } from "react";
import { List, Button, Typography } from "antd";
import {
  SettingOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system",
      title: "Thông báo system mới",
      message: "Đây là một thông báo system được tạo tự động để demo.",
      time: "Vừa xong",
      isRead: false,
    },
    {
      id: 2,
      type: "update",
      title: "Cập nhật hệ thống",
      message: "Hệ thống đã được cập nhật lên phiên bản mới.",
      time: "2 giờ trước",
      isRead: false,
    },
    {
      id: 3,
      type: "message",
      title: "Tin nhắn mới",
      message: "Bạn có một tin nhắn mới từ Nguyễn Văn A.",
      time: "3 giờ trước",
      isRead: false,
    },
    {
      id: 4,
      type: "alert",
      title: "Cảnh báo bảo mật",
      message: "Phát hiện đăng nhập từ thiết bị lạ.",
      time: "1 ngày trước",
      isRead: true,
    },
    {
      id: 5,
      type: "alert",
      title: "Cảnh báo bảo mật",
      message: "Phát hiện đăng nhập từ thiết bị lạ.",
      time: "1 ngày trước",
      isRead: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
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

  const markAllRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));

  const deleteAll = () => setNotifications([]);

  const markRead = (id: number) =>
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );

  return (
    <div className="w-[380px] max-h-[500px] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 p-3 relative z-[2000]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-base">Thông báo</h3>
        <div className="space-x-3 text-sm">
          <button
            onClick={markAllRead}
            className="text-blue-600 hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
          <button
            onClick={deleteAll}
            className="text-red-500 hover:underline"
          >
            Xóa tất cả
          </button>
        </div>
      </div>

      <Text className="block mb-3 text-gray-500 text-sm">
        Bạn có {notifications.filter((n) => !n.isRead).length} thông báo chưa đọc
      </Text>

      {/* List notifications */}
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`rounded-lg p-3 mb-2 ${
              item.isRead ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <List.Item.Meta
              avatar={getIcon(item.type)}
              title={
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.title}</span>
                  {!item.isRead && (
                    <button
                      onClick={() => markRead(item.id)}
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
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Footer */}
      <div className="text-center border-t mt-2 pt-2">
        <button className="text-blue-600 text-sm hover:underline">
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
}
