

import {
  Card,
  Form,
  Select,
  InputNumber,
  Input,
  Button,
  Table,
  message,
  Empty,
  Popconfirm,
  Space,
  Image,
} from "antd";
import {
  useProducts,
  useAddServiceProduct,
  useServiceProducts,
  useDeleteServiceProduct,
} from "../../../shared/services/productApi";

interface ServiceProductFormProps {
  serviceId: number;
}

export default function ServiceProductForm({ serviceId }: ServiceProductFormProps) {
  const [form] = Form.useForm();

  // 🧩 Fetch data
const { data, isLoading } = useProducts(1, 10);
const products = data?.data || data || [];

  const { data: serviceProducts, isFetching } = useServiceProducts(serviceId);
  const { mutate: addServiceProduct } = useAddServiceProduct();
  const { mutate: deleteServiceProduct } = useDeleteServiceProduct();

  // 🧩 Submit form thêm sản phẩm
  const handleSubmit = (values: any) => {
    addServiceProduct(
      {
        serviceId,
        productId: values.productId,
        quantity: values.quantity || 1,
        note: values.note || "",
      },
      {
        onSuccess: () => {
          message.success("✅ Đã thêm sản phẩm sử dụng cho dịch vụ!");
          form.resetFields();
        },
        onError: (err: any) => {
          message.error(err?.response?.data?.message || "❌ Lỗi khi thêm sản phẩm!");
        },
      }
    );
  };

  // 🧩 Xóa sản phẩm khỏi danh sách
  const handleDelete = (id: number) => {
    deleteServiceProduct(
      { serviceId, id },
      {
        onSuccess: () => message.success("🗑️ Đã xóa sản phẩm khỏi dịch vụ!"),
        onError: () => message.error("❌ Lỗi khi xóa sản phẩm!"),
      }
    );
  };

  // 🧾 Cột hiển thị trong bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center" as const,
      width: 80,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="product"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              background: "#f5f5f5",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
            }}
          >
            N/A
          </div>
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (text: string) => text || "—",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text: string) => text || "—",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text: string) => text || "—",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="Xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span className="font-semibold text-lg">🧴 Thêm Sản Phẩm Sử Dụng Cho Dịch Vụ</span>}
      className="shadow-sm border border-gray-100 mb-8"
    >
      {/* 🧾 Form thêm sản phẩm */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* ✅ Chọn sản phẩm */}
        <Form.Item
          name="productId"
          label="Chọn sản phẩm"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
  placeholder="Chọn sản phẩm trong kho"
  loading={isLoading}
  options={
    products.map((p: any) => ({
      value: p.id,
      label: `${p.name} (${p.brand || "Không thương hiệu"}) - ${p.salePrice?.toLocaleString()}₫`,
    }))
  }
  showSearch
  filterOption={(input, option) =>
    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
  }
/>

        </Form.Item>

        {/* ✅ Số lượng */}
        <Form.Item
          name="quantity"
          label="Số lượng sử dụng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber min={1} step={1} className="w-full" />
        </Form.Item>

        {/* ✅ Ghi chú */}
        <Form.Item name="note" label="Ghi chú (tùy chọn)" className="md:col-span-2">
          <Input.TextArea rows={2} placeholder="VD: Dùng cho bước massage hoặc đắp mặt nạ..." />
        </Form.Item>

        <div className="md:col-span-2 flex justify-end mt-4">
          <Button type="primary" htmlType="submit" className="bg-blue-600">
            💾 Thêm sản phẩm
          </Button>
        </div>
      </Form>

      {/* 🧾 Danh sách sản phẩm */}
      <div className="mt-8">
        <h3 className="font-semibold text-base mb-3">Danh Sách Sản Phẩm Sử Dụng</h3>

        {serviceProducts && serviceProducts.length > 0 ? (
          <Table
            loading={isFetching}
            dataSource={serviceProducts}
            columns={columns}
            rowKey="id"
            pagination={false}
            bordered
          />
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Empty description="Chưa có sản phẩm nào được thêm." />
          </div>
        )}
      </div>
    </Card>
  );
}
