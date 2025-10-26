import { Modal } from "antd";
import BookingForm from "../components/BookingPage";
import React from "react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose }) => {
  return (
    <Modal
    //   title="Đặt Lịch Dịch Vụ"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      destroyOnClose
    >
      <BookingForm onSuccess={onClose} />
    </Modal>
  );
};

export default BookingModal;
