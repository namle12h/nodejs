import { useEffect, useState } from "react";
import { axiosClient } from "../../../shared/lib/axiosClient";
import { Table, Tag, message, Popconfirm, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Appointment {
  id: number;
  serviceName: string;
  startAt: string;
  roomName?: string;
  staffName?: string;
  status: string;
}

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟩 Lấy danh sách lịch hẹn
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/auth/my-appointments");
      setAppointments(res.data);
    } catch (error) {
      message.error("Không thể tải lịch sử đặt lịch!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🟥 Hủy lịch hẹn
  const handleCancel = async (id: number) => {
    try {
      const res = await axiosClient.put(`/auth/cancel-appointment/${id}`);
      message.success(res.data.message || "Hủy lịch hẹn thành công!");
      fetchAppointments(); // reload lại danh sách
    } catch (err: any) {
      message.error(err.response?.data?.error || "Không thể hủy lịch hẹn!");
    }
  };

  // 🟦 Cấu hình cột bảng
  const columns: ColumnsType<Appointment> = [
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "startAt",
      key: "startAt",
      render: (value: string) =>
        new Date(value).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
      render: (room: string) => room || <span className="text-gray-400">Chưa sắp xếp</span>,
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
      render: (staff: string) => staff || <span className="text-gray-400">Đang phân công</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Completed"
            ? "green"
            : status === "Pending"
            ? "orange"
            : status === "Cancelled"
            ? "red"
            : "blue";
        const label =
          status === "Pending"
            ? "Chờ xác nhận"
            : status === "Completed"
            ? "Hoàn thành"
            : status === "Cancelled"
            ? "Đã hủy"
            : status;
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) =>
        record.status === "Pending" || record.status === "Confirmed" ? (
          <Popconfirm
            title="Xác nhận hủy lịch?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => handleCancel(record.id)}
          >
            <Button danger size="small">
              Hủy lịch
            </Button>
          </Popconfirm>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-semibold mb-6">🕒 Lịch sử đặt dịch vụ</h2>

      <Table
        columns={columns}
        dataSource={appointments}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        className="rounded-lg overflow-hidden"
      />
    </div>
  );
}
