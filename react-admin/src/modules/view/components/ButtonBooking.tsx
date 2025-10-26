import React from "react";
import { Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface BookingButtonFixedProps {
  onClick?: () => void;
  label?: string;
  color?: "red" | "blue" | "black";
}

const BookingButtonFixed: React.FC<BookingButtonFixedProps> = ({
  onClick,
  label = "Đặt lịch ngay",
  color = "red",
}) => {
  const colorMap: Record<string, string> = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    black: "bg-black hover:bg-gray-800",
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      animate={{
        rotate: [0, 2, -2, 2, -2, 0], // 👈 Rung nhẹ trái-phải
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2.5, // 👈 nghỉ 2.5s giữa các lần rung
        ease: "easeInOut",
      }}
    >
      <Button
        size="large"
        className={`${colorMap[color]} !text-white !bg-pink-500 font-semibold rounded-full px-6 py-5 shadow-lg flex items-center gap-2 transition-all`}
        icon={<CalendarOutlined />}
        onClick={onClick}
      >
        {label}
      </Button>
    </motion.div>
  );
};

export default BookingButtonFixed;
