// import React, { useEffect, useState } from 'react';
// import type { FormProps } from 'antd';
// import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
// import axios from 'axios';
// import { env } from '../helpers/getEnvs';
// import { useAuthStore } from '../stores/authStore';
// import { useNavigate } from 'react-router-dom';
// type FieldType = {
//   email?: string;
//   password?: string;
//   remember?: string;
// };

// const LoginPage: React.FC = () => {
//   const { setToken, token, setUser } = useAuthStore();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();



//   useEffect(() => {
//     const storedToken = localStorage.getItem('token'); // 🔥
//     const storedUser = localStorage.getItem('user');   // 🔥
//     if (storedToken && storedUser) {
//       setToken(JSON.parse(storedToken));
//       setUser(JSON.parse(storedUser));
//       navigate('/'); // 🔥 redirect ngay nếu đã login
//     }
//   }, [setToken, setUser]);

//   const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
//     try {
//       setIsLoading(true);
//       const responseLogin = await axios.post(`${env.API_URL}/auth/login`, {
//         email: values.email,
//         password: values.password,
//       });
//       console.log('<<==>> respinseLogin', responseLogin);
//       if (responseLogin.status === 200) {

//         const newToken = responseLogin.data.token;// data đầu tiên là của axios, data thứ 2 là của api

//         // 1. Lưu tokens vào zustand
//         setToken(newToken);



//         // lưu token vào local storage
//         localStorage.setItem('token', JSON.stringify(newToken));


//         // lấy thông tin profile vào local storage
//         const responseProfile = await axios.get(`${env.API_URL}/auth/get-profile`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${newToken}`, // dùng token mới 
//           },
//         }
//         );
//         console.log('<<==>> responseProfile', responseProfile);



//         // lưu thông tin user vào local storage
//         if (responseProfile.status === 200) {
//           const userData = responseProfile.data.user;



//           // 4. Lưu user vào zustand
//           setUser(userData)

//           localStorage.setItem("user", JSON.stringify(userData));

//           // redirect theo role
//           const roleRedirect: Record<string, string> = {
//             ADMIN: "/dashboard",
//             STAFF: "/dashboard",
//             CUSTOMER: "/home",
//           };

//           const redirectPath = roleRedirect[userData.role] || "/login";
//           navigate(redirectPath, { replace: true });


//           messageApi.open({
//             type: 'success',
//             content: 'Login successful!',
//           });
//           // 🔥 5. Lưu user vào localStorage để giữ lâu dài
//           localStorage.setItem('user', JSON.stringify(userData)); // 🔥


//           // TODO: navigate đến trang dashboard
//         }
//         // chuyển hướng đến trang dashboard
//         // navigate('/');

//       }
//       else {
//         messageApi.open({
//           type: 'error',
//           content: 'Login failed!',
//         });
//       }
//     } catch (error) {
//       messageApi.open({
//         type: 'error',
//         content: 'Login failed!Please check your email and password!',
//       });
//     }
//   };

//   const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//     console.log('Failed:', errorInfo);

//   };

//   return (
//     <Flex className='h-screen' align="center" justify="center" >
//       {contextHolder}
//       <Form
//         name="login"

//         labelCol={{ span: 8 }}
//         wrapperCol={{ span: 16 }}
//         style={{ maxWidth: 600 }}
//         initialValues={{
//           remember: true,
//           email: 'namle@gmail.com',
//           password: '123456'
//         }}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//       >
//         <Form.Item<FieldType>
//           label="Email"
//           name="email"

//           rules={[{ required: true, message: 'Please input your email!' }]}
//         >
//           <Input placeholder="Enter your email" />
//         </Form.Item>

//         <Form.Item<FieldType>
//           label="Password"
//           name="password"
//           rules={[{ required: true, message: 'Please input your password!' }]}
//         >
//           <Input.Password placeholder="Enter your password!" />
//         </Form.Item>

//         <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
//           <Checkbox>Remember me</Checkbox>
//         </Form.Item>

//         <Form.Item label={null}>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </Flex>
//   );
// };


// export default LoginPage;


import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Flex, Form, Input, message } from "antd";
import axios from "axios";
import { env } from "./helpers/getEnvs";
import { useAuthStore } from "./stores/authStore";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginPage: React.FC = () => {
  const { setToken, setUser } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Nếu user đã có token trong localStorage thì redirect ngay
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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setIsLoading(true);
      // gọi API login
      const responseLogin = await axios.post(`${env.API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (responseLogin.status === 200) {
        const newToken = responseLogin.data.token;

        // lưu token vào zustand + localStorage
        setToken(newToken);
        localStorage.setItem("token", JSON.stringify(newToken));

        // gọi API lấy profile
        const responseProfile = await axios.get(
          `${env.API_URL}/auth/get-profile`,
          {
            headers: {
              "Authorization": `Bearer ${newToken}`,
            },
          }
        );

         console.log('<<==>> responseProfile', responseProfile);
         console.log('<<==>> responseLogin', responseLogin);

        if (responseProfile.status === 200) {
          const userData = responseProfile.data.user;

          // lưu user
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // redirect theo role
          const roleRedirect: Record<string, string> = {
            ADMIN: "/dashboard",
            STAFF: "/dashboard",
            CUSTOMER: "/home",
          };

          navigate(roleRedirect[userData.role] || "/login", { replace: true });

          messageApi.open({
            type: "success",
            content: "Login successful!",
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Login failed!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Login failed! Please check your email and password!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex className="h-screen" align="center" justify="center">
      {contextHolder}
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          remember: true,
          email: "namle@gmail.com",
          password: "123456",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password!" />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
