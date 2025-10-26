import {
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Upload,
  Card,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
}

export default function ProductForm({
  initialValues,
  onSubmit,
  loading,
}: ProductFormProps) {
  const [form] = Form.useForm();

  // ✅ Xử lý khi load dữ liệu từ backend (convert expDate -> dayjs)
  useEffect(() => {
    if (initialValues) {
      const fileList = initialValues.imageUrl
        ? [
          {
            uid: "-1",
            name: "current-image.jpg",
            status: "done",
            url: initialValues.imageUrl,
          },
        ]
        : [];
      const expDate = initialValues.expDate
        ? dayjs(initialValues.expDate, ["YYYY-MM-DD", "DD/MM/YYYY", "YYYY/MM/DD"], true)
        : null;


      form.setFieldsValue({
        ...initialValues,
        expDate: expDate?.isValid() ? expDate : null,
        file: fileList,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  // ✅ Gửi form
  const handleFinish = (values: any) => {
    const formData = new FormData();

    const productData = {
      name: values.name,
      sku: values.sku,
      description: values.description,
      salePrice: values.salePrice || 0,
      costPrice: values.costPrice || 0,
      stockQty: values.stockQty || 0,
      reorderLevel: values.reorderLevel || 0,
      expDate: values.expDate ? values.expDate.format("YYYY-MM-DD") : null, // ✅ convert đúng kiểu
      uom: "Chai",
      active: values.active ?? true,
    };

    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    // ✅ chỉ gửi file khi có
    if (values.file && values.file.length > 0) {
      formData.append("image", values.file[0].originFileObj);
    }

    onSubmit(formData);
  };

  return (
    <Card
      title={initialValues ? "✏️ Cập nhật sản phẩm" : "🆕 Thêm sản phẩm mới"}
      variant="borderless"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Form
        key={initialValues?.id || "new"}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ active: true, ...initialValues }}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="sku" label="SKU">
          <Input />
        </Form.Item>

        <Form.Item
          name="salePrice"
          label="Giá bán (VNĐ)"
          rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="costPrice" label="Giá vốn (VNĐ)">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="expDate"
          label="Hạn Sử Dụng"
          rules={[]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            placeholder="Chọn hạn sử dụng"
          />
        </Form.Item>

        <Form.Item
          name="stockQty"
          label="Tồn kho"
          rules={[{ required: true, message: "Vui lòng nhập số lượng tồn" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả sản phẩm">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* ✅ Upload ảnh đúng format AntD */}
        <Form.Item
          name="file"
          label="Ảnh sản phẩm"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="active" label="Kích hoạt" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            💾 Lưu sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
