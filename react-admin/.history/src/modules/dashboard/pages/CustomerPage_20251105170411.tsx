import {
  Button,
  Card,
  message,
  Popconfirm,
  Space,
  Table,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useCustomers } from "../../../shared/services/customerApi";
import { axiosClient } from "../../../shared/lib/axiosClient";

export default function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  // ✅ Load danh sách
  const { data, isLoading, refetch } = useCustomers(1, 10);
  const customers = data?.content || [];

  // ✅ Xóa
  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/customers/${id}`);
      message.success("Xóa khách hàng thành công!");
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa khách hàng!");
    }
  };

  const formatRank = (rank: string | null) => {
  switch (rank) {
     case "BRONZE": return <Tag color="orange">Đồng</Tag>;
    case "SILVER": return <Tag color="gray">Bạc</Tag>;
    case "GOLD": return <Tag color="gold">Vàng</Tag>;
    case "DIAMOND": return <Tag color="blue">Kim cương</Tag>;
    case "NEWBIE": return <Tag color="green">Khách mới</Tag>;
    default: return "Khách mới";
  }
};


  // ✅ Cấu hình cột
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Rank", dataIndex: "rank", key: "rank",render: (v: string | null) => formatRank(v), },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => (v ? new Date(v).toLocaleString() : "-"),
    },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => setEditingCustomer(record)}
          />
          <Popconfirm
            title="Xóa khách hàng?"
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
      title="Danh sách khách hàng"
      extra={
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm khách hàng
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Thêm khách hàng"
      >
        {/* form thêm customer ở đây */}
      </Modal>

      <Modal
        open={!!editingCustomer}
        onCancel={() => setEditingCustomer(null)}
        footer={null}
        title="Cập nhật khách hàng"
      >
        {/* form sửa customer ở đây */}
      </Modal>
    </Card>
  );
}
