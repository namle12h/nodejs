import {
  Button,
  Card,
  message,
  Popconfirm,
  Space,
  Table,
  Modal,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useStaffs } from "../../../shared/services/staffApi"; // Giữ nguyên, đã fix bên trong file API
import { axiosClient } from "../../../shared/lib/axiosClient";

export default function StaffPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  // ✅ Load danh sách Staff
  const { data, isLoading, refetch } = useStaffs(1, 10);
  const Staffs = data?.content || [];

  // ✅ Xóa Staff
  const handleDelete = async (id: number) => {
    try {
      // Endpoint /staffs/${id} giả định bạn muốn dùng là /staff/${id} như trong API
      await axiosClient.delete(`/staff/${id}`); 
      message.success("Xóa nhân viên thành công!"); // Sửa thông báo
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa nhân viên!"); // Sửa thông báo
    }
  };
  
  // Hàm format hiển thị cho staffRank (ví dụ: SPA_THERAPIST -> Kỹ thuật viên Spa)
  const formatStaffRank = (rank: string | null) => {
    switch (rank) {
        case "SPA_THERAPIST": return <Tag color="blue">Kỹ thuật viên Spa</Tag>;
        case "MANAGER": return <Tag color="volcano">Quản lý</Tag>;
        case "SALES": return <Tag color="green">Nhân viên Sales</Tag>;
        default: return <Tag color="default">Chưa xác định</Tag>;
    }
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '-';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  }

  // ✅ Cấu hình cột (Đã đổi sang thông tin Nhân viên)
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Username", dataIndex: "username", key: "username" },
    // Cập nhật các cột liên quan đến Staff
    { title: "Chức danh", dataIndex: "staffRank", key: "staffRank", render: (v: string | null) => formatStaffRank(v) },
    { title: "Lương cơ bản", dataIndex: "baseSalary", key: "baseSalary", render: (v: number) => formatCurrency(v) },
    { title: "Thưởng", dataIndex: "bonus", key: "bonus", render: (v: number) => formatCurrency(v) },
    { title: "Tỷ lệ HH", dataIndex: "commissionRate", key: "commissionRate", render: (v: number) => `${v * 100}%` },
    { title: "Doanh thu", dataIndex: "totalRevenue", key: "totalRevenue", render: (v: number) => formatCurrency(v) },
    {
      title: "Ngày vào làm",
      dataIndex: "hireDate",
      key: "hireDate",
      render: (v: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : "-"),
    },
    {
      title: "Ngày tạo TK",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => (v ? new Date(v).toLocaleString('vi-VN') : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditingStaff(record);
              setIsModalOpen(true); // Thường là mở modal riêng cho sửa
            }}
          />
          <Popconfirm
            title="Xóa nhân viên?" // Sửa thông báo
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách Nhân viên" // Sửa tiêu đề
      extra={
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setEditingStaff(null); // Reset để mở form Thêm mới
            setIsModalOpen(true);
          }}
        >
          Thêm Nhân viên // Sửa nút
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={Staffs}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        footer={null}
        title={editingStaff ? "Cập nhật Nhân viên" : "Thêm Nhân viên"} // Sửa tiêu đề modal
      >
        {/* form thêm/sửa Staff ở đây */}
        {/* Bạn sẽ truyền editingStaff xuống form để form biết là đang Thêm mới hay Cập nhật */}
        {/* <StaffForm initialData={editingStaff} onSuccess={() => { setIsModalOpen(false); setEditingStaff(null); refetch(); }} /> */}
      </Modal>
    </Card>
  );
}