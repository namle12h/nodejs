import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
  Input,
  Button,
  Modal,
  Select,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import {
  CreditCardOutlined,
  UserOutlined,
  FileTextOutlined,
  GiftOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useServices } from "../../../shared/services/serviceApi";

// =====================
// 1️⃣ Interface dữ liệu
// =====================
interface ServiceInfo {
  id: number;
  name: string;
  price: number;
  durationMin: number;
  description?: string;
  imageUrl?: string;
}

interface ProductInfo {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface AppointmentRecord {
  id: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  notes?: string;
  startAt?: string;
  endAt?: string;
  serviceName: string;
  staffName?: string;
  roomName?: string;
  service: ServiceInfo;
  services?: ServiceInfo[];
  products?: ProductInfo[];
}

// =====================
// 2️⃣ Component chính
// =====================
const OrderPage = ({ orderData }: { orderData: AppointmentRecord }) => {
  const [payment, setPayment] = useState("cash");
  const handlePaymentChange = (e: any) => setPayment(e.target.value);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ✅ Danh sách tạm (được lưu localStorage)
  const [extraServices, setExtraServices] = useState<ServiceInfo[]>([]);
  const [extraProducts, setExtraProducts] = useState<ProductInfo[]>([]);

  // Lấy danh sách dịch vụ từ API
  const { data: serviceData } = useServices(1, 10);
  const serviceList = serviceData || [];

  const productList = [
    { id: 10, name: "Tinh dầu hoa nhài", price: 180000 },
    { id: 11, name: "Mặt nạ dưỡng da", price: 60000 },
    { id: 12, name: "Dầu gội thảo mộc", price: 90000 },
  ];

  // ✅ Load dữ liệu tạm khi mở trang
  useEffect(() => {
    const storedServices = localStorage.getItem("extra_services");
    const storedProducts = localStorage.getItem("extra_products");
    if (storedServices) setExtraServices(JSON.parse(storedServices));
    if (storedProducts) setExtraProducts(JSON.parse(storedProducts));
  }, []);

  // ✅ Lưu vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("extra_services", JSON.stringify(extraServices));
  }, [extraServices]);
  useEffect(() => {
    localStorage.setItem("extra_products", JSON.stringify(extraProducts));
  }, [extraProducts]);

  // ======================
  // 💆 Thêm dịch vụ
  // ======================
  const handleAddService = () => {
    if (!selectedService) return message.error("Vui lòng chọn dịch vụ!");
    const service = serviceList.find((s: any) => s.id === selectedService);
    if (!service) return;

    if (extraServices.some((s) => s.id === service.id)) {
      message.warning("Dịch vụ này đã được thêm!");
      return;
    }

    setExtraServices((prev) => [...prev, service]);
    message.success(`Đã thêm "${service.name}"`);
    setShowServiceModal(false);
  };

  // ======================
  // 🧴 Thêm sản phẩm
  // ======================
  const handleAddProduct = () => {
    if (!selectedProduct) return message.error("Vui lòng chọn sản phẩm!");
    const product = productList.find((p) => p.id === selectedProduct);
    if (!product) return;

    const exists = extraProducts.find((p) => p.id === product.id);
    if (exists) {
      setExtraProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    } else {
      setExtraProducts((prev) => [...prev, { ...product, quantity }]);
    }

    message.success(`Đã thêm "${product.name}"`);
    setShowProductModal(false);
  };

  // ======================
  // ❌ Xóa dịch vụ / sản phẩm
  // ======================
  const removeService = (id: number) => {
    setExtraServices(extraServices.filter((s) => s.id !== id));
  };
  const removeProduct = (id: number) => {
    setExtraProducts(extraProducts.filter((p) => p.id !== id));
  };

  // ======================
  // 💰 Tổng tiền
  // ======================
  const basePrice = orderData?.service?.price || 0;
  const extraServiceTotal = extraServices.reduce((sum, s) => sum + s.price, 0);
  const extraProductTotal = extraProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const subtotal = basePrice + extraServiceTotal + extraProductTotal;
  const vat = subtotal * 0.1;
  const discount = 50000;
  const total = subtotal + vat - discount;

  // ======================
  // ✅ Xác nhận thanh toán
  // ======================
  const handleConfirmPayment = () => {
    const order = {
      baseService: orderData.service,
      extraServices,
      extraProducts,
      total,
      paymentMethod: payment,
    };
    console.log("🧾 Dữ liệu thanh toán gửi backend:", order);
    message.success("Thanh toán thành công (demo)");
    localStorage.removeItem("extra_services");
    localStorage.removeItem("extra_products");
  };

  return (
    <div className="bg-green-50 p-6 font-sans">
      <div className="grid md:grid-cols-2 gap-6">
        {/* ========== CỘT TRÁI ========== */}
        <div className="flex flex-col gap-6">
          {/* 🧾 Chi tiết đơn hàng */}
          <Card
            title={
              <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-blue-500 px-3 py-2 rounded-t-lg">
                <FileTextOutlined /> Chi tiết đơn hàng
              </div>
            }
            className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            bodyStyle={{ paddingTop: "1.5rem" }}
          >
            {/* Dịch vụ chính */}
            <ServiceItem
              name={orderData.service?.name}
              time={`${orderData.service?.durationMin} phút`}
              price={`${orderData.service?.price.toLocaleString()}đ`}
            />

            {/* Dịch vụ thêm */}
            {extraServices.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-gray-500">
                    Thời gian: {s.durationMin} phút
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-green-700 font-semibold">
                    {s.price.toLocaleString()}đ
                  </p>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeService(s.id)}
                  />
                </div>
              </div>
            ))}

            {/* Sản phẩm thêm */}
            {extraProducts.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    SL: {p.quantity} × {p.price.toLocaleString()}đ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-green-700 font-semibold">
                    {(p.price * p.quantity).toLocaleString()}đ
                  </p>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeProduct(p.id)}
                  />
                </div>
              </div>
            ))}

            {/* Tổng tiền */}
            <div className="text-gray-600 mt-4 space-y-1">
              <p>Tạm tính: {subtotal.toLocaleString()}đ</p>
              <p>Thuế VAT (10%): {vat.toLocaleString()}đ</p>
              <p>Giảm giá: -{discount.toLocaleString()}đ</p>
            </div>

            <div className="bg-green-100 rounded-lg mt-3 p-3 flex justify-between font-bold text-green-800">
              <p>Tổng thanh toán:</p>
              <p>{total.toLocaleString()}đ</p>
            </div>

            {/* Nút thêm */}
            <div className="flex gap-2 mt-3">
              <Button
                icon={<PlusOutlined />}
                onClick={() => setShowServiceModal(true)}
                className="border border-gray-300"
              >
                Thêm dịch vụ
              </Button>
              <Button
                icon={<ShoppingCartOutlined />}
                onClick={() => setShowProductModal(true)}
                className="border border-gray-300"
              >
                Thêm sản phẩm
              </Button>
            </div>
          </Card>

          {/* 👩‍🦰 Thông tin khách hàng */}
          <Card
            title={
              <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-teal-400 px-3 py-2 rounded-t-lg">
                <UserOutlined /> Thông tin khách hàng
              </div>
            }
            className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <p className="font-semibold">Tên: {orderData.contactName}</p>
            <p>SĐT: {orderData.contactPhone}</p>
            <p className="mt-2 text-green-700">
              Ưu đãi VIP: Giảm {discount.toLocaleString()}đ
            </p>
          </Card>
        </div>

        {/* ========== CỘT PHẢI ========== */}
        <div className="flex flex-col gap-6">
          {/* 💳 PHƯƠNG THỨC THANH TOÁN */}
          <Card
            title={
              <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-t-lg">
                <CreditCardOutlined /> Phương thức thanh toán
              </div>
            }
          >
            <div className="space-y-3">
              {["cash", "credit", "bank", "wallet", "qr"].map((method) => (
                <div key={method}>
                  <Radio
                    value={method}
                    checked={payment === method}
                    onChange={handlePaymentChange}
                  >
                    {method === "cash" && "💵 Tiền mặt"}
                    {method === "credit" && "💳 Thẻ tín dụng / Ghi nợ"}
                    {method === "bank" && "🏦 Chuyển khoản ngân hàng"}
                    {method === "wallet" &&
                      "📱 Ví điện tử (MoMo, ZaloPay, ShopeePay)"}
                    {method === "qr" && "🔳 QR Code"}
                  </Radio>
                </div>
              ))}
            </div>
          </Card>

          {/* 🔘 Nút hành động */}
          <Button
            type="primary"
            onClick={handleConfirmPayment}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            ✅ Xác nhận thanh toán
          </Button>
        </div>
      </div>

      {/* Modal thêm dịch vụ */}
      <Modal
        title="Thêm dịch vụ"
        open={showServiceModal}
        onCancel={() => setShowServiceModal(false)}
        onOk={handleAddService}
      >
        <Select
          placeholder="Chọn dịch vụ"
          style={{ width: "100%" }}
          onChange={(v) => setSelectedService(v)}
        >
          {serviceList.map((s: any) => (
            <Select.Option key={s.id} value={s.id}>
              {s.name} - {s.price.toLocaleString()}đ
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm"
        open={showProductModal}
        onCancel={() => setShowProductModal(false)}
        onOk={handleAddProduct}
      >
        <Select
          placeholder="Chọn sản phẩm"
          style={{ width: "100%" }}
          onChange={(v) => setSelectedProduct(v)}
        >
          {productList.map((p) => (
            <Select.Option key={p.id} value={p.id}>
              {p.name} - {p.price.toLocaleString()}đ
            </Select.Option>
          ))}
        </Select>
        <div className="mt-3">
          <p>Số lượng:</p>
          <InputNumber min={1} value={quantity} onChange={setQuantity} />
        </div>
      </Modal>
    </div>
  );
};

// =====================
// 3️⃣ Component con hiển thị dịch vụ
// =====================
const ServiceItem = ({
  name,
  time,
  price,
}: {
  name: string;
  time: string;
  price: string;
}) => (
  <div className="flex justify-between items-start border-b pb-2">
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">Thời gian: {time}</p>
    </div>
    <p className="text-green-700 font-semibold">{price}</p>
  </div>
);

export default OrderPage;
