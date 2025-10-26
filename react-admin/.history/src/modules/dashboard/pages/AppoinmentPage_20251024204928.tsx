import { useState } from "react";
import { Table, Button, Input, DatePicker, Select, Pagination, Space, Card, message, Modal } from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    FileExcelOutlined,
    FilterOutlined,
    ScheduleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CheckCircleTwoTone,
    CloseCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";
import EditAppointment from "../components/ApoinmentForm";
import { useAppointments } from "../../../shared/services/appointmentApi";

import OrderPage from "./OrderPage";


const { RangePicker } = DatePicker;
const { Option } = Select;



const AppointmentManager = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPaymentRecord, setSelectedPaymentRecord] = useState<any>(null);
    const { data, refetch } = useAppointments(page, limit);
    const handlePayment = (record: any) => {
        // Điều hướng sang trang thanh toán, giữ nguyên record
        setSelectedPaymentRecord(record);
        setIsPaymentModalOpen(true);
    };

    console.log("Appointments data:", data);
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên khách hàng", dataIndex: "contactName", key: "contactName", render: (contactName: string) => {
            return <span className="font-semibold text-red-400">{contactName}</span>;
        }},
        {
            title: "Dịch vụ", dataIndex: "serviceName", key: "serviceName"
            , render: (serviceName: string) => {
                return <span className="font-semibold ">{serviceName}</span>;
            }
        },
        {
            title: "Nhân viên", dataIndex: "staffName", key: "staffName", render: (staffName: string) => {
                return <span className="font-semibold ">{staffName}</span>;
            }
        },
        {
            title: "Phòng", dataIndex: "roomName", key: "roomName", render: (roomName: string) => {
                return <span className="font-semibold ">{roomName}</span>;
            }
        },
        {
            title: "Trạng thái", dataIndex: "status", key: "status"
            , render: (status: string) => {
                let color = "gray";
                switch (status) {
                    case "Confirmed":
                        color = "green";
                        break;
                    case "Pending":
                        color = "orange";
                        break;
                    case "Completed":
                        color = "#52c41a";
                        break;
                    case "Cancelled":
                        color = "red";
                        break;
                }
                return <span style={{ color }}>{status}</span>;
            }
        },
        { title: "Thời gian bắt đầu", dataIndex: "startAt", key: "startAt" },
        { title: "Thời gian kết thúc", dataIndex: "endAt", key: "endAt" },
        { title: "Ghi chú", dataIndex: "notes", key: "notes" },
        {
            title: "Hành động",
            key: "action",

            render: (_: any, record: any) => (
                <Space>
                    {record.status !== "Completed" && record.status !== "Cancelled" ? (
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    ) : null}

                    {/* 🗑️ Nút Xóa (nếu cần) */}
                    <Button type="link" icon={<DeleteOutlined />} />

                    {/* 💰 Nút Thanh toán */}
                    {record.status === "Completed" && (
                        record.invoiceStatus === "PAID" ? (
                            <Button
                                type="default"
                                icon={<CheckCircleOutlined style={{ color: "white" }} />}
                                disabled
                                className="!bg-green-400"
                            >
                                <p className="text-white">Đã thanh toán</p>
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<DollarCircleOutlined />}
                                onClick={() => handlePayment(record)}
                            >
                                Thanh toán
                            </Button>
                        )

                    )}
                    {record.status === "Cancelled" && (
                        <Button
                            type="default"
                            disabled
                            icon={<CloseCircleOutlined style={{ color: "red" }} />}
                        >
                            <span style={{ color: "red" }}>Đã hủy</span>
                        </Button>
                    )}
                </Space>
            ),

        },

    ];


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleEdit = (record: any) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };



    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl">24</p>
                    <div className="flex flex-col items-center justify-center">
                        <ScheduleOutlined className="!text-blue-500 text-lg" />
                        <p>Lịch hẹn hôm nay</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-green-600">18</p>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircleOutlined className="!text-green-500 text-lg" />
                        <p>Đã xác nhận</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-yellow-600">4</p>
                    <div className="flex flex-col items-center justify-center">
                        <ClockCircleOutlined className="!text-yellow-500 text-lg" />
                        <p>Đang chờ</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-blue-600">15</p>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircleTwoTone twoToneColor="#52c41a" className="text-lg" />
                        <p>Hoàn thành</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-red-600">8%</p>
                    <div className="flex flex-col items-center justify-center">
                        <CloseCircleOutlined className="!text-red-500 text-lg" />
                        <p>Tỷ lệ hủy</p>
                    </div>
                </Card>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between mb-4">
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm lịch hẹn mới
                </Button>
                <Space>
                    <Button icon={<FileExcelOutlined />} className="bg-green-500 text-white">
                        Xuất báo cáo
                    </Button>
                    <Button icon={<FilterOutlined />}>Lọc dữ liệu</Button>
                </Space>
            </div>

            <div className="flex gap-4 mb-4">
                <Input placeholder="Tìm theo tên, số ĐT hoặc ID..." prefix={<SearchOutlined />} />
                <Select defaultValue="Tất cả trạng thái" style={{ width: 180 }}>
                    <Option value="all">Tất cả trạng thái</Option>
                    <Option value="Confirmed">Đã xác nhận</Option>
                    <Option value="Pending">Đang chờ</Option>
                </Select>
                <RangePicker />
                <Button type="primary">Áp dụng</Button>
                <Button>Xóa bộ lọc</Button>
            </div>

            <Table columns={columns}
                dataSource={data?.content || []}
                rowKey="id" pagination={false} bordered />

            <div className="mt-4 flex justify-end">
                <Pagination
                    current={page}
                    total={data?.totalElements || 0}
                    pageSize={limit}
                    onChange={(newPage) => setPage(newPage)}
                    showSizeChanger={false}
                />

            </div>

            <Modal
                title={`Chỉnh sửa lịch hẹn #${selectedRecord?.id}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
            >
                {selectedRecord && (
                    <EditAppointment
                        id={selectedRecord.id}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
            <Modal
                title={`Thanh toán - ${selectedPaymentRecord?.contactName || ""}`}
                open={isPaymentModalOpen}
                onCancel={() => setIsPaymentModalOpen(false)}
                footer={null}
                width={1000}
            >

                {selectedPaymentRecord && <OrderPage
                    orderData={selectedPaymentRecord}
                    onPaymentSuccess={() => {
                        setIsPaymentModalOpen(false); // ✅ Đóng modal
                        refetch();

                    }} />}
            </Modal>


        </div>


    );
};

export default AppointmentManager;
