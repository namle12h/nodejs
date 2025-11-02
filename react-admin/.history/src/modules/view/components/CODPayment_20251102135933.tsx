import React from "react";

interface CODPaymentProps {
  onCreateOrder: () => void;
}

const CODPayment: React.FC<CODPaymentProps> = ({ onCreateOrder }) => {
  return (
    <div className="cod-payment">
      <h4>Thanh toán khi nhận hàng (COD)</h4>
      <p>Bạn sẽ thanh toán khi nhận được hàng từ nhân viên giao hàng.</p>

      <button onClick={onCreateOrder} className="cod-confirm-btn">
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default CODPayment;
