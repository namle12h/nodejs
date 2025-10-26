import React, { useState, useEffect } from "react";
import { Button, Divider, Modal, Steps } from "antd";
import {
  CheckCircleFilled,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Step } = Steps;

interface OrderItem {
  productId: number;
  name: string;
  imageUrl?: string;
  quantity: number;
  pricePerUnit: number;
}

interface Order {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  userfullname?: string;
  detailAddress: string;
  commune_name: string;
  district_name: string;
  city_name: string;
  paymentMethod: string;
  totalAmount: number;
  discountAmount: number;
  orderItems: OrderItem[];
}

export default function PaymentSuccess() {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderIdFromQuery = searchParams.get("orderId");
    if (orderIdFromQuery) {
      setOrderId(orderIdFromQuery);
    } else {
      setError("Không tìm thấy mã đơn hàng.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      fetch(`http://localhost:3001/orders/${orderId}`) // 👉 Thay URL API phù hợp
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setOrderData(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Không thể tải thông tin đơn hàng.");
          setLoading(false);
        });
    }
  }, [orderId]);

  const showTrackingModal = () => setIsTrackingModalOpen(true);
  const handleTrackingModalClose = () => setIsTrackingModalOpen(false);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Đang tải thông tin đơn hàng...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );

  if (!orderData)
    return (
      <div className="flex justify-center items-center h-full">
        Không tìm thấy thông tin đơn hàng.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-600">TechStore</h1>
        <Button type="link" onClick={() => navigate("/")}>
          Trang chủ
        </Button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Success message */}
          <div className="text-center mb-8">
            <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Thanh toán thành công
            </h2>
            <p className="text-gray-600 mt-2">
              Cảm ơn bạn đã mua hàng tại TechStore
            </p>
            <p className="text-gray-600 mt-1">
              Mã đơn hàng:{" "}
              <span className="font-semibold">#{orderData.id}</span>
            </p>
          </div>

          <Divider />

          {/* ORDER DETAILS */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-4">
              {orderData.orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center p-4 border border-gray-100 rounded-lg"
                >
                  <img
                    src={
                      item.imageUrl ||
                      `https://via.placeholder.com/100x100?text=SP+${item.productId}`
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      SL: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.pricePerUnit.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tổng tiền hàng:</span>
                <span>
                  {(
                    orderData.totalAmount + orderData.discountAmount
                  ).toLocaleString("vi-VN")}{" "}
                  VND
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Giảm giá:</span>
                <span>{orderData.discountAmount.toLocaleString("vi-VN")} VND</span>
              </div>
              <Divider />
              <div className="flex justify-between font-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-red-600 text-lg">
                  {orderData.totalAmount.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>
          </div>

          <Divider />

          {/* SHIPPING INFO */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Họ tên:</p>
                <p className="font-medium">{orderData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Số điện thoại:</p>
                <p className="font-medium">{orderData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email:</p>
                <p className="font-medium break-all">{orderData.email}</p>
              </div>
              {orderData.userfullname && (
                <div>
                  <p className="text-gray-600 mb-1">Tên khách hàng:</p>
                  <p className="font-medium">{orderData.userfullname}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-gray-600 mb-1">Địa chỉ giao hàng:</p>
                <p className="font-medium">
                  {orderData.detailAddress}, {orderData.commune_name},{" "}
                  {orderData.district_name}, {orderData.city_name}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* PAYMENT METHOD */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Phương thức thanh toán
            </h3>
            <div className="flex items-center p-3 border rounded-lg w-fit">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-credit-card text-blue-600"></i>
              </div>
              <span className="ml-3 font-medium">
                {orderData.paymentMethod === "card"
                  ? "Thẻ tín dụng/ghi nợ"
                  : orderData.paymentMethod === "ewallet"
                  ? "Ví điện tử"
                  : orderData.paymentMethod === "bank"
                  ? "Chuyển khoản ngân hàng"
                  : orderData.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Khác"}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 border-none"
              onClick={showTrackingModal}
            >
              Theo dõi đơn hàng
            </Button>
            <Button
              size="large"
              className="border-pink-500 text-pink-500 hover:bg-pink-50"
              onClick={() => navigate("/products")}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </Button>
          </div>
        </div>

        {/* TRACKING MODAL */}
        <Modal
          title={
            <div className="text-xl font-semibold">
              Theo dõi đơn hàng #{orderData.id}
            </div>
          }
          open={isTrackingModalOpen}
          onCancel={handleTrackingModalClose}
          footer={null}
          width={800}
        >
          <div className="py-6">
            <Steps current={0} progressDot className="custom-steps mb-8">
              <Step title="Đặt hàng thành công" />
              <Step title="Đã xác nhận" />
              <Step title="Đang chuẩn bị hàng" />
              <Step title="Đang giao hàng" />
              <Step title="Đã giao hàng" />
            </Steps>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">Thông tin vận chuyển</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Đơn vị vận chuyển:</span>{" "}
                  <b>Express</b>
                </p>
                <p>
                  <span className="text-gray-600">Mã vận đơn:</span>{" "}
                  <b>743511</b>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Đơn hàng của bạn đã được thanh toán thành công và đang được xử
                lý.
              </p>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
