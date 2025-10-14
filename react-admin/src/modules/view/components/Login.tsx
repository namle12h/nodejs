// import { useState } from "react";
// import { Input, Button, Checkbox } from "antd";
// import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined } from "@ant-design/icons";

// export default function Login() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = () => {
//     setLoading(true);
//     setTimeout(() => setLoading(false), 1500); // giả lập call API
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-pink-50">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-center mb-2">Đăng nhập tài khoản</h2>
//         <p className="text-gray-500 text-center mb-6">
//           Chào mừng bạn trở lại với <span className="text-pink-500 font-semibold">Serenity Spa</span>
//         </p>

//         <div className="space-y-4">
//           <Input
//             size="large"
//             placeholder="Email hoặc số điện thoại"
//             prefix={<MailOutlined className="text-gray-400" />}
//           />

//           <Input.Password
//             size="large"
//             placeholder="Mật khẩu"
//             prefix={<LockOutlined className="text-gray-400" />}
//             iconRender={(visible) =>
//               visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//             }
//           />

//           <div className="flex items-center justify-between">
//             <Checkbox>Ghi nhớ đăng nhập</Checkbox>
//             <a href="#" className="text-pink-500 text-sm hover:underline">
//               Quên mật khẩu?
//             </a>
//           </div>

//           <Button
//             type="primary"
//             size="large"
//             className="w-full bg-pink-500 hover:bg-pink-600 font-semibold"
//             loading={loading}
//             onClick={handleSubmit}
//           >
//             Đăng nhập
//           </Button>
//         </div>

//         <p className="text-center text-gray-600 mt-6">
//           Chưa có tài khoản?{" "}
//           <a href="#" className="text-pink-500 font-semibold hover:underline">
//             Đăng ký ngay
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
