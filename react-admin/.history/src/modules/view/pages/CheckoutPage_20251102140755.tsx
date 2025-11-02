import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "../../../shared/services/orderApi";
import CODPayment from "./CO

const CheckoutPage = () => {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [loading, setLoading] = useState(false);

  // ✅ Lấy dữ liệu giỏ hàng và địa chỉ từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("checkoutItems");
    const savedAddress = localStorage.getItem("selectedAddress");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedAddress) setSelectedAddress(JSON.parse(savedAddress));
  }, []);

  // ✅ Tổng tiền
  const totalAfterDiscount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Gọi API tạo đơn hàng
  const handleCreateOrder = async (orderData: any, isCOD: boolean) => {
    try {
      setLoading(true);

      const payload = {
        address: selectedAddress?.address,
        receiverName: selectedAddress?.receiverName,
        receiverPhone: selectedAddress?.receiverPhone,
        paymentMethod: orderData.paymentMethod || paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await createOrderMutation.mutateAsync(payload);

      // ✅ Nếu thành công
      if (res) {
        localStorage.removeItem("checkoutItems");

        // COD → chuyển hướng trang success
        if (isCOD || payload.paymentMethod === "COD") {
          message.success("Đặt hàng thành công!");
          navigate(`/order-success/${res.txnRef}`);
        }
        // VNPay → chuyển hướng đến URL thanh toán
        else if (payload.paymentMethod === "VNPAY" && res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          message.warning("Không tìm thấy URL thanh toán VNPay!");
        }

        return { success: true, orderId: res.id, data: res };
      }

      return { success: false, error: "Không nhận được phản hồi từ máy chủ." };
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      message.error(error?.response?.data?.message || "Đặt hàng thất bại!");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return <p className="text-center mt-8">Không có sản phẩm trong giỏ hàng.</p>;
  }

  return (
    <div className="checkout-container p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>

      {loading && (
        <div className="text-center my-4">
          <Spin size="large" />
        </div>
      )}

      {/* Hiển thị danh sách sản phẩm */}
      <div className="checkout-products border rounded-lg p-4 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center border-b py-2">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">
                {item.quantity} x {item.price.toLocaleString()} VND
              </p>
            </div>
          </div>
        ))}
        <p className="mt-4 font-bold text-right text-lg">
          Tổng cộng: {totalAfterDiscount.toLocaleString()} VND
        </p>
      </div>

      {/* Địa chỉ giao hàng */}
      {selectedAddress && (
        <div className="checkout-address border rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-1">Giao đến:</h4>
          <p>
            {selectedAddress.receiverName} - {selectedAddress.receiverPhone}
          </p>
          <p className="text-gray-600">{selectedAddress.address}</p>
        </div>
      )}

      {/* Chọn phương thức thanh toán */}
      <div className="checkout-payment border rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-2">Phương thức thanh toán:</h4>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="VNPAY">VNPay</option>
        </select>
      </div>

      {/* COD Payment Modal */}
      {paymentMethod === "COD" && (
        <CODPayment
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => navigate(-1)}
          orderData={{
            paymentMethod: "COD",
            totalAmount: totalAfterDiscount,
          }}
          onCreateOrder={handleCreateOrder}
        />
      )}

      {/* VNPay Button */}
      {paymentMethod === "VNPAY" && (
        <button
          onClick={() =>
            handleCreateOrder(
              { paymentMethod: "VNPAY", totalAmount: totalAfterDiscount },
              false
            )
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Thanh toán với VNPay
        </button>
      )}
    </div>
  );
};

export default CheckoutPage;
