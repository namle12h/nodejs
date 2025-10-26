import { useState } from "react";
import { Table, Button, Input, DatePicker, Select, Pagination, Space, Card, message, Modal } from "antd";
import {
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
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
        {
            title: "Tên khách hàng", dataIndex: "contactName", key: "contactName", render: (contactName: string) => {
                return <span className="font-semibold text-orange-500">{contactName}</span>;
            }
        },
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
                        color = "purple";
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
        {
            title: "Thời gian bắt đầu", dataIndex: "startAt", key: "startAt",
            render: (val: string) => dayjs(val).format("HH:mm DD/MM/YYYY"),
        },
        {
            title: "Thời gian kết thúc", dataIndex: "endAt", key: "endAt",
            render: (val: string) => dayjs(val).format("HH:mm DD/MM/YYYY"),
        },
        { title: "Ghi chú", dataIndex: "notes", key: "notes" },
        {
            title: "Hành động",
            key: "action",

            render: (_: any, record: any) => (
                <Space>
                    {record.status !== "PAID" && record.status !== "Cancelled" ? (
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    ) : null}

                    {/* 🗑️ Nút Xóa (nếu cần) */}
                    <Button type="link" icon={<DeleteOutlined />} />

                    {/* 💰 Nút Thanh toán */}
                    {
                        // 🔹 Đơn đã hoàn thành nhưng chưa thanh toán
                        record.status === "Completed" ? (
                            <Button
                                type="primary"
                                icon={<DollarCircleOutlined />}
                                onClick={() => handlePayment(record)}
                            >
                                Thanh toán
                            </Button>
                        )
                            // 🔹 Đơn đã thanh toán
                            : record.status === "PAID" ? (
                                <Button
                                    type="default"
                                    icon={<CheckCircleOutlined style={{ color: "white" }} />}
                                    disabled
                                    className="!bg-green-400"
                                >
                                    <p className="text-white">Đã thanh toán</p>
                                </Button>
                            )
                                // 🔹 Đơn đã hủy
                                : record.status === "Cancelled" ? (
                                    <Button
                                        type="default"
                                        disabled
                                        icon={<CloseCircleOutlined style={{ color: "red" }} />}
                                    >
                                        <span style={{ color: "red" }}>Đã hủy</span>
                                    </Button>
                                )
                                    // 🔹 Các trạng thái khác (Confirmed, Pending, v.v.)
                                    : null
                    }

                </Space>
            ),

        },

    ];


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const appointments = Array.isArray(data?.content) ? data.content : [];

    const [dateRange, setDateRange] = useState<[any, any] | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [staffFilter, setStaffFilter] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    const handleEdit = (record: any) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    // ----------------------
    // Tính toán thống kê
    // ----------------------
    const today = dayjs().format("YYYY-MM-DD");

    // ✅ chỉ tính hôm nay (dựa trên dữ liệu trang hiện tại)
    const todayAppointments = appointments.filter((a: any) =>
        dayjs(a.startAt).format("YYYY-MM-DD") === today
    ).length;

    // ✅ lấy tổng toàn bộ từ API
    const total = data?.totalElements || 0;

    // ⚠️ các thống kê khác chỉ đúng nếu API trả về tổng theo status
    // Nếu không, bạn cần tính chúng từ backend hoặc fetch all pages (xem cách 2)
    const completed = appointments.filter((a: any) => a.status === "Completed").length;
    const cancelled = appointments.filter((a: any) => a.status === "Cancelled").length;
    const confirmed = appointments.filter((a: any) => a.status === "Confirmed").length;
    const pending = appointments.filter((a: any) => a.status === "Pending").length;

    // ✅ tạm thời giữ nguyên tính tỷ lệ (trên total toàn bộ)
    const cancelRate = total ? ((cancelled / total) * 100).toFixed(1) : 0;



    // ----------------------
    // Áp dụng lọc cho bảng
    // ----------------------
    const filteredData = appointments.filter((a: any) => {
        // Lọc theo ngày
        const inDateRange =
            !dateRange ||
            (dayjs(a.startAt).isSameOrAfter(dateRange[0], "day") &&
                dayjs(a.startAt).isSameOrBefore(dateRange[1], "day"));


        // Lọc theo trạng thái
        const matchStatus = !statusFilter || a.status === statusFilter;

        // Lọc theo nhân viên
        const matchStaff =
            !staffFilter ||
            a.staffName?.toLowerCase().includes(staffFilter.toLowerCase());

        // Lọc theo tên khách hàng
        const matchSearch =
            !searchText ||
            a.contactName?.toLowerCase().includes(searchText.toLowerCase());

        return inDateRange && matchStatus && matchStaff && matchSearch;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Stats */}
            <div className="grid grid-cols-6 gap-4 mb-6">
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl">{total}</p>
                    <div className="flex flex-col items-center justify-center">
                        <ScheduleOutlined className="!text-blue-500 text-lg" />
                        <p>Tất cả lịch hẹn</p>
                    </div>
                </Card>
                <Card
                    className="text-center shadow rounded-2xl cursor-pointer hover:shadow-lg transition"
                    onClick={() => {
                        const today = dayjs();
                        setDateRange([today.startOf("day"), today.endOf("day")]);
                    }}
                >
                    <p className="font-bold text-xl">{todayAppointments}</p>
                    <div className="flex flex-col items-center justify-center">
                        <ScheduleOutlined className="!text-blue-500 text-lg" />
                        <p>Lịch hẹn hôm nay</p>
                    </div>
                </Card>

                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-green-600">{confirmed}</p>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircleOutlined className="!text-green-500 text-lg" />
                        <p>Đã xác nhận</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-yellow-600">{pending}</p>
                    <div className="flex flex-col items-center justify-center">
                        <ClockCircleOutlined className="!text-yellow-500 text-lg" />
                        <p>Đang chờ</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-blue-600">{completed}</p>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircleTwoTone twoToneColor="#52c41a" className="text-lg" />
                        <p>Hoàn thành</p>
                    </div>
                </Card>
                <Card className="text-center shadow rounded-2xl">
                    <p className="font-bold text-xl text-red-600">{cancelRate}%</p>
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

            <Card className="mb-4 shadow rounded-2xl">
                <div className="flex flex-wrap gap-3 items-center">
                    <RangePicker onChange={(values) => setDateRange(values)} />

                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        style={{ width: 150 }}
                        onChange={(val) => setStatusFilter(val)}
                    >
                        <Option value="Pending">Đang chờ</Option>
                        <Option value="Confirmed">Đã xác nhận</Option>
                        <Option value="Completed">Hoàn thành</Option>
                        <Option value="Cancelled">Đã hủy</Option>
                    </Select>

                    <Input
                        placeholder="Tìm theo nhân viên..."
                        style={{ width: 200 }}
                        onChange={(e) => setStaffFilter(e.target.value)}
                    />

                    <Input
                        placeholder="Tìm khách hàng..."
                        style={{ width: 200 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </Card>

            <Table columns={columns}
                // dataSource={data?.content || []}
                dataSource={filteredData}
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
