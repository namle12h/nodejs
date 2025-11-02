import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { motion } from "framer-motion";

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const prizes = [
    "2% giảm giá",
    "5% giảm giá",
    "10% giảm giá",
    "20% giảm giá",
    "Voucher 50k",
    "Voucher 100k",
  ];

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Quay ít nhất 4 vòng + thêm góc ngẫu nhiên
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / prizes.length;
      const normalizedRotation = (newRotation % 360 + 360) % 360;
      const correctedRotation = (normalizedRotation + segmentAngle / 2) % 360;

      // Tính phần thưởng theo chiều kim đồng hồ
      const prizeIndex =
        Math.floor(correctedRotation / segmentAngle) % prizes.length;

      // Đảo thứ tự vì ô 0 nằm ở góc trên (12h)
      const wonPrize =
        prizes[(prizes.length - 1 - prizeIndex + prizes.length) % prizes.length];

      setResult(wonPrize);
      message.success(`🎉 Chúc mừng! Bạn đã trúng ${wonPrize}`);
      setSpinning(false);
    }, 3500);
  };

  const onFinish = (values) => {
    message.success(`Voucher sẽ được gửi đến số: ${values.phone}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-red-400 p-6">
      {/* Vòng quay */}
      <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-12">
        <div className="text-white text-4xl font-bold mb-4">
          Xoay Là Trúng 🎁
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="relative w-64 h-64 rounded-full border-[10px] border-white flex items-center justify-center overflow-hidden"
            style={{
              background:
                "conic-gradient(red 0deg 60deg, #111 60deg 120deg, red 120deg 180deg, #111 180deg 240deg, red 240deg 300deg, #111 300deg 360deg)",
            }}
          >
            {/* Chữ hiển thị trên từng ô */}
            {["2%", "5%", "10%", "20%", "50k", "100k"].map((text, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 text-sm font-semibold text-white"
                style={{
                  transform: `rotate(${i * 60}deg) translate(85px) rotate(-${
                    i * 60
                  }deg)`,
                }}
              >
                {text}
              </div>
            ))}

            {/* Icon trung tâm */}
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🎁
            </div>
          </motion.div>

          {/* Kim chỉ */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-transparent border-b-white"></div>
        </div>

        <Button
          type="primary"
          onClick={handleSpin}
          disabled={spinning}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          {spinning ? "Đang xoay..." : "Xoay ngay"}
        </Button>
      </div>

      {/* Form nhập thông tin */}
      <Card className="w-full max-w-sm shadow-2xl rounded-2xl">
        <h2 className="text-center text-lg font-semibold mb-4">
          Nhập thông tin để tham gia
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="VD: 0909xxxxxx" />
          </Form.Item>

          {result && (
            <div className="bg-green-100 text-green-700 text-center py-2 rounded mb-3 font-medium">
              🎉 Chúc mừng! Bạn đã trúng {result}
            </div>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Nhận voucher
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-500 text-sm mt-2">
          Có 338 người tham gia.
        </p>
      </Card>
    </div>
  );
};

export default SpinWheel;
