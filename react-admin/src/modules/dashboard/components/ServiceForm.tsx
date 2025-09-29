import { Form, Input, InputNumber, Button, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

interface ServiceFormProps {
    initialValues?: any;
    onSubmit: (values: FormData) => void;
    loading?: boolean;
}

export default function ServiceForm({ initialValues, onSubmit, loading }: ServiceFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
        const formData = new FormData();

        // thêm JSON service
        formData.append(
            "service",
            new Blob([JSON.stringify(values)], { type: "application/json" })
        );

        // thêm file ảnh nếu có
        if (values.file && values.file.length > 0) {
            formData.append("file", values.file[0].originFileObj);
        }

        onSubmit(formData);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ active: true, ...initialValues }}
        >
            <Form.Item
                name="name"
                label="Service Name"
                rules={[{ required: true, message: "Please enter service name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter price" }]}
            >
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
                name="durationMin"
                label="Duration (minutes)"
                rules={[{ required: true, message: "Please enter duration" }]}
            >
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
            >
                <Input.TextArea rows={3} />
            </Form.Item>


            <Form.Item
                name="file"
                label="Upload Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e?.fileList;
                }}
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

            <Form.Item name="active" label="Active" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}
