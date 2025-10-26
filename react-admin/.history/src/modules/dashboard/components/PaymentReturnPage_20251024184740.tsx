// PaymentReturnPage.tsx
import React, { useEffect, useState } from "react";
import { Result, Button, Spin, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const PaymentReturnPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const txnRef = searchParams.get("vnp_TxnRef");

    // ✅ Kiểm tra thanh toán thành công
    if (responseCode === "00" ) {
      setStatus("success");

      // Gọi API cập nhật trạng thái đơn hàng nếu cần
      // await updateInvoiceStatus(txnRef, "PAID");

      message.success("Thanh toán VNPay thành công!");
    } else {
      setStatus("fail");
      message.error("Thanh toán thất bại hoặc bị hủy.");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {status === "success" ? (
        <Result
          icon={<CheckCircleOutlined style={{ color: "green" }} />}
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã sử dụng dịch vụ. Hóa đơn của bạn đã được ghi nhận."
          extra={
            <Button type="primary" onClick={() => navigate("/orders")}>
              trở về trang chủ
            </Button>
            
          }
        />
      ) : (
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: "red" }} />}
          title="Thanh toán thất bại!"
          subTitle="Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại."
          extra={
            <Button onClick={() => navigate("/payment")}>Thử lại</Button>
          }
        />
      )}
    </div>
  );
};

export default PaymentReturnPage;
