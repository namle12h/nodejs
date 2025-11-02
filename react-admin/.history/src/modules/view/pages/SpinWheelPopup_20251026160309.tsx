// import { useState } from "react";
// import { Modal } from "antd";
// import { GiftOutlined } from "@ant-design/icons";
// import SpinWheel from "../components/SpinWheel";

// const SpinWheelPopup = () => {
//   const [open, setOpen] = useState(false); // Mở modal quay thưởng
//   const [visible, setVisible] = useState(true); // Hiển thị / ẩn icon popup

//   if (!visible) return null; // Nếu đã tắt thì không render gì nữa

//   return (
//     <>
//       {/* Nút nổi (floating button + nút tắt) */}
//       <div className="fixed bottom-25 right-6 flex flex-col items-center gap-2">
//         {/* Nút tắt quảng cáo */}
//         <button
//           onClick={() => setVisible(false)}
//           className="bg-gray-200 hover:bg-gray-300 opacity-50 text-gray-700 text-xs px-2 py-1 rounded-md shadow-md"
//         >
//           ✖ Ẩn
//         </button>

//         {/* Nút mở vòng quay */}
//         <div
//           onClick={() => setOpen(true)}
//           className="relative bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer animate-bounce"
//           title="Xoay để nhận ưu đãi!"
//         >
//           <GiftOutlined style={{ fontSize: 28 }} />
//           {/* Vòng sáng xung quanh icon */}
//           <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse"></div>
//         </div>
//       </div>

//       <Modal
//   open={open}
//   footer={null}
//   onCancel={() => setOpen(false)}
//   width={900}
//   centered
//   closable
//   maskClosable
//   className="[&_.ant-modal-content]:!bg-transparent [&_.ant-modal-content]:!shadow-none [&_.ant-modal-content]:!border-none [&_.ant-modal-body]:!p-0"
//   styles={{
//     mask: {
//       backgroundColor: "rgba(0,0,0,0.45)", // lớp phủ mờ nền
//       borderRadius: "8px",
//     },
//     content: {
//       background: "transparent",
//       boxShadow: "none",
//       border: "none",
//     },
//     body: {
//       padding: 0,
//       overflow: "hidden",
//       background: "transparent",
//           borderRadius: "20px",
//     },
//   }}
// >
//   <SpinWheel />
// </Modal>

//     </>
//   );
// };

// export default SpinWheelPopup;

import { useState } from "react";
import { Modal } from "antd";
import { GiftOutlined, CloseOutlined } from "@ant-design/icons";
import SpinWheel from "./SpinWheel";
import Draggable from "react-draggable";

const SpinWheelPopup = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <>
      {/* Nút nổi có thể kéo thả */}
      <Draggable bounds="body">
        <div className="fixed bottom-6 right-6 z-50 cursor-move">
          <div
            className="relative bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
            onClick={() => setOpen(true)}
            title="Xoay để nhận ưu đãi!"
          >
            {/* Icon 🎁 */}
            <GiftOutlined style={{ fontSize: 28 }} />

            {/* Nút X nằm trong icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
              className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md"
              title="Ẩn quảng cáo"
            >
              <CloseOutlined style={{ fontSize: 10 }} />
            </button>

            {/* Hiệu ứng sáng nhấp nháy */}
            <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse pointer-events-none"></div>
          </div>
        </div>
      </Draggable>

      {/* Modal hiển thị vòng quay */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={900}
        centered
        closable={true}
        maskClosable={true}
        style={{
          background: "transparent",
          borderRadius: "20px",
          boxShadow: "none",
          overflow: "hidden",
        }}
        bodyStyle={{
          background: "transparent",
          padding: 0,
          borderRadius: "20px",
          overflow: "hidden",
        }}
        maskStyle={{
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      >
        <SpinWheel />
      </Modal>
    </>
  );
};

export default SpinWheelPopup;
