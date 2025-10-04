import { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const EditAppointment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      message.success("Cập nhật lịch hẹn thành công!");
      setLoading(false);
      console.log("Form data:", values);
    }, 1000);
  };

  return (
    <div className="p-6">

      {/* Form */}
      <Card className="shadow rounded-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: "Khanhlee",
            phone: "0332221111",
            email: "namelexx@gmail.com",
            status: "confirmed",
          }}
        >
          {/* Thông tin khách hàng */}
          <h3 className="font-semibold mb-2">Thông tin Khách hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Tên khách hàng"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          {/* Thông tin thời gian */}
          <h3 className="font-semibold mb-2 mt-4">Thông tin Thời gian</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Thời gian bắt đầu"
              name="start"
              rules={[{ required: true, message: "Chọn thời gian bắt đầu" }]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>
            <Form.Item
              label="Thời gian kết thúc"
              name="end"
              rules={[{ required: true, message: "Chọn thời gian kết thúc" }]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>
          </div>

          {/* Nhân viên + phòng */}
          <h3 className="font-semibold mb-2 mt-4">Phân công Nhân viên và Phòng</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Nhân viên phụ trách"
              name="staff"
              rules={[{ required: true, message: "Chọn nhân viên phụ trách" }]}
            >
              <Select placeholder="Chọn nhân viên">
                <Option value="nv1">Nguyễn Văn A</Option>
                <Option value="nv2">Trần Thị B</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Phòng thực hiện"
              name="room"
              rules={[{ required: true, message: "Chọn phòng" }]}
            >
              <Select placeholder="Chọn phòng">
                <Option value="p1">Phòng 101</Option>
                <Option value="p2">Phòng 102</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Trạng thái + ghi chú */}
          <h3 className="font-semibold mb-2 mt-4">Trạng thái và Ghi chú</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Trạng thái lịch hẹn"
              name="status"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select>
                <Option value="pending">Đang chờ</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={2} placeholder="Nhập ghi chú (tùy chọn)" />
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button icon={<CloseOutlined />}>Hủy bỏ</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card>

      {/* Lưu ý */}
      <div className="bg-blue-50 p-4 mt-4 rounded-lg text-sm text-gray-700">
        <p><strong>Lưu ý khi chỉnh sửa lịch hẹn:</strong></p>
        <ul className="list-disc ml-6">
          <li>Thời gian kết thúc phải sau thời gian bắt đầu</li>
          <li>Khách hàng sẽ nhận được email thông báo khi có thay đổi</li>
          <li>Phải chọn nhân viên và phòng trước khi lưu</li>
          <li>Các trường có dấu (*) là bắt buộc</li>
        </ul>
      </div>
    </div>
  );
};

export default EditAppointment;
