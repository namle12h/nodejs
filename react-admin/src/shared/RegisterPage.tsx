import { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values:any) => {
    setLoading(true);
    try {
      // ✅ Gọi API đăng ký
      const res = await axios.post("http://localhost:8080/api/customers", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      // ✅ Kiểm tra phản hồi
      if (res.status === 201 || res.data.success) {
        message.success("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        message.warning(res.data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error:any) {
      // ✅ Xử lý lỗi API
      console.error("Register error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1588159343745-4454c7da7e0d?auto=format&fit=crop&w=1600&q=80')", // 👉 ảnh nền spa
      }}
    >
      {/* overlay gradient */}
      <div className="absolute inset-0 bg-pink-200/30 backdrop-blur-sm"></div>

      {/* form container */}
      <div className="relative bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[400px] z-10">
        <Title level={2} className="text-center mb-1 !text-gray-800">
          Tạo tài khoản mới
        </Title>
        <Text className="block text-center !text-pink-500 mb-6">
          Tham gia cộng đồng Bella Spa
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          {/* Họ và tên */}
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0[0-9]{9})$/,
                message: "Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 số)!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
                message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu (tối thiểu 8 ký tự)"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Xác nhận mật khẩu */}
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              className="h-11 rounded-lg"
            />
          </Form.Item>

          {/* Điều khoản */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Bạn phải đồng ý với điều khoản!")
                      ),
              },
            ]}
          >
            <Checkbox>
              Tôi đồng ý với{" "}
              <a href="#" className="text-pink-600">
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="#" className="text-pink-600">
                Chính sách bảo mật
              </a>
            </Checkbox>
          </Form.Item>

          {/* Nút đăng ký */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-pink-500 hover:!bg-pink-600 h-11 rounded-lg font-medium"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center mt-3">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="text-pink-600 font-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
