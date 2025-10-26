// import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Button, Select, Switch, Upload } from "antd";
import { useEffect } from "react";

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  loading?: boolean;
  categories?: { category_id: number; category_name: string }[];
  brands?: { brand_id: number; brand_name: string }[];
}

export default function ProductForm({
  initialValues,
  onSubmit,
  loading,
  categories = [],
  brands = [],
}: ProductFormProps) {
  const [form] = Form.useForm();

  // Đồng bộ initialValues khi Edit / Add
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        discount: 0,
        stock: 0,
        isFeatured: false,
        isActive: true,
        ...initialValues,
      }}
    >
      <Form.Item
        name="product_name"
        label="Product Name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="thumbnail" label="Thumbnail">
        <Upload
          action="http://localhost:8080/api/v1/products/upload"
          listType="picture-card"
          maxCount={1}
          name="image"
          onChange={(info) => {
            if (info.file.status === "done") {
              form.setFieldsValue({ thumbnail: info.file.response.url });
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter price" }]}
      >
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item
        name="discount"
        label="Discount"
        rules={[{ type: "number", min: 0, max: 1000000, message: "Discount must be 0–1,000,000" }]}
      >
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>

      <Form.Item
        name="stock"
        label="Stock"
        rules={[{ required: true, type: "number", min: 0, message: "Stock must be >= 0" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="category_id"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select placeholder="Select category" loading={!categories.length}>
          {categories.map((c) => (
            <Select.Option key={c.category_id} value={c.category_id}>
              {c.category_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="brand_id"
        label="Brand"
        rules={[{ required: true, message: "Please select a brand" }]}
      >
        <Select placeholder="Select brand" loading={!brands.length}>
          {brands.map((b) => (
            <Select.Option key={b.brand_id} value={b.brand_id}>
              {b.brand_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item name="sku" label="SKU">
        <Input />
      </Form.Item>

      <Form.Item name="barcode" label="Barcode">
        <Input />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="isActive" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
}