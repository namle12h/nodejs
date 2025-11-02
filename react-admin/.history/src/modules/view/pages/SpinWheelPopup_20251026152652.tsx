import { useState } from "react";
import { Modal } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import SpinWheel from "../components/SpinWheel";

const SpinWheelPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút nổi (floating button) */}
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer animate-bounce"
      >
        <GiftOutlined style={{ fontSize: 28 }} />
      </div>

      {/* Modal hiện vòng quay */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={900}
        centered
        bodyStyle={{
          padding: 0,
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <SpinWheel />
      </Modal>
    </>
  );
};

export default SpinWheelPopup;
