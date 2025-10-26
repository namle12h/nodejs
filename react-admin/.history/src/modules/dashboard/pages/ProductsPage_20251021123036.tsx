import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
  type PopconfirmProps,
  type TableProps,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import {
  useProducts,
  useCreateProduct,
} from "../../../shared/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../shared/lib/axiosClient";

interface DataType {
  id: number;
  name: string;
  sku?: string;
  uom?: string;
  category?: string;
  brand?: string;
  description?: string;
  costPrice?: number;
  salePrice: number;
  stockQty: number;
  reorderLevel?: number;
  expDate?: string;
  active: boolean;
  createdBy: number;
  updatedBy: number;
  imageUrl?: string | null;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [searchParams] = useSearchParams();

  // ✅ Lấy page và limit an toàn
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // ✅ Nếu URL chưa có page hoặc limit thì thêm mặc định
  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      navigate(`/dashboard/products?page=1&limit=10`, { replace: true });
    }
  }, [searchParams, navigate]);

  const queryClient = useQueryClient();

  // ✅ Gọi API danh sách sản phẩm
  const { data: products, isLoading } = useProducts(page, limit);

  // ✅ Đảm bảo dữ liệu Table luôn là mảng
  const productList = products?.content ?? [];
  const total = products?.totalElements ?? 0;

  // ✅ Thêm sản phẩm
  const mutationAdd = useCreateProduct();

  // ✅ Cập nhật sản phẩm
  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      axiosClient.put(`/products/${id}`, data),
    onSuccess: () => {
      message.success("🎉 Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setEditingProduct(null);
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "❌ Cập nhật thất bại!");
    },
  });

  // ✅ Xóa sản phẩm
  const mutationDelete = useMutation({
    mutationFn: (id: number) => axiosClient.delete(`/products/${id}`),
    onSuccess: () => {
      message.success("🗑️ Đã xóa sản phẩm!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => message.error("❌ Không thể xóa sản phẩm!"),
  });

  // ========================= HANDLERS =========================

  const handleAdd = () => {
    form.resetFields();
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    form.resetFields();
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      mutationUpdate.mutate({ id: editingProduct.id, data: values });
    } else {
      mutationAdd.mutate(values);
    }
  };

  const handleConfirm =
    (id: number): PopconfirmProps["onConfirm"] =>
    async () => {
      mutationDelete.mutate(id);
    };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  // ========================= TABLE COLUMNS =========================

  const columns: TableProps<DataType>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.brand ? `${record.brand} • ` : ""}
            {record.category ?? ""}
          </div>
        </div>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl, record) =>
        imageUrl ? (
          <Image
            src={imageUrl}
            alt={record.name}
            width={64}
            height={64}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              borderRadius: 8,
            }}
          >
            No
          </div>
        ),
    },
    {
      title: "Giá Nhập",
      dataIndex: "costPrice",
      key: "costPrice",
      align: "right",
      render: (price) => <b>{formatCurrency(price ?? 0)}</b>,
    },
    {
      title: "Giá bán",
      dataIndex: "salePrice",
      key: "salePrice",
      align: "right",
      render: (price) => <b>{formatCurrency(price ?? 0)}</b>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQty",
      key: "stockQty",
      align: "center",
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expDate",
      key: "expDate",
      render: (date: string | null) => {
        if (!date) return <span style={{ color: "#999" }}>Chưa có</span>;
        const formatted = new Date(date).toLocaleDateString("vi-VN");
        return <span>{formatted}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            onConfirm={handleConfirm(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ========================= RENDER =========================

  return (
    <Card
      title="📦 Danh sách sản phẩm"
      extra={
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      }
    >
      <Table<DataType>
        columns={columns}
        dataSource={productList}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        bordered
      />

      <Pagination
        style={{ marginTop: 16, textAlign: "right" }}
        current={page}
        pageSize={limit}
        total={total}
        showSizeChanger
        onChange={(newPage, newLimit) =>
          navigate(`/dashboard/products?page=${newPage}&limit=${newLimit}`)
        }
      />

      <Modal
        title={editingProduct ? "✏️ Cập nhật sản phẩm" : "➕ Thêm sản phẩm"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <ProductForm
          initialValues={editingProduct ?? {}}
          onSubmit={handleSubmit}
          loading={mutationAdd.isPending || mutationUpdate.isPending}
        />
      </Modal>
    </Card>
  );
}
