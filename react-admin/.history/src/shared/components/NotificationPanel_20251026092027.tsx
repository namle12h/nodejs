import { useState } from "react";
import { List, Button, Typography } from "antd";
import {
  SettingOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
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
    <div
      style={{
        width: 400,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: 10,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="font-semibold text-lg">Thông báo</h3>
        <div className="space-x-3 text-sm">
          <Button type="link" onClick={markAllRead}>
            Đánh dấu tất cả đã đọc
          </Button>
          <Button type="link" danger onClick={deleteAll}>
            Xóa tất cả
          </Button>
        </div>
      </div>

      <Text className="block px-2 mb-2 text-gray-500">
        Bạn có {notifications.filter((n) => !n.isRead).length} thông báo chưa đọc
      </Text>

      {/* List notifications */}
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.isRead ? "#f9fafb" : "#e6f4ff",
              borderRadius: 8,
              margin: "4px 8px",
              padding: "10px 12px",
            }}
          >
            <List.Item.Meta
              avatar={getIcon(item.type)}
              title={
                <div className="flex justify-between">
                  <span className="font-medium">{item.title}</span>
                  {!item.isRead && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => markRead(item.id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>
              }
              description={
                <>
                  <div className="text-gray-600">{item.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                </>
              }
            />
          </List.Item>
        )}
      />

      {/* Footer */}
      <div className="text-center border-t mt-2 pt-2">
        <Button type="link">Xem tất cả thông báo</Button>
      </div>
    </div>
  );
}
