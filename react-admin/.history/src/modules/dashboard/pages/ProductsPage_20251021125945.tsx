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
import { useProducts, useCreateProduct } from "../../../shared/services/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../shared/lib/axiosClient";

interface DataType {
  id: number;
  name: string;
  salePrice: number;
  stockQty: number;
  active: boolean;
  costPrice?: number;
  imageUrl?: string | null;
  expDate?: string;
  category?: string;
  brand?: string;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [forceRender, setForceRender] = useState(false); // ✅ ép render lại

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const queryClient = useQueryClient();
  const { data: products, isLoading } = useProducts(page, limit);
  const productList = products?.content ?? [];
  const total = products?.totalElements ?? 0;

  // ✅ refetch mỗi khi page/limit thay đổi
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products", page, limit] });
    window.scrollTo({ top: 0 });
  }, [page, limit, queryClient]);

  const mutationAdd = useCreateProduct();
  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      axiosClient.put(`/products/${id}`, data),
    onSuccess: () => {
      message.success("Cập nhật thành công 🎉");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      form.resetFields();
    },
  });
  const mutationDelete = useMutation({
    mutationFn: (id: number) => axiosClient.delete(`/products/${id}`),
    onSuccess: () => {
      message.success("Đã xóa 🗑️");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleConfirm =
    (id: number): PopconfirmProps["onConfirm"] =>
    async () => {
      mutationDelete.mutate(id);
    };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      mutationUpdate.mutate({ id: editingProduct.id, data: values });
    } else {
      mutationAdd.mutate(values);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

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
          <Image src={imageUrl} alt={record.name} width={64} height={64} />
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
      render: (price) => <b>{formatCurrency(price)}</b>,
    },
    {
      title: "Giá bán",
      dataIndex: "salePrice",
      key: "salePrice",
      align: "right",
      render: (price) => <b>{formatCurrency(price)}</b>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQty",
      key: "stockQty",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            onConfirm={handleConfirm(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách sản phẩm"
      extra={
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm sản phẩm
        </Button>
      }
    >
      <Table<DataType>
        key={page} // ✅ ép re-render mỗi khi đổi trang
        columns={columns}
        dataSource={productList}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Pagination
        key={forceRender ? "force" : "normal"} // ✅ ép Pagination render lại
        current={page}
        pageSize={limit}
        total={total}
        onChange={(newPage, newLimit) => {
          setSearchParams({ page: String(newPage), limit: String(newLimit) });
          setForceRender((prev) => !prev); // ✅ ép render lại Pagination
        }}
      />

      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
