import React, { useEffect, useState } from "react";
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
} from "@ant-design/icons";
import { useServices } from "../../../shared/services/serviceApi";
import { useProducts } from "../../../shared/services/productApi";

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

    // Modal & chọn dịch vụ / sản phẩm
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const [quantity, setQuantity] = useState(1);

    const [extraServices, setExtraServices] = useState<ServiceInfo[]>([]);
    const [extraProducts, setExtraProducts] = useState<ProductInfo[]>([]);

    const { data: serviceData} = useServices(1, 10);
    const { data: productData} = useProducts(1, 10);
    const serviceList = serviceData || [];
    const productList = productData || [];
    // 👉 Giá trị thanh toán
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



    // ✅ Load dữ liệu từ localStorage khi mở trang
    useEffect(() => {
        const savedServices = localStorage.getItem("extra_services");
        const savedProducts = localStorage.getItem("extra_products");
        if (savedServices) setExtraServices(JSON.parse(savedServices));
        if (savedProducts) setExtraProducts(JSON.parse(savedProducts));
    }, []);

    // ✅ Lưu vào localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem("extra_services", JSON.stringify(extraServices));
    }, [extraServices]);

    useEffect(() => {
        localStorage.setItem("extra_products", JSON.stringify(extraProducts));
    }, [extraProducts]);

 

    const openAddServiceModal = () => setShowServiceModal(true);
    const openAddProductModal = () => setShowProductModal(true);

    const handleAddService = () => {
        if (!selectedService) return message.error("Vui lòng chọn dịch vụ!");
        const service = serviceList.find((s: any) => s.id === selectedService);
        if (!service) return;

        // ✅ kiểm tra trùng
        if (extraServices.some((s) => s.id === service.id)) {
            return message.warning("Dịch vụ này đã được thêm!");
        }

        setExtraServices((prev) => [...prev, service]);
        message.success(`Đã thêm "${service.name}"`);
        setShowServiceModal(false);
    };



    const handleAddProduct = () => {
        if (!selectedProduct) return message.error("Vui lòng chọn sản phẩm!");
        const product = productList.find((p:any) => p.id === selectedProduct);
        if (!product) return;

        const existing = extraProducts.find((p) => p.id === product.id);
        if (existing) {
            setExtraProducts((prev) =>
                prev.map((p) =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                )
            );
        } else {
            setExtraProducts((prev) => [...prev, { ...product, quantity }]);
        }

        message.success(`Đã thêm "${product.name}"`);
        setShowProductModal(false);
    };

    return (
        <div className="bg-green-50 p-6 font-sans">
            {/* Grid chính chia 2 cột */}
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
                        {/* Dịch vụ */}
                        <ServiceItem
                            name={orderData.service?.name}
                            time={`${orderData.service?.durationMin} phút`}
                            price={`${orderData.service?.price.toLocaleString()}đ`}
                        />
                        {/* ✅ Dịch vụ thêm tạm */}
                        {extraServices.map((s) => (
                            <div key={s.id} className="flex justify-between border-b py-2">
                                <span className="text-gray-700">{s.name}</span>
                                <span className="text-green-700 font-semibold">
                                    {s.price.toLocaleString()}đ
                                </span>
                            </div>
                        ))}

                      {/* ✅ Sản phẩm thêm tạm */}
{extraProducts.map((p) => (
  <div key={p.id} className="flex justify-between border-b py-2">
    <span className="text-gray-700">
      {p.name} × {p.quantity}
    </span>
    <span className="text-green-700 font-semibold">
      {(p.price * p.quantity).toLocaleString()}đ
    </span>
  </div>
))}



                        <div className="text-gray-600 mt-4 space-y-1">
                            <p>Tạm tính: {basePrice.toLocaleString()}đ</p>
                            <p>Thuế VAT (10%): {vat.toLocaleString()}đ</p>
                            <p>Giảm giá: -{discount.toLocaleString()}đ</p>
                        </div>

                        <div className="bg-green-100 rounded-lg mt-3 p-3 flex justify-between font-bold text-green-800">
                            <p>Tổng thanh toán:</p>
                            <p>{total.toLocaleString()}đ</p>
                        </div>

                        {/* ✅ Thêm dịch vụ / sản phẩm */}
                        <div className="flex gap-2 mt-3">
                            <Button
                                icon={<PlusOutlined />}
                                onClick={openAddServiceModal}
                                className="border border-gray-300"
                            >
                                Thêm dịch vụ
                            </Button>
                            <Button
                                icon={<ShoppingCartOutlined />}
                                onClick={openAddProductModal}
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
                        bodyStyle={{ paddingTop: "1.5rem" }}
                    >
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-gray-500 text-sm">Tên khách hàng</p>
                                <p className="font-semibold text-gray-800">
                                    {orderData.contactName}
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <p className="text-gray-500 text-sm">Số điện thoại</p>
                                <p className="font-semibold text-gray-800">
                                    {orderData.contactPhone}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <p className="text-gray-500 text-sm">Điểm tích lũy</p>
                                <p className="font-semibold text-yellow-800">2,450 điểm</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <p className="text-gray-500 text-sm">Hạng thành viên</p>
                                <p className="font-semibold text-purple-700">VIP Gold</p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl border border-green-200 p-3 flex items-center gap-2 text-green-700 mt-2">
                            <GiftOutlined className="text-green-600" />
                            <p>
                                Ưu đãi áp dụng:{" "}
                                <span className="font-semibold">
                                    Giảm {discount.toLocaleString()}đ
                                </span>{" "}
                                - Khách hàng VIP
                            </p>
                        </div>
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
                        className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                        bodyStyle={{ paddingTop: "1.5rem" }}
                    >
                        <div className="space-y-3">
                            {["cash", "credit", "bank", "wallet", "qr"].map((method) => (
                                <div
                                    key={method}
                                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
                                >
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
                                        {method === "qr" && "🔳 Thanh toán QR Code"}
                                    </Radio>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5">
                            <label className="block text-gray-600 mb-1">
                                Số tiền khách đưa:
                            </label>
                            <Input
                                placeholder="Nhập số tiền..."
                                type="number"
                                prefix="₫"
                                className="shadow-sm"
                            />
                        </div>
                    </Card>

                    {/* 📝 Ghi chú đặc biệt */}
                    <Card
                        title={
                            <div className="flex items-center gap-2 text-gray-700 font-bold bg-gradient-to-r from-yellow-100 to-green-50 px-3 py-2 rounded-t-lg border-b border-gray-200">
                                📝 Ghi chú đặc biệt
                            </div>
                        }
                        className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                        bodyStyle={{ paddingTop: "1.2rem" }}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập ghi chú cho đơn hàng..."
                            defaultValue={orderData?.notes || ""}
                            className="rounded-lg shadow-sm border-gray-200 focus:ring-2 focus:ring-green-400"
                        />
                    </Card>

                    {/* 🔘 Nút hành động */}
                    <div className="mt-3 flex flex-col md:flex-row gap-3 justify-between items-center">
                        <Button
                            type="primary"
                            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                        >
                            ✅ Xác nhận thanh toán
                        </Button>

                        <div className="flex gap-3">
                            <Button className="border border-gray-300">🧾 In hóa đơn</Button>
                            <Button className="border border-gray-300">📧 Gửi hóa đơn</Button>
                        </div>
                    </div>
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
                            <div className="flex items-center gap-2">
                                <img src={s.imageUrl} alt={s.name} className="w-8 h-8 rounded" />
                                <span>
                                    {s.name} - {s.price.toLocaleString()}đ
                                </span>
                            </div>
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
                   {(productList?.content || productList || []).map((p: any) => (
    <Select.Option key={p.id} value={p.id}>
        {p.name} - {p.price.toLocaleString()}đ
    </Select.Option>
))}

                </Select>
                <div className="mt-3">
                    <p>Số lượng:</p>
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(val: any) => setQuantity(val)}
                    />
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
