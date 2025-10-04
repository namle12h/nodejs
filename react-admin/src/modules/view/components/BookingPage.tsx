import { Form, Input, Select, DatePicker, TimePicker, Button } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useServices } from "../../../shared/services/serviceApi";
import { useCreateAppointment } from "../../../shared/services/appointmentApi";
import { useAuthStore } from '../../../shared/stores/authStore';

export default function BookingForm() {
    const [form] = Form.useForm();
    const { data: services = [] } = useServices(1, 10);
    const mutationBooking = useCreateAppointment();
    const { user } = useAuthStore();

    const onFinish = (values: any) => {
        let payload: any = {
            date: values.date.format("YYYY-MM-DD"),
            time: values.time.format("HH:mm"),
            notes: values.notes,            // ✅ đúng tên
            serviceId: values.serviceId     // ✅ đúng tên
        };

        if (user) {
            payload.customerId = user.id;
            payload.name = values.name;
            payload.email = values.email;
            payload.phone = values.phone;
        } else {
            payload.name = values.name;
            payload.email = values.email;
            payload.phone = values.phone;
        }

        console.log("Payload gửi đi:", payload);
        mutationBooking.mutate(payload);
    };




    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Đặt Lịch Nhanh</h2>
                    <p className="text-gray-600 mt-2">
                        Đặt lịch hẹn dễ dàng và nhận tư vấn miễn phí từ chuyên gia của chúng tôi
                    </p>
                </div>

                <div className="bg-pink-50 p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            name: user?.name,
                            email: user?.email,
                            phone: user?.phone,
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chọn dịch vụ */}
                            <Form.Item
                                label=" Chọn Dịch Vụ"
                                name="serviceId"
                                rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
                            >
                                <Select placeholder="Chọn dịch vụ bạn muốn">
                                    {services.map((service: any) => (
                                        <Select.Option key={service.id} value={service.id}>
                                            {service.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Chọn ngày */}
                            <Form.Item
                                label=" Chọn Ngày"
                                name="date"
                                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                            >
                                <DatePicker
                                    className="w-full"
                                    format="YYYY-MM-DD"
                                    // Không cho chọn ngày quá khứ
                                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                                />
                            </Form.Item>

                            {/* Chọn giờ */}
                            <Form.Item
                                label=" Chọn Giờ"
                                name="time"
                                rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                            >

                                <TimePicker className="w-full" format="HH:mm" />
                                
                                

                            </Form.Item>

                            {/* Số điện thoại */}
                            <Form.Item
                                label=" Số Điện Thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    { pattern: /^[0-9]{9,11}$/, message: "SĐT phải có 9-11 số" },
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            {/* Họ và tên */}
                            <Form.Item
                                label=" Họ và Tên"
                                name="name"
                                rules={[
                                    { required: true, message: "Vui lòng nhập họ tên" },
                                    { min: 2, message: "Tên phải ít nhất 2 ký tự" },
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                label=" Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ email" />
                            </Form.Item>
                        </div>

                        {/* Ghi chú */}
                        <Form.Item label="Ghi Chú Đặc Biệt" name="notes">
                            <Input.TextArea
                                rows={4}
                                placeholder="Nhập yêu cầu đặc biệt hoặc ghi chú (không bắt buộc)"
                            />
                        </Form.Item>

                        {/* Submit */}
                        <div className="text-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={mutationBooking.isPending}
                                className="!bg-pink-600 hover:!bg-pink-700 px-8"
                            >
                                Xác Nhận Đặt Lịch
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </section>
    );
}
