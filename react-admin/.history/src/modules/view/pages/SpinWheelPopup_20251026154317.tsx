import { useState } from "react";
import { Modal } from "antd";
import { GiftOutlined} from "@ant-design/icons";
import SpinWheel from "../components/SpinWheel";

const SpinWheelPopup = () => {
  const [open, setOpen] = useState(false); // Mở modal quay thưởng
  const [visible, setVisible] = useState(true); // Hiển thị / ẩn icon popup

  if (!visible) return null; // Nếu đã tắt thì không render gì nữa

  return (
    <>
      {/* Nút nổi (floating button + nút tắt) */}
      <div className="fixed bottom-20 right-6 flex flex-col items-center gap-2">
        {/* Nút tắt quảng cáo */}
        <button
          onClick={() => setVisible(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-md shadow-md"
        >
          ✖ Ẩn
        </button>

        {/* Nút mở vòng quay */}
        <div
          onClick={() => setOpen(true)}
          className="relative bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer animate-bounce"
          title="Xoay để nhận ưu đãi!"
        >
          <GiftOutlined style={{ fontSize: 28 }} />
          {/* Vòng sáng xung quanh icon */}
          <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </div>

      {/* Modal hiện vòng quay */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={900}
        centered
        style={{
    background: "transparent", // ❌ bỏ nền trắng của modal container
    boxShadow: "none",         // ❌ bỏ đổ bóng trắng mặc định
  }}
      >
        <SpinWheel />
      </Modal>
    </>
  );
};

export default SpinWheelPopup;
