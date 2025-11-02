import { useState } from "react";
import { Modal } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import SpinWheel from "../components/SpinWheel";

const SpinWheelPopup = () => {
  const [open, setOpen] = useState(false); // Mở modal quay thưởng
  const [visible, setVisible] = useState(true); // Hiển thị / ẩn icon popup

  if (!visible) return null; // Nếu đã tắt thì không render gì nữa

  return (
  <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-[20px]">
    {/* Bên trái: vòng quay */}
    <div className="flex flex-col items-center justify-center md:mr-8">
      <div className="text-2xl font-bold mb-4">🎯 Vòng Quay May Mắn</div>

      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 3.5, ease: "easeOut" }}
        className="relative w-64 h-64 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.6)]"
        style={{
          background:
            "conic-gradient(#ff0000 0deg 60deg, #fff 60deg 120deg, #ff0000 120deg 180deg, #fff 180deg 240deg, #ff0000 240deg 300deg, #fff 300deg 360deg)",
        }}
      >
        {/* Text các phần thưởng */}
        {["2%", "200K", "2%", "200K", "2%", "200K"].map((text, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 text-sm font-semibold"
            style={{
              transform: `rotate(${i * 60}deg) translate(85px) rotate(-${
                i * 60
              }deg)`,
              color: i % 2 === 0 ? "#d00" : "#fff",
            }}
          >
            {text}
          </div>
        ))}

        {/* Nút trung tâm */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🎁
        </div>
      </motion.div>

      {/* Kim chỉ */}
      <div className="absolute top-[calc(50%-130px)] left-[50%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-transparent border-b-white"></div>

      <Button
        type="primary"
        onClick={handleSpin}
        disabled={spinning}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
      >
        {spinning ? "Đang quay..." : "Quay ngay"}
      </Button>
    </div>

    {/* Bên phải: nội dung và form */}
    <div className="bg-gradient-to-b from-yellow-300 to-yellow-100 text-red-700 p-6 rounded-2xl shadow-lg w-full max-w-sm mt-8 md:mt-0">
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

export default SpinWheelPopup;
