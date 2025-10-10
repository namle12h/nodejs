import React, { useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    message,
    Typography,
} from "antd";
import {
    UploadOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useAddServiceSectionItem } from "../../../shared/services/serviceApi";

const { TextArea } = Input;
const { Title } = Typography;

interface BenefitItem {
    text: string;
}

interface ServiceBenefitFormProps {
    serviceId: number;
}

export default function ServiceBenefitForm({ serviceId }: ServiceBenefitFormProps) {
    const [form] = Form.useForm();
    const { mutate: addSectionItem } = useAddServiceSectionItem();
    const [beforeImage, setBeforeImage] = useState<string>();
    const [afterImage, setAfterImage] = useState<string>();

    // ✅ Convert file → base64
    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    // ✅ Submit
    const handleSubmit = (values: any) => {
        const payload = {
            title: "Lợi ích & Kết quả 75",
            description: values.description,
            extraData: JSON.stringify({
                before: beforeImage,
                after: afterImage,
                items: values.benefitItems.map((b: BenefitItem) => b.text),
            }),
            
        };


        addSectionItem(
            {
                serviceId,
                type: "benefit",
                data: payload,
            },
            {
                onSuccess: () => {
                    message.success("✅ Đã lưu lợi ích thành công!");
                    form.resetFields();
                    setBeforeImage(undefined);
                    setAfterImage(undefined);
                },
                onError: (err: any) => {
                    message.error(err.response?.data?.message || "Lỗi khi lưu lợi ích!");
                },
            }
        );
    };

    return (
        <Card
            title={<span className="font-semibold text-gray-700">🌿 Lợi Ích & Kết Quả</span>}
            className="shadow-sm border border-gray-100"
        >
            <Form
                form={form}
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onFinish={handleSubmit}
            >
                {/* Mô tả tổng quan */}
                <Form.Item
                    name="description"
                    label="Mô tả tổng quan"
                    className="md:col-span-2"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả lợi ích!" }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="VD: Những lợi ích tuyệt vời mà bạn sẽ nhận được sau liệu trình chăm sóc da..."
                    />
                </Form.Item>

                {/* Danh sách lợi ích */}
                <Form.List name="benefitItems">
                    {(fields, { add, remove }) => (
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-3">
                                <label className="font-medium text-gray-700">Danh sách lợi ích</label>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                    Thêm lợi ích
                                </Button>
                            </div>

                            {fields.map(({ key, name, ...restField }) => (
                                <div
                                    key={key}
                                    className="flex gap-3 items-center mb-2 bg-gray-50 p-3 rounded-lg"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, "text"]}
                                        className="flex-1 mb-0"
                                        rules={[{ required: true, message: "Nhập nội dung lợi ích" }]}
                                    >
                                        <Input placeholder="VD: Làm sạch sâu lỗ chân lông, loại bỏ mụn đầu đen" />
                                    </Form.Item>
                                    <Button
                                        type="text"
                                        danger
                                        onClick={() => remove(name)}
                                        icon={<DeleteOutlined />}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Form.List>

                {/* Ảnh trước & sau */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item label="Ảnh trước điều trị">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={async (file) => {
                                const base64 = await getBase64(file);
                                setBeforeImage(base64);
                                return false; // Ngăn upload thật
                            }}
                            onRemove={() => setBeforeImage(undefined)}
                        >
                            <UploadOutlined /> <div className="mt-1 text-sm">Chọn ảnh</div>
                        </Upload>
                        {beforeImage && (
                            <img
                                src={beforeImage}
                                alt="Before"
                                className="mt-2 w-40 h-52 object-cover rounded-lg shadow"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="Ảnh sau điều trị">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={async (file) => {
                                const base64 = await getBase64(file);
                                setAfterImage(base64);
                                return false;
                            }}
                            onRemove={() => setAfterImage(undefined)}
                        >
                            <UploadOutlined /> <div className="mt-1 text-sm">Chọn ảnh</div>
                        </Upload>
                        {afterImage && (
                            <img
                                src={afterImage}
                                alt="After"
                                className="mt-2 w-40 h-52 object-cover rounded-lg shadow"
                            />
                        )}
                    </Form.Item>
                </div>

                {/* Nút submit */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                        💾 Lưu Lợi Ích
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
