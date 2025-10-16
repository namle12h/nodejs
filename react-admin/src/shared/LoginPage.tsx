

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { env } from "./helpers/getEnvs";
import { useAuthStore } from "./stores/authStore";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const { setToken, setUser } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect nếu đã login
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(JSON.parse(storedToken));
      setUser(JSON.parse(storedUser));
      const parsedUser = JSON.parse(storedUser);
      const roleRedirect: Record<string, string> = {
        ADMIN: "/dashboard",
        STAFF: "/dashboard",
        CUSTOMER: "/home",
      };
      navigate(roleRedirect[parsedUser.role] || "/login", { replace: true });
    }
  }, [setToken, setUser, navigate]);

  // ✅ Submit form
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setIsLoading(true);

      // gọi API login
      const responseLogin = await axios.post(`${env.API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (responseLogin.status === 200) {
        const accessToken = responseLogin.data.accessToken;
        const refreshToken = responseLogin.data.refreshToken;

        // lưu cả 2 token
        setToken(accessToken);
        localStorage.setItem("token", JSON.stringify(accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        // gọi get-profile với accessToken
        const responseProfile = await axios.get(`${env.API_URL}/auth/get-profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (responseProfile.status === 200) {
          const userData = responseProfile.data.user;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          const roleRedirect: Record<string, string> = {
            ADMIN: "/dashboard",
            STAFF: "/dashboard",
            CUSTOMER: "/home",
          };
          navigate(roleRedirect[userData.role] || "/login", { replace: true });

          messageApi.success("Đăng nhập thành công!");
        }
      } else {
        messageApi.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      messageApi.error("Sai email hoặc mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // ✅ Giao diện mới (Tailwind + Antd)
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      {contextHolder}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2">Đăng nhập tài khoản</h2>
        <p className="text-gray-500 text-center mb-6">
          Chào mừng bạn trở lại với{" "}
          <span className="text-pink-500 font-semibold">Bella Spa</span>
        </p>

        <Form
          name="login"
          layout="vertical"
          initialValues={{
            remember: true,
            email: "namle@gmail.com",
            password: "123456",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              size="large"
              placeholder="Email hoặc số điện thoại"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined className="text-gray-400" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <a href="#" className="text-pink-500 text-sm hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 font-semibold"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <a href="register" className="text-pink-500 font-semibold hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
