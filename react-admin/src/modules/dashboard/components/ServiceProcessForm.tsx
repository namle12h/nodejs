import  { useState } from "react";
import {
  Input,
  Button,
  Card,
  Form,
  List,
  Typography,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAddServiceSectionItem } from "../../../shared/services/serviceApi"
import { useParams } from "react-router-dom";
import ServiceBenefitForm from "./benefit";
import ImportantNotesForm from "./ImportantNotesForm";
import ServiceProductForm from "./ServiceProductForm";


const { TextArea } = Input;
const { Title } = Typography;

interface StepItem {
  title: string;
  icon?: string;
  times?: string;
  description?: string;
  image?: string;
}

interface ServiceProcessFormProps {
  serviceId: number;
}

export default function ServiceProcessForm({ serviceId }: ServiceProcessFormProps) {
  const [form] = Form.useForm();
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const { id } = useParams<{ id: string }>(); // Lấy id service từ URL
  const { mutate: addSectionItem, isPending } = useAddServiceSectionItem();

  // ✅ Thêm state lưu tab hiện tại
  const [activeTab, setActiveTab] = useState<"quytrinh" | "loiich" | "sanpham" | "luuy" | "danhgia">("quytrinh");

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleAddStep = (values: StepItem) => {
    // const newStep = { ...values, image: imageBase64 };

    const newStep: StepItem = {
      title: values.title,
      times: values.times, // ✅ có từ form rồi
      description: values.description,
      image: imageBase64,
      icon: "🕒", // hoặc bất kỳ biểu tượng bạn muốn
    };

    addSectionItem(
      {
        serviceId: Number(serviceId),
        type: "step", // gửi type tương ứng
        data: newStep,

      },
      {
        onSuccess: () => {
          message.success("✅ Đã thêm bước vào quy trình!");
          setSteps([...steps, newStep]); // cập nhật tạm thời local list
          form.resetFields();
          setImageBase64(undefined);
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Lỗi khi thêm bước!");
        },
      }

    );


  };



  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="max-w-5xl mx-auto shadow-lg rounded-2xl border border-gray-200">
        <Title level={3} className="text-center text-blue-600 mb-6">
          Chi tiết dịch vụ: Massage Body 💆‍♀️
        </Title>

        {/* ✅ Tabs có logic click */}
        <div className="flex gap-6 justify-center border-b mb-8 text-sm font-medium">
          {[
            { key: "quytrinh", label: "Quy trình" },
            { key: "loiich", label: "Lợi ích" },
            { key: "sanpham", label: "Sản phẩm" },
            { key: "luuy", label: "Lưu ý" },
            { key: "danhgia", label: "Đánh giá" },
          ].map((tab) => (
            <span
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-2 cursor-pointer transition-all ${activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
            >
              {tab.label}
            </span>
          ))}
        </div>

        {/* ✅ Nội dung theo từng tab */}
        {activeTab === "quytrinh" && (
          <>
            {/* Form thêm bước */}
            <Card
              title={<span className="font-semibold text-gray-700">➕ Thêm Bước Quy Trình Mới</span>}
              size="small"
              className="bg-white border border-gray-100 shadow-sm mb-6"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddStep}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Form.Item
                  name="title"
                  label="Tiêu đề bước"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề bước!" }]}
                >
                  <Input placeholder="VD: Tư vấn & Khám sơ bộ" />
                </Form.Item>



                <Form.Item
                  name="times"
                  label="Thời gian thực hiện (phút)"
                  rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
                >
                  <Input placeholder="VD: 15 phút" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả chi tiết"
                  className="md:col-span-2"
                >
                  <TextArea rows={3} placeholder="Mô tả chi tiết về bước này..." />
                </Form.Item>

                <Form.Item label="Hình minh họa" className="md:col-span-2">
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={async (file) => {
                      const base64 = await getBase64(file);
                      setImageBase64(base64);
                      return false;
                    }}
                    onRemove={() => setImageBase64(undefined)}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>

                  {imageBase64 && (
                    <div className="mt-3">
                      <img
                        src={imageBase64}
                        alt="preview"
                        className="w-48 h-32 rounded-lg object-cover shadow"
                      />
                    </div>
                  )}
                </Form.Item>

                <div className="md:col-span-2 flex justify-start">
                  <Button type="primary" htmlType="submit" className="bg-blue-600">
                    + Thêm Bước
                  </Button>
                </div>
              </Form>
            </Card>

            {/* Danh sách quy trình */}
            <Title level={5} className="text-gray-700 mb-3">
              Danh Sách Quy Trình ({steps.length} bước)
            </Title>

            {steps.length === 0 ? (
              <p className="text-gray-500 italic text-center">
                🚫 Chưa có bước nào được thêm.
              </p>
            ) : (
              <List
                dataSource={steps}
                renderItem={(item, idx) => (
                  <Card
                    className="mt-4 shadow-sm hover:shadow-md border border-gray-100 transition-all"
                    key={idx}
                  >
                    <div className="grid md:grid-cols-2 gap-4 items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-52 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-pink-600 text-xs font-medium border border-pink-200 px-2 py-0.5 rounded-full">
                            <ClockCircleOutlined /> {item.times}
                          </span>
                        </div>
                        <p className="font-semibold text-lg text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-blue-600 text-sm">{item.icon}</span>
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteStep(idx)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              />
            )}
          </>
        )}

        {/* Các tab khác */}
        {activeTab === "loiich" && (
          <ServiceBenefitForm serviceId={Number(serviceId)} />
        )}


        {activeTab === "sanpham" && (
         <ServiceProductForm serviceId={Number(serviceId)} />
        )}

        {activeTab === "luuy" && (
          <ImportantNotesForm serviceId={Number(serviceId)}/>
        )}


        {activeTab === "danhgia" && (
          <div className="text-center py-12 text-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">⭐ Đánh giá của khách hàng</h3>
            <p>Khách hàng hài lòng 98% sau liệu trình đầu tiên 💖</p>
          </div>
        )}
      </Card>
    </div>
  );
}

