import { Modal, Button } from "antd";
import React from "react";

interface CODPaymentProps {
  totalAfterDiscount: number;
  onCancel: () => void;
  orderData: any;
  onCreateOrder: (data: any) => Promise<any>;
}

const CODPayment: React.FC<CODPaymentProps> = ({
  totalAfterDiscount,
  onCancel,
  orderData,
  onCreateOrder,
}) => {
  const handleConfirm = async () => {
    const result = await onCreateOrder(orderData);
    if (result.success) {
      onCancel(); // đóng modal sau khi tạo đơn
    }
  };

  return (
    <Modal
      open={true}
      onCancel={onCancel}
      footer={null}
      title="Xác nhận thanh toán khi nhận hàng (COD)"
    >
      <p>Tổng thanh toán: {totalAfterDiscount.toLocaleString()} VND</p>
      <div className="flex justify-end space-x-3 mt-4">
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" onClick={handleConfirm}>
          Xác nhận đặt hàng
        </Button>
      </div>
    </Modal>
  );
};

export default CODPayment;
