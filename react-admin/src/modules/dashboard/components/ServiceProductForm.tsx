
import { Card, Form, Select, InputNumber, Input, Button, Table, message, Empty } from "antd";
import { useProducts } from "../../../shared/services/productApi";
import { useAddServiceProduct, useServiceProducts } from "../../../shared/services/productApi";

interface ServiceProductFormProps {
  serviceId: number;
}

export default function ServiceProductForm({ serviceId }: ServiceProductFormProps) {
  const [form] = Form.useForm();
  const { data: products, isLoading } = useProducts();
  const { data: serviceProducts, isFetching } = useServiceProducts(serviceId);
  const { mutate: addServiceProduct } = useAddServiceProduct();

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

  // Danh sách cột trong bảng
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Thương hiệu", dataIndex: "brand", key: "brand" },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" as const },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];

  return (
    <Card
      title={<span className="font-semibold text-lg">🧴 Thêm Sản Phẩm Sử Dụng Cho Dịch Vụ</span>}
      className="shadow-sm border border-gray-100 mb-8"
    >
      {/* Form thêm sản phẩm */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Chọn sản phẩm */}
        <Form.Item
          name="productId"
          label="Chọn sản phẩm"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            placeholder="Chọn sản phẩm trong kho"
            loading={isLoading}
            options={
              products?.map((p: any) => ({
                value: p.id,
                label: `${p.name} (${p.brand || "Không thương hiệu"}) - ${p.salePrice?.toLocaleString()}₫`,
              })) || []
            }
          />
        </Form.Item>

        {/* Số lượng */}
        <Form.Item
          name="quantity"
          label="Số lượng sử dụng"
          rules={[{ required: true, message: "Nhập số lượng" }]}
        >
          <InputNumber min={1} step={1} className="w-full" />
        </Form.Item>

        {/* Ghi chú */}
        <Form.Item name="note" label="Ghi chú (tùy chọn)" className="md:col-span-2">
          <Input.TextArea
            rows={2}
            placeholder="VD: Dùng cho bước massage hoặc đắp mặt nạ..."
          />
        </Form.Item>

        <div className="md:col-span-2 flex justify-end mt-4">
          <Button type="primary" htmlType="submit" className="bg-blue-600">
            💾 Thêm sản phẩm
          </Button>
        </div>
      </Form>

      {/* Danh sách sản phẩm đã thêm */}
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
