import {
  Card,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAddServiceSectionItem } from "../../../shared/services/serviceApi";

const { TextArea } = Input;

interface ImportantNotesFormProps {
  serviceId: number;
}

export default function ImportantNotesForm({ serviceId }: ImportantNotesFormProps) {
  const [form] = Form.useForm();
  const { mutate: addSectionItem } = useAddServiceSectionItem();

  const phases = [
    { key: "before", label: "Trước Liệu Trình", color: "blue", icon: "🕓" },
    { key: "during", label: "Trong Quá Trình", color: "green", icon: "😊" },
    { key: "after", label: "Sau Liệu Trình", color: "pink", icon: "💖" },
  ];

  // ✅ Gửi dữ liệu
  const handleSubmit = (values: any) => {
    const payload = {
      title: "Lưu Ý Quan Trọng",
      description: values.noteDescription,
      extraData: JSON.stringify({
        before: values.before?.map((n: any) => n.text) || [],
        during: values.during?.map((n: any) => n.text) || [],
        after: values.after?.map((n: any) => n.text) || [],
      }),
    };

    addSectionItem(
      {
        serviceId,
        type: "note",
        data: payload,
      },
      {
        onSuccess: (res: any) => {
          console.log("✅ API success:", res);
          message.success("✅ Đã lưu lưu ý thành công!");
          form.resetFields();
        },
        onError: (err: any) => {
          console.error("🔥 API error:", err);
          message.error(err?.response?.data?.message || "❌ Lỗi khi lưu lưu ý!");
        },
      }
    );
  };

  return (
    <Card
      title={
        <span className="font-semibold text-gray-700 text-lg">
          ⚠️ Lưu Ý Quan Trọng
        </span>
      }
      className="shadow-sm border border-gray-100"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          before: [],
          during: [],
          after: [],
        }}
        className="grid grid-cols-1 gap-6"
      >
        {/* Mô tả ngắn */}
        <Form.Item
          name="noteDescription"
          label="Mô tả ngắn"
          rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
        >
          <TextArea
            rows={3}
            placeholder="VD: Những điều cần biết để có trải nghiệm tốt nhất và đạt hiệu quả cao nhất"
          />
        </Form.Item>

        {/* Các nhóm lưu ý */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <Card
              key={phase.key}
              className="border border-gray-100 shadow-sm"
              title={
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span
                    className={`inline-flex justify-center items-center w-8 h-8 rounded-full bg-${phase.color}-100 text-${phase.color}-600 text-lg`}
                  >
                    {phase.icon}
                  </span>
                  {phase.label}
                </div>
              }
            >
              <Form.List name={phase.key}>
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 mb-2 bg-gray-50 px-2 py-1 rounded-md"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "text"]}
                          className="flex-1 mb-0"
                          rules={[{ required: true, message: "Nhập nội dung lưu ý" }]}
                        >
                          <Input placeholder="Nhập nội dung lưu ý..." />
                        </Form.Item>
                        <Button
                          type="text"
                          danger
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                        />
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add({ text: "" })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm lưu ý
                    </Button>
                  </div>
                )}
              </Form.List>
            </Card>
          ))}
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit" className="bg-blue-600">
            💾 Lưu Lưu Ý
          </Button>
        </div>
      </Form>
    </Card>
  );
}
