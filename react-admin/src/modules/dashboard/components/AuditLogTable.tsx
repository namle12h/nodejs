import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Drawer,
  Descriptions,
  Pagination,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useHistory } from "../../../shared/services/historyApi";

const AuditLogPage = () => {


  const [page, setPage] = useState(1);
  const limit = 10;

  // 🧩 Lấy dữ liệu từ API thật
  const { data, isLoading } = useHistory(page, limit);

  const logs = data?.content || [];
  // 🧮 Thống kê tạm (bạn có thể thay bằng API thống kê riêng)
  const stats = {
    total: data?.totalElements || 0,
    success: logs.filter((l: any) => l.status === "SUCCESS").length,
    failed: logs.filter((l: any) => l.status === "FAILED").length,
    activeUsers: new Set(logs.map((l: any) => l.performedByName)).size,
  };


  // 🧠 State mở Drawer
  const [open, setOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // 🧾 Cấu hình bảng
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "performedByName",
      key: "performedByName",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full ${record.role === "ADMIN"
              ? "bg-red-100 text-red-500"
              : record.role === "STAFF"
                ? "bg-blue-100 text-blue-500"
                : "bg-green-100 text-green-500"
              }`}
          >
            <UserOutlined />
          </div>
          <div>
            <div className="font-medium">{record.performedByName}</div>
            <div className="text-xs text-gray-500">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      align: "center" as const,
      render: (action: string) => {
        let color = "";
        let label = "";

        switch (action?.toUpperCase()) {
          case "CREATE":
            color = "green";
            label = "Tạo mới";
            break;
          case "UPDATE":
            color = "gold";
            label = "Cập nhật";
            break;
          case "DELETE":
            color = "red";
            label = "Xóa";
            break;
          default:
            color = "default";
            label = action;
            break;
        }

        return (
          <Tag color={color} className="px-3 py-1 text-sm font-medium">
            {label}
          </Tag>
        );
      },
    },

    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
      render: (_: any, record: any) => (
        <span className="text-gray-600 text-sm">
          {`${record.performedByName || "Người dùng"} đã ${record.action?.toLowerCase()} ${record.entity || ""} ${record.field ? `(${record.field})` : ""}`}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "performedAt", // hoặc createdAt — tùy backend trả về
      key: "performedAt",
      render: (value: string) => (
        <span className="text-gray-600 text-sm">
          {value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-"}
        </span>
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) =>
        status === "SUCCESS" ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            className="px-3 py-1 text-sm"
          >
            Thành công
          </Tag>
        ) : (
          <Tag
            icon={<CloseCircleOutlined />}
            color="error"
            className="px-3 py-1 text-sm"
          >
            Thất bại
          </Tag>
        ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Lịch Sử Hoạt Động</h1>
      <p className="text-gray-500 mb-6">
        Theo dõi tất cả hoạt động trong hệ thống
      </p>

      {/* 🧮 Thống kê tổng */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="Tổng số hoạt động"
              value={stats.total}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="Thành công"
              value={stats.success}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="Thất bại"
              value={stats.failed}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="rounded-2xl shadow-sm">
            <Statistic
              title="Người dùng hoạt động"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 📋 Danh sách hoạt động */}
      <Card
        title="Danh sách hoạt động"
        className="rounded-2xl shadow-sm"
        bodyStyle={{ padding: 0 }}
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              dataSource={logs}
              columns={columns}
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedLog(record);
                  setOpen(true);
                },
              })}
            />

            <div className="flex justify-end mt-4">
              <Pagination
                current={page}
                pageSize={limit}
                total={data?.totalElements || 0}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>

      {/* 🪟 Drawer Chi tiết log */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <InfoCircleOutlined /> Chi tiết hoạt động
          </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        width={520}
      >
        {selectedLog && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Người dùng">
              {selectedLog.user}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {selectedLog.role}
            </Descriptions.Item>
            <Descriptions.Item label="Hành động">
              {selectedLog.action}
            </Descriptions.Item>
            <Descriptions.Item label="Chi tiết">
              {selectedLog.detail}
            </Descriptions.Item>
            <Descriptions.Item label="Thực thể">
              {selectedLog.entity}
            </Descriptions.Item>
            <Descriptions.Item label="Trường thay đổi">
              {selectedLog.field}
            </Descriptions.Item>
            <Descriptions.Item label="Giá trị cũ">
              {selectedLog.oldValue}
            </Descriptions.Item>
            <Descriptions.Item label="Giá trị mới">
              {selectedLog.newValue}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {selectedLog.performedAt
                ? dayjs(selectedLog.performedAt).format("DD/MM/YYYY HH:mm:ss")
                : "-"}

            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {selectedLog.status === "SUCCESS" ? (
                <Tag color="green">Thành công</Tag>
              ) : (
                <Tag color="red">Thất bại</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default AuditLogPage;
