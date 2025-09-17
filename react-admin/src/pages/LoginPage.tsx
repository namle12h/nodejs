import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
import axios from 'axios';
import { env } from '../helpers/getEnvs';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router';
type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginPage: React.FC = () => {
  const { setToken, token, setUser } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // 🔥
    const storedUser = localStorage.getItem('user');   // 🔥
    if (storedToken && storedUser) {
      setToken(JSON.parse(storedToken));
      setUser(JSON.parse(storedUser));
      navigate('/'); // 🔥 redirect ngay nếu đã login
    }
  }, [setToken, setUser]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setIsLoading(true);
      const responseLogin = await axios.post(`${env.API_URL}/v1/auth/login`, {
        email: values.email,
        password: values.password,
      });
      console.log('<<==>> respinseLogin', responseLogin);
      if (responseLogin.status === 200) {

        const newToken = responseLogin.data.data;// data đầu tiên là của axios, data thứ 2 là của api

        // 1. Lưu tokens vào zustand
        setToken(newToken);


        // lưu token vào local storage
        localStorage.setItem('token', JSON.stringify(newToken));

        // lấy thông tin profile vào local storage
        const responseProfile = await axios.get(`${env.API_URL}/v1/auth/get-profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken?.accessToken}`, // dùng token mới 
          },
        }
        );


        // lưu thông tin user vào local storage
        if (responseProfile.status === 200) {
          const userData = responseProfile.data.data;

          // 4. Lưu user vào zustand
          setUser(userData)

          // 🔥 5. Lưu user vào localStorage để giữ lâu dài
          localStorage.setItem('user', JSON.stringify(userData)); // 🔥
          // TODO: navigate đến trang dashboard
        }
        // chuyển hướng đến trang dashboard
        navigate('/');
        messageApi.open({
          type: 'success',
          content: 'Login successful!',
        });
      }
      else {
        messageApi.open({
          type: 'error',
          content: 'Login failed!',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Login failed!Please check your email and password!',
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);

  };

  return (
    <Flex className='h-screen' align="center" justify="center" >
      {contextHolder}
      <Form
        name="login"

        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          remember: true,
          email: 'namleadmin@hotmail.com',
          password: 'namle123'
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"

          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password!" />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};


export default LoginPage;