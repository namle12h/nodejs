import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CODPayment from "./CODPayment";
import { axiosClient } from "../../../shared/lib/axiosClient"; // ✅ import axiosClient thay axios

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("checkoutItems");
    const savedAddress = localStorage.getItem("selectedAddress");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedAddress) setSelectedAddress(JSON.parse(savedAddress));
  }, []);

  // ✅ Tạo đơn hàng
  const handleCreateOrder = async () => {
    try {
      if (!selectedAddress) {
        message.error("Vui lòng chọn địa chỉ giao hàng!");
        return;
      }

      if (cartItems.length === 0) {
        message.error("Giỏ hàng trống!");
        return;
      }

      const finalOrderData = {
        address: selectedAddress.address,
        receiverName: selectedAddress.receiverName,
        receiverPhone: selectedAddress.receiverPhone,
        paymentMethod: paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // ✅ GỌI API TẠO ĐƠN HÀNG (dùng axiosClient, không cần headers thủ công)
      const response = await axiosClient.post("/orders", finalOrderData);

      if (response.data) {
        message.success("Đơn hàng đã được tạo thành công!");
        localStorage.removeItem("checkoutItems");

        // ✅ Nếu phương thức là COD → chuyển hướng sang trang thành công
        if (paymentMethod === "COD") {
          navigate(`/order-success/${response.data.txnRef}`);
        } else {
          // ✅ Nếu là VNPay → gọi API thanh toán
          await handleVNPayPayment(response.data.id, response.data.total);
        }
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      message.error(error?.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  // ✅ Thanh toán VNPay (dùng axiosClient)
  const handleVNPayPayment = async (orderId: number, amount: number) => {
    try {
      const res = await axiosClient.post("/vnpay/create_payment", {
        orderId,
        amount,
        orderInfo: `Thanh toán đơn hàng ${orderId}`,
        returnUrl: `${window.location.origin}/checkout`,
      });

      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        message.error("Không nhận được URL thanh toán VNPay!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi gọi VNPay:", error);
      message.error("Không thể kết nối VNPay!");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Thanh toán</h2>

      {/* Hiển thị danh sách sản phẩm */}
      <div className="checkout-products">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>
                {item.quantity} x {item.price.toLocaleString()} VND
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hiển thị địa chỉ giao hàng */}
      {selectedAddress && (
        <div className="checkout-address">
          <h4>Giao đến:</h4>
          <p>
            {selectedAddress.receiverName} - {selectedAddress.receiverPhone}
          </p>
          <p>{selectedAddress.address}</p>
        </div>
      )}

      {/* Chọn phương thức thanh toán */}
      <div className="checkout-payment">
        <h4>Phương thức thanh toán:</h4>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="VNPAY">VNPay</option>
        </select>
      </div>

      {/* Component thanh toán COD */}
      {paymentMethod === "COD" && (
        <CODPayment onCreateOrder={handleCreateOrder} />
      )}

      {/* Nút thanh toán VNPay */}
      {paymentMethod === "VNPAY" && (
        <button onClick={handleCreateOrder} className="vnpay-btn">
          Thanh toán với VNPay
        </button>
      )}
    </div>
  );
};

export default CheckoutPage;
