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
import { useStaffs } from "../../../shared/services/staffApi";
import { axiosClient } from "../../../shared/lib/axiosClient";

export default function StaffPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // ✅ Load danh sách
    const { data, isLoading, refetch } = useStaffs(page, pageSize);
    const Staffs = (data?.content as any[]) || (data as any[]) || [];

    // ✅ Xóa
    const handleDelete = async (id: number) => {
        try {
            await axiosClient.delete(`/Staff/${id}`);
            message.success("Xóa nhân viên thành công!");
            refetch();
        } catch (err) {
            console.error(err);
            message.error("Không thể xóa nhân viên!");
        }
    };
    const totalElements = data?.totalElements || 0;
    // ✅ Cấu hình cột
    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 60 },
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
        { title: "Ngày Làm", dataIndex: "hireDate", key: "hireDate" },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        { title: "Giới tính", dataIndex: "gender", key: "gender" },
        { title: "Rank", dataIndex: "staffRank", key: "staffRank" },
        { title: "Lương", dataIndex: "baseSalary", key: "baseSalary" },
        { title: "Thưởng", dataIndex: "bonus", key: "bonus" },
        { title: "Tổng doanh thu", dataIndex: "totalRevenue", key: "totalRevenue" },
        { title: "Trạng thái", dataIndex: "status", key: "status" },


        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (v: string) => (v ? new Date(v).toLocaleString() : "-"),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => setEditingStaff(record)}
                    />
                    <Popconfirm
                        title="Xóa nhân viên?"
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
            title="Danh sách Nhân viên"
            extra={
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm nhân viên
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={Staffs}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalElements,
                    showSizeChanger: true,
                    onChange: (newPage, newSize) => {
                        setPage(newPage);
                        setPageSize(newSize);
                    }
                }}
            />

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Thêm nhân viên"
            >
                {/* form thêm Staff ở đây */}
            </Modal>

            <Modal
                open={!!editingStaff}
                onCancel={() => setEditingStaff(null)}
                footer={null}
                title="Cập nhật nhân viên"
            >
                {/* form sửa Staff ở đây */}
            </Modal>
        </Card>
    );
}
