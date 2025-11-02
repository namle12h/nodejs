import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { motion } from "framer-motion";

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  // 🎯 Danh sách phần thưởng
  const prizes = ["Voucher 200K", "Voucher 2%", "Voucher 200K", "Voucher 2%", "Voucher 200K", "Voucher 2%"];

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / prizes.length;
      const normalizedRotation = (newRotation % 360 + 360) % 360;
      const adjustedRotation = (normalizedRotation + 90 - segmentAngle / 2 + 360) % 360;
      const prizeIndex = Math.floor(adjustedRotation / segmentAngle) % prizes.length;
      const wonPrize = prizes[prizeIndex];

      setResult(wonPrize);
      message.success(`🎉 Chúc mừng! Bạn đã trúng ${wonPrize}`);
      setSpinning(false);
    }, 3500);
  };

  const onFinish = (values: any) => {
    message.success(`Voucher sẽ được gửi đến số: ${values.phone}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 rounded-[20px]">
      {/* Bên trái: vòng quay */}
      <div className="relative flex flex-col items-center justify-center md:mr-8">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="relative w-64 h-64 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.6)]"
          style={{
            background:
              "conic-gradient(#ff0000 0deg 60deg, #ffffff 60deg 120deg, #ff0000 120deg 180deg, #ffffff 180deg 240deg, #ff0000 240deg 300deg, #ffffff 300deg 360deg)",
          }}
        >
          {["2%", "200K", "2%", "200K", "2%", "200K"].map((text, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 text-lg font-bold"
              style={{
                transform: `rotate(${i * 60}deg) translate(85px) rotate(-${i * 60}deg)`,
                color: i % 2 === 0 ? "#d00" : "#111",
              }}
            >
              {text}
            </div>
          ))}

          {/* Nút trung tâm */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl bg-white rounded-full w-16 h-16 font-bold text-red-600 shadow-lg">
            🎁
          </div>
        </motion.div>

        {/* Kim chỉ */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-transparent border-b-white"></div>

        <Button
          type="primary"
          onClick={handleSpin}
          disabled={spinning}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
        >
          {spinning ? "Đang quay..." : "Quay ngay"}
        </Button>
      </div>

      {/* Bên phải: form đăng ký */}
      <div className="bg-gradient-to-b from-yellow-200 to-yellow-50 text-red-700 p-6 rounded-2xl shadow-xl w-full max-w-sm mt-8 md:mt-0">
        <h2 className="text-xl font-extrabold text-center mb-2">
          🎉 Chào Khách Hàng Mới 🎉
        </h2>
        <p className="text-center text-sm mb-4">
          Tặng ngay <span className="font-bold text-red-600">Voucher đến 200K</span>  
          <br /> cho khách chưa mua hàng trong 2 năm qua!
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {result && (
            <div className="bg-green-100 text-green-700 text-center py-2 rounded mb-3 font-medium">
              🎁 Chúc mừng! Bạn đã trúng {result}
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold"
          >
            SĂN NGAY
          </Button>
        </Form>

        <p className="text-center text-xs mt-3 underline cursor-pointer hover:text-red-800">
          Xem thể lệ
        </p>
      </div>
    </div>
  );
};

export default SpinWheel;
