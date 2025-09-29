import { EditOutlined, DeleteOutlined, PlusOutlined, FolderAddTwoTone } from "@ant-design/icons";
import {
    Button,
    Card,
    message,
    Popconfirm,
    Space,
    Table,
    Tag,
    type TableProps,
    type PopconfirmProps,
    Modal,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../shared/lib/axiosClient";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import ServiceForm from "../components/ServiceForm";
import { Title } from "react-head";

interface DataType {
    id: number;
    name: string;
    price: number;
    durationMin: number;
    active: boolean;
    description: string;
    imageUrl: string;
}

export default function ServicePage() {


    // query params cho phân trang
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<DataType | null>(null);

    // ================= Fetch services =================
    const fetchServices = async ({ queryKey }: any) => {
        const [_key, page = 1, limit = 5] = queryKey;
        const response = await axiosClient.get(`/services`, {
            params: { page, limit },
        });

        console.log("<<==>> raw services", response.data);

        // nếu backend trả mảng trực tiếp
        if (Array.isArray(response.data)) {
            return response.data;
        }

        // nếu backend bọc trong { data: [...] }
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    };



    const KEYs = {
        getServices: () => ["services", page, limit] as const,
    };

    const queryServices = useQuery({
        queryKey: KEYs.getServices(),
        queryFn: fetchServices,
    });

    console.log("Query result", queryServices.data, queryServices.isLoading, queryServices.error);

    const queryClient = useQueryClient();

    // ================= Delete service =================
    const deleteService = async (id: number) => {
        const response = await axiosClient.delete(`/services/${id}`);
        return response.data;
    };

    const mutationDelete = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            message.success("Deleted successfully");
            queryClient.invalidateQueries({ queryKey: KEYs.getServices() });
        },
        onError: (err) => {
            console.error("Error deleting service", err);
            message.error("Failed to delete service");
        },
    });

    const handleConfirm = (id: number): PopconfirmProps["onConfirm"] => async () => {
        mutationDelete.mutate(id);
    };

    const cancel: PopconfirmProps["onCancel"] = () => {
        message.error("Click on No");
    };

    const mutationCreate = useMutation({
        mutationFn: async (formData: FormData) => {
            return await axiosClient.post("/services/with-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            message.success("Service created successfully");
            queryClient.invalidateQueries({ queryKey: KEYs.getServices() });
            setIsModalOpen(false);
        },
        onError: () => {
            message.error("Failed to create service");
        },
    });
    const mutationUpdate = useMutation({
        mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
            return await axiosClient.put(`/services/${id}/with-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            message.success("Service updated successfully");
            queryClient.invalidateQueries({ queryKey: KEYs.getServices() });
            setEditingService(null);
        },
        onError: () => {
            message.error("Failed to update service");
        },
    });


    // ================= Table columns =================
    const columns: TableProps<DataType>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url: string) =>
                url ? (
                    <img
                        src={url}
                        alt="service"
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                    />
                ) : (
                    <span>No Image</span>
                ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Price (VNĐ)",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (value: number) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(value),
        },
        {
            title: "Duration (phút)",
            dataIndex: "durationMin",
            key: "durationMin",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "active", // ✅ BE trả về "active"
            key: "status",
            render: (active: boolean) =>
                active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        // onClick={() => setEditingService(record)}
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem("user") || "{}");
                            if (user?.role === "ADMIN") {
                                setEditingService(record);
                            } else {
                                message.error("Bạn không có quyền");
                            }
                        }}
                    />
                    <Popconfirm
                        title="Delete the Service"
                        description="Are you sure to delete this Service?"
                        onConfirm={handleConfirm(record.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm >


                    <Button icon={<FolderAddTwoTone />} className="!border-blue-600" />
                </Space>
            ),
        },
    ];

    // ================= Render =================
    return (

        <Card



            title="Service List"
            extra={
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    // onClick={() => setIsModalOpen(true)}
                    onClick={() => {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        if (user?.role === "ADMIN") {
                            setIsModalOpen(true);
                        } else {
                            message.error("chỉ admin mới được thêm dịch vụ");
                        }
                    }}
                >
                    Thêm mới dịch vụ
                </Button>
            }
        >
            <Table<DataType>
                columns={columns}
                dataSource={queryServices.data ?? []}
                rowKey="id"
                pagination={false}
                loading={queryServices.isLoading}
            />
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title="Thêm mới dịch vụ"
            >
                <ServiceForm
                    onSubmit={(values) => mutationCreate.mutate(values)}
                    loading={mutationCreate.isPending}
                />
            </Modal>

            <Modal
                open={!!editingService}
                onCancel={() => setEditingService(null)}
                footer={null}
                title="Cập nhật dịch vụ"
            >
                <ServiceForm
                    initialValues={editingService}
                    onSubmit={(values) => {
                        if (editingService) {
                            mutationUpdate.mutate({ id: editingService.id, formData: values });
                        }
                    }}
                    loading={mutationUpdate.isPending}
                />
            </Modal>
            <Title>Service | My Website</Title>

        </Card>
    );
}
