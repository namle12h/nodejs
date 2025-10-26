import  { useEffect, useState } from "react";
import { Result, Button, Spin, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const PaymentReturnPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [countdown, setCountdown] = useState(5); // ⏱ Đếm ngược 5 giây
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const txnRef = searchParams.get("vnp_TxnRef");

    if (responseCode === "00") {
      setStatus("success");

      // Tự động quay về trang chủ sau 5 giây
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);

      // Đếm ngược để hiển thị trên giao diện
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setStatus("fail");
      message.error("❌ Thanh toán thất bại hoặc bị hủy!");
    }
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {status === "success" ? (
        <Result
          icon={<CheckCircleOutlined style={{ color: "green" }} />}
          title="Thanh toán thành công!"
          subTitle={`Cảm ơn bạn đã sử dụng dịch vụ. Bạn sẽ được chuyển về trang chủ sau ${countdown} giây.`}
          extra={
            <div className="flex gap-3 justify-center">
              <Button type="primary" onClick={() => navigate("/orders")}>
                Xem đơn hàng
              </Button>
              <Button onClick={() => navigate("/")}>Về trang chủ ngay</Button>
            </div>
          }
        />
      ) : (
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: "red" }} />}
          title="Thanh toán thất bại!"
          subTitle="Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại."
          extra={<Button onClick={() => navigate("/payment")}>Thử lại</Button>}
        />
      )}
    </div>
  );
};

export default PaymentReturnPage;
