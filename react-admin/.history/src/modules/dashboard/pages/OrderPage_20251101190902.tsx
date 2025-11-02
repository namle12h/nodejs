// import { useEffect, useState } from "react";
// import {
//     Card,
//     Radio,
//     Input,
//     Button,
//     Modal,
//     Select,
//     InputNumber,
//     message,
// } from "antd";
// import {
//     CreditCardOutlined,
//     UserOutlined,
//     FileTextOutlined,
//     GiftOutlined,
//     PlusOutlined,
//     ShoppingCartOutlined,
//     DeleteOutlined,
// } from "@ant-design/icons";
// import { useLocation, useNavigate } from "react-router-dom";

// import { useServices } from "../../../shared/services/serviceApi";
// import { useProducts } from "../../../shared/services/productApi";
// import { useCreateInvoice } from "../../../shared/services/invoiceApi";
// import axios from "axios";

// // =====================
// // 1️⃣ Interface dữ liệu
// // =====================
// interface ServiceInfo {
//     id: number;
//     name: string;
//     price: number;
//     durationMin: number;
//     description?: string;
//     imageUrl?: string;
// }

// interface ProductInfo {
//     id: number;
//     name: string;
//     salePrice: number;
//     quantity: number;
// }

// interface AppointmentRecord {
//     id: number;
//     contactName: string;
//     contactEmail: string;
//     contactPhone: string;
//     status: string;
//     notes?: string;
//     startAt?: string;
//     endAt?: string;
//     serviceName: string;
//     staffName?: string;
//     roomName?: string;
//     // customerId?: number;
//     customer?: CustomerInfo;
//     service: ServiceInfo;
//     services?: ServiceInfo[];
//     products?: ProductInfo[];
// }

// interface CustomerInfo {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     role?: string;
// }
// // =====================
// // 2️⃣ Component chính
// // =====================
// const OrderPage = ({ orderData, onPaymentSuccess }: { orderData: AppointmentRecord, onPaymentSuccess: () => void }) => {
//     const [payment, setPayment] = useState("cash");
//     const handlePaymentChange = (e: any) => setPayment(e.target.value);
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Modal & chọn dịch vụ / sản phẩm
//     const [showServiceModal, setShowServiceModal] = useState(false);
//     const [showProductModal, setShowProductModal] = useState(false);
//     const [selectedService, setSelectedService] = useState<number | null>(null);
//     const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

//     const [quantity, setQuantity] = useState(1);

//     const [extraServices, setExtraServices] = useState<ServiceInfo[]>([]);
//     const [extraProducts, setExtraProducts] = useState<ProductInfo[]>([]);
//     // 💵 Số tiền khách đưa
//     const [amountPaid, setAmountPaid] = useState<number>(0);

//     // 📝 Ghi chú đặc biệt
//     const [notes, setNotes] = useState<string>("");

//     const serviceKey = `extra_services_${orderData?.id}`;
//     const productKey = `extra_products_${orderData?.id}`


//     const { data: serviceData } = useServices(1, 10);
//     const { data: productData } = useProducts(1, 10);
//     // const { mutate: createInvoice } = useCreateInvoice();
//     const { mutateAsync: createInvoice } = useCreateInvoice();
//     const serviceList = serviceData || [];
//     // const productList = productData || [];
//     const productList = productData?.content || [];

//     // 👉 Giá trị thanh toán (fix NaN)
//     const basePrice = Number(orderData?.service?.price ?? 0);

//     const extraServiceTotal = extraServices.reduce(
//         (sum, s) => sum + Number(s?.price ?? 0),
//         0
//     );

//     const extraProductTotal = extraProducts.reduce(
//         (sum, p) => sum + Number(p?.salePrice ?? p?.salePrice ?? 0) * Number(p?.quantity ?? 1),
//         0
//     );

//     const subtotal = basePrice + extraServiceTotal + extraProductTotal;
//     const vat = subtotal * 0.1;
//     const discount = 50000;
//     const total = subtotal + vat - discount;




//     // ✅ Load dữ liệu từ localStorage khi mở trang
//     useEffect(() => {
//         const savedServices = localStorage.getItem(serviceKey);
//         const savedProducts = localStorage.getItem(productKey);
//         if (savedServices) setExtraServices(JSON.parse(savedServices));
//         if (savedProducts) setExtraProducts(JSON.parse(savedProducts));
//     }, [serviceKey, productKey]);


//     // ✅ Xử lý kết quả trả về từ VNPay
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const responseCode = params.get("vnp_ResponseCode");
//         const transactionStatus = params.get("vnp_TransactionStatus");
//         const orderInfo = params.get("vnp_OrderInfo");
//         const txnRef = params.get("vnp_TxnRef");

//         if (responseCode && transactionStatus && orderInfo && txnRef) {
//             if (responseCode === "00" && transactionStatus === "00") {
//                 message.success("🎉 Thanh toán VNPay thành công!");

//                 // ✅ (tuỳ chọn) gọi API cập nhật hóa đơn
//                 // await updateInvoiceStatus(txnRef, "PAID");

//                 // Dọn dữ liệu tạm
//                 localStorage.removeItem(serviceKey);
//                 localStorage.removeItem(productKey);


//                 // ✅ Điều hướng về trang danh sách đơn hàng
//                 setTimeout(() => navigate("/orders"), 2000);
//             } else {
//                 message.error("❌ Thanh toán thất bại hoặc bị hủy!");
//                 setTimeout(() => navigate("/payment"), 2000);
//             }
//         }
//     }, [location.search, navigate]);

//     // ✅ Lưu vào localStorage mỗi khi thay đổi
//     useEffect(() => {
//         localStorage.setItem(serviceKey, JSON.stringify(extraServices));
//     }, [extraServices, serviceKey]);

//     useEffect(() => {
//         localStorage.setItem(productKey, JSON.stringify(extraProducts));
//     }, [extraProducts, productKey]);




//     const openAddServiceModal = () => setShowServiceModal(true);
//     const openAddProductModal = () => setShowProductModal(true);

//     const handleAddService = () => {
//         if (!selectedService) return message.error("Vui lòng chọn dịch vụ!");
//         const service = serviceList.find((s: any) => s.id === selectedService);
//         if (!service) return;

//         // ✅ kiểm tra trùng
//         if (extraServices.some((s) => s.id === service.id)) {
//             return message.warning("Dịch vụ này đã được thêm!");
//         }

//         setExtraServices((prev) => [...prev, service]);
//         message.success(`Đã thêm "${service.name}"`);
//         setShowServiceModal(false);
//     };



//     const handleAddProduct = () => {
//         if (!selectedProduct) return message.error("Vui lòng chọn sản phẩm!");
//         const product = productList.find((p: any) => p.id === selectedProduct);
//         if (!product) return;

//         const existing = extraProducts.find((p) => p.id === product.id);
//         if (existing) {
//             setExtraProducts((prev) =>
//                 prev.map((p) =>
//                     p.id === product.id
//                         ? { ...p, quantity: p.quantity + quantity }
//                         : p
//                 )
//             );
//         } else {
//             setExtraProducts((prev) => [...prev, { ...product, quantity }]);
//         }

//         message.success(`Đã thêm "${product.name}"`);
//         setShowProductModal(false);
//     };

//     const handleConfirmPayment = async () => {
//         try {
//             if (payment === "cash") {
//                 // ✅ Phải nhập số tiền
//                 if (!amountPaid || isNaN(amountPaid)) {
//                     message.error("Vui lòng nhập số tiền khách đưa!");
//                     return;
//                 }

//                 // ✅ Không được nhỏ hơn tổng hóa đơn
//                 if (amountPaid < total) {
//                     message.warning("Số tiền phải lớn hơn hoặc bằng tổng hóa đơn!");
//                     return;
//                 }
//             }
//             const payload = {
//                 appointmentId: orderData.id,
//                 customerId: orderData.customer?.id ?? "_",
//                 vat: 10,
//                 discountAmount: 50000,
//                 items: [
//                     { serviceId: orderData.service?.id, quantity: 1, unitPrice: orderData.service?.price },
//                     ...extraServices.map((s) => ({ serviceId: s.id, quantity: 1, unitPrice: s.price })),
//                     ...extraProducts.map((p) => ({
//                         productId: p.id,
//                         quantity: p.quantity,
//                         unitPrice: p.salePrice,
//                     })),
//                 ],
//                 paymentMethod: payment,
//                 amountPaid,
//                 notes,
//             };

//             console.log("🧾 Payload gửi backend:", payload);

//             // ✅ Bây giờ mutateAsync trả Promise
//             const res = await createInvoice(payload);

//             console.log("✅ Kết quả backend:", res);

//             // Nếu backend trả về URL thanh toán VNPay
//             if (res?.paymentUrl) {
//                 message.info("🔄 Đang chuyển hướng đến cổng thanh toán VNPay...");
//                 window.location.href = res.paymentUrl;
//                 return;
//             }

//             // Nếu không có VNPay (VD: thanh toán tiền mặt)
//             message.success("✅ Thanh toán thành công!");
//             localStorage.removeItem(serviceKey);
//             localStorage.removeItem(productKey);
//             if (onPaymentSuccess) onPaymentSuccess();
//         } catch (error: any) {
//             // ✅ Nếu lỗi từ backend là "PENDING:<txnRef>"
//             const msg =
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.response?.data ||
//                 error?.message ||
//                 "";
//             console.log("📦 error.response.data:", error?.response?.data);

//             if (msg.startsWith("PENDING:")) {
//                 const txnRef = msg.split(":")[1];

//                 Modal.confirm({
//                     title: "Hóa đơn đang chờ thanh toán",
//                     content: (
//                         <>
//                             <p>Đơn hàng này đã có hóa đơn đang ở trạng thái <b>PENDING</b>.</p>
//                             <p>Bạn có muốn tiếp tục thanh toán cho hóa đơn <b>{txnRef}</b> không?</p>
//                         </>
//                     ),
//                     okText: "Tiếp tục thanh toán",
//                     cancelText: "Đóng",
//                     onOk: async () => {
//                         try {
//                             // Gọi API lấy lại thông tin hóa đơn cũ
//                             const { data } = await axios.get(`http://localhost:8080/api/invoices/${txnRef}`);
//                             if (data?.txnRef) {
//                                 // Gọi lại BE để tạo lại URL thanh toán cho hóa đơn cũ
//                                 const res = await axios.get(`http://localhost:8080/create-payment?invoiceId=${data.id}`);
//                                 if (res.data) {
//                                     message.info("🔄 Đang chuyển hướng đến cổng thanh toán...");
//                                     window.location.href = res.data;
//                                 }
//                             }

//                             if (data?.paymentUrl) {
//                                 message.info("🔄 Đang chuyển hướng đến cổng thanh toán...");
//                                 window.location.href = data.paymentUrl;
//                             } else {
//                                 message.warning("Không tìm thấy đường dẫn thanh toán!");
//                             }
//                         } catch (e) {
//                             console.error(e);
//                             message.error("Không thể tải hóa đơn cũ!");
//                         }
//                     },
//                 });

//                 return;
//             }

//             // ⚠️ Nếu lỗi khác
//             message.error("Thanh toán thất bại! Vui lòng thử lại.");
//         }
//     };



//     return (
//         <div className="bg-green-50 p-6 font-sans">
//             {/* Grid chính chia 2 cột */}
//             <div className="grid md:grid-cols-2 gap-6">
//                 {/* ========== CỘT TRÁI ========== */}
//                 <div className="flex flex-col gap-6">
//                     {/* 🧾 Chi tiết đơn hàng */}
//                     <Card
//                         title={
//                             <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-blue-500 px-3 py-2 rounded-t-lg">
//                                 <FileTextOutlined /> Chi tiết đơn hàng
//                             </div>
//                         }
//                         className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
//                         bodyStyle={{ paddingTop: "1.5rem" }}
//                     >
//                         {/* Dịch vụ */}
//                         <ServiceItem
//                             name={orderData.service?.name}
//                             time={`${orderData.service?.durationMin} phút`}
//                             price={`${orderData.service?.price.toLocaleString()}đ`}
//                         />
//                         {/* ✅ Dịch vụ thêm tạm */}
//                         {extraServices.map((s) => (
//                             <div key={s.id} className="flex justify-between border-b py-2">
//                                 <span className="text-gray-700">{s.name}</span>
//                                 <span className="text-green-700 font-semibold">
//                                     {s.price.toLocaleString()}đ
//                                 </span>
//                                 <Button
//                                     type="text"
//                                     size="small"
//                                     icon={<DeleteOutlined />}
//                                     danger
//                                     onClick={() => {
//                                         setExtraServices((prev) => prev.filter((item) => item.id !== s.id));
//                                         message.info(`Đã xóa dịch vụ "${s.name}"`);
//                                     }}
//                                 />
//                             </div>
//                         ))}

//                         {/* ✅ Sản phẩm thêm tạm */}
//                         {extraProducts.map((p) => (
//                             <div key={p.id} className="flex justify-between border-b py-2">
//                                 <span className="text-gray-700">
//                                     {p.name} × {p.quantity}
//                                 </span>
//                                 <span className="text-green-700 font-semibold">
//                                     {(p.salePrice * p.quantity).toLocaleString()}đ
//                                 </span>
//                                 <Button
//                                     type="text"
//                                     size="small"
//                                     icon={<DeleteOutlined />}
//                                     danger
//                                     onClick={() => {
//                                         setExtraProducts((prev) => prev.filter((item) => item.id !== p.id));
//                                         message.info(`Đã xóa sản phẩm "${p.name}"`);
//                                     }}
//                                 />
//                             </div>
//                         ))}



//                         <div className="text-gray-600 mt-4 space-y-1">
//                             <p>Tạm tính: {basePrice.toLocaleString()}đ</p>
//                             <p>Thuế VAT (10%): {vat.toLocaleString()}đ</p>
//                             <p>Giảm giá: -{discount.toLocaleString()}đ</p>
//                         </div>

//                         <div className="bg-green-100 rounded-lg mt-3 p-3 flex justify-between font-bold text-green-800">
//                             <p>Tổng thanh toán:</p>
//                             <p>{total.toLocaleString()}đ</p>
//                         </div>

//                         {/* ✅ Thêm dịch vụ / sản phẩm */}
//                         <div className="flex gap-2 mt-3">
//                             <Button
//                                 icon={<PlusOutlined />}
//                                 onClick={openAddServiceModal}
//                                 className="border border-gray-300"
//                             >
//                                 Thêm dịch vụ
//                             </Button>
//                             <Button
//                                 icon={<ShoppingCartOutlined />}
//                                 onClick={openAddProductModal}
//                                 className="border border-gray-300"
//                             >
//                                 Thêm sản phẩm
//                             </Button>
//                         </div>
//                     </Card>

//                     {/* 👩‍🦰 Thông tin khách hàng */}
//                     <Card
//                         title={
//                             <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-green-500 to-teal-400 px-3 py-2 rounded-t-lg">
//                                 <UserOutlined /> Thông tin khách hàng
//                             </div>
//                         }
//                         className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
//                         bodyStyle={{ paddingTop: "1.5rem" }}
//                     >
//                         <div className="grid md:grid-cols-2 gap-4 mb-4">
//                             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
//                                 <p className="text-gray-500 text-sm">Tên khách hàng</p>
//                                 <p className="font-semibold text-gray-800">
//                                     {orderData.contactName}
//                                 </p>
//                             </div>
//                             <div className="bg-green-50 p-3 rounded-lg border border-green-100">
//                                 <p className="text-gray-500 text-sm">Số điện thoại</p>
//                                 <p className="font-semibold text-gray-800">
//                                     {orderData.contactPhone}
//                                 </p>
//                             </div>
//                             <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
//                                 <p className="text-gray-500 text-sm">Điểm tích lũy</p>
//                                 <p className="font-semibold text-yellow-800">2,450 điểm</p>
//                             </div>
//                             <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
//                                 <p className="text-gray-500 text-sm">Hạng thành viên</p>
//                                 <p className="font-semibold text-purple-700">VIP Gold</p>
//                             </div>
//                         </div>

//                         <div className="bg-green-50 rounded-xl border border-green-200 p-3 flex items-center gap-2 text-green-700 mt-2">
//                             <GiftOutlined className="text-green-600" />
//                             <p>
//                                 Ưu đãi áp dụng:{" "}
//                                 <span className="font-semibold">
//                                     Giảm {discount.toLocaleString()}đ
//                                 </span>{" "}
//                                 - Khách hàng VIP
//                             </p>
//                         </div>
//                     </Card>
//                 </div>

//                 {/* ========== CỘT PHẢI ========== */}
//                 <div className="flex flex-col gap-6">
//                     {/* 💳 PHƯƠNG THỨC THANH TOÁN */}
//                     <Card
//                         title={
//                             <div className="flex items-center gap-2 text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-t-lg">
//                                 <CreditCardOutlined /> Phương thức thanh toán
//                             </div>
//                         }
//                         className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
//                         bodyStyle={{ paddingTop: "1.5rem" }}
//                     >
//                         <div className="space-y-3">
//                             {["cash", "credit", "bank", "wallet", "qr"].map((method) => (
//                                 <div
//                                     key={method}
//                                     className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
//                                 >
//                                     <Radio
//                                         value={method}
//                                         checked={payment === method}
//                                         onChange={handlePaymentChange}
//                                     >
//                                         {method === "cash" && "💵 Tiền mặt"}

//                                         {method === "credit" && "💳 Thẻ tín dụng / Ghi nợ"}
//                                         {method === "bank" && "🏦 Chuyển khoản ngân hàng"}
//                                         {method === "wallet" &&
//                                             "📱 Ví điện tử (MoMo, ZaloPay, ShopeePay)"}
//                                         {method === "qr" && "🔳 Thanh toán QR Code"}
//                                     </Radio>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* <div className="mt-5">
//                             <label className="block text-gray-600 mb-1">
//                                 Số tiền khách đưa:
//                             </label>
//                             <Input
//                                 placeholder="Nhập số tiền..."
//                                 type="number"
//                                 prefix="₫"
//                                 className="shadow-sm"
//                                 value={amountPaid}
//                                 onChange={(e) => setAmountPaid(Number(e.target.value))}
//                             />
//                         </div> */}
//                         {payment === "cash" && (
//                             <div className="mt-5">
//                                 <label className="block text-gray-600 mb-1">
//                                     Số tiền khách đưa:
//                                 </label>
//                                 <Input
//                                     placeholder="Nhập số tiền..."
//                                     type="number"
//                                     prefix="₫"
//                                     className="shadow-sm"
//                                     value={amountPaid}
//                                     onChange={(e) => {
//                                         setAmountPaid(Number(e.target.value))
//                                     }}
//                                 />
//                             </div>
//                         )}

//                     </Card>

//                     {/* 📝 Ghi chú đặc biệt */}
//                     <Card
//                         title={
//                             <div className="flex items-center gap-2 text-gray-700 font-bold bg-gradient-to-r from-yellow-100 to-green-50 px-3 py-2 rounded-t-lg border-b border-gray-200">
//                                 📝 Ghi chú đặc biệt
//                             </div>
//                         }
//                         className="rounded-2xl shadow-md border border-gray-100 overflow-hidden"
//                         bodyStyle={{ paddingTop: "1.2rem" }}
//                     >
//                         <Input.TextArea
//                             rows={3}
//                             placeholder="Nhập ghi chú cho đơn hàng..."
//                             defaultValue={orderData?.notes || ""}
//                             className="rounded-lg shadow-sm border-gray-200 focus:ring-2 focus:ring-green-400"
//                             onChange={(e) => setNotes(e.target.value)}
//                         />
//                     </Card>

//                     {/* 🔘 Nút hành động */}
//                     <div className="mt-3 flex flex-col md:flex-row gap-3 justify-between items-center">
//                         <Button
//                             type="primary"
//                             className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
//                             onClick={handleConfirmPayment}
//                         >
//                             ✅ Xác nhận thanh toán
//                         </Button>

//                         <div className="flex gap-3">
//                             <Button className="border border-gray-300">🧾 In hóa đơn</Button>
//                             <Button className="border border-gray-300">📧 Gửi hóa đơn</Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal thêm dịch vụ */}
//             <Modal
//                 title="Thêm dịch vụ"
//                 open={showServiceModal}
//                 onCancel={() => setShowServiceModal(false)}
//                 onOk={handleAddService}
//             >
//                 <Select
//                     placeholder="Chọn dịch vụ"
//                     style={{ width: "100%" }}
//                     onChange={(v) => setSelectedService(v)}
//                 >
//                     {serviceList.map((s: any) => (
//                         <Select.Option key={s.id} value={s.id}>
//                             <div className="flex items-center gap-2">
//                                 <img src={s.imageUrl} alt={s.name} className="w-8 h-8 rounded" />
//                                 <span>
//                                     {s.name} - {s.price.toLocaleString()}đ
//                                 </span>
//                             </div>
//                         </Select.Option>
//                     ))}
//                 </Select>

//             </Modal>

//             {/* Modal thêm sản phẩm */}
//             <Modal
//                 title="Thêm sản phẩm"
//                 open={showProductModal}
//                 onCancel={() => setShowProductModal(false)}
//                 onOk={handleAddProduct}
//             >
//                 <Select
//                     placeholder="Chọn sản phẩm"
//                     style={{ width: "100%" }}
//                     onChange={(v) => setSelectedProduct(v)}
//                 >
//                     {productList.map((p: any) => (
//                         <Select.Option key={p.id} value={p.id}>
//                             <div className="flex items-center gap-2">
//                                 <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded" />
//                                 <span>
//                                     {p.name} - {(p.salePrice ?? 0).toLocaleString()}đ
//                                 </span>
//                             </div>
//                         </Select.Option>
//                     ))}


//                 </Select>
//                 <div className="mt-3">
//                     <p>Số lượng:</p>
//                     <InputNumber
//                         min={1}
//                         value={quantity}
//                         onChange={(val: any) => setQuantity(val)}
//                     />
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// // =====================
// // 3️⃣ Component con hiển thị dịch vụ
// // =====================
// const ServiceItem = ({
//     name,
//     time,
//     price,
// }: {
//     name: string;
//     time: string;
//     price: string;
// }) => (
//     <div className="flex justify-between items-start border-b pb-2">
//         <div>
//             <p className="font-semibold">{name}</p>
//             <p className="text-sm text-gray-500">Thời gian: {time}</p>
//         </div>
//         <p className="text-green-700 font-semibold">{price}</p>
//     </div>
// );

// export default OrderPage;

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Form, message, Modal } from "antd"; // 🆕 Thêm Modal
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import PaymentMethod from "../components/PaymentMethod";
import ShippingInfo from "../components/ShippingInfo";
import OrderSummary from "../components/OrderSummary";
import CODPayment from "../components/CODPayment";
import "@ant-design/v5-patch-for-react-19";
import Header from "../../../shared/components/Header";
import axios from "axios"; // 🆕 Import axios
import { useAuthStore } from "../stores/authStore"; // 👈 Dùng Zustand Store


// =====================
// 1️⃣ Interfaces & Hooks
// =====================
type Location = { id: number; full_name: string };
type CartItem = { id: number; name: string; price: number; quantity: number; image?: string };

// User Type lấy từ Zustand Store
type CheckoutUser = { 
    id?: number; 
    name?: string | null;
    email?: string | null; 
    phone?: string | null; 
};

const useCart = () => ({
    // Mock cart data
    cart: [
        { id: 1, name: "Sản phẩm A", price: 500000, quantity: 2, image: "/a.jpg" },
        { id: 2, name: "Sản phẩm B", price: 350000, quantity: 1, image: "/b.jpg" },
    ] as CartItem[],
    clearCart: () => { console.log("Cart cleared"); },
});


// =====================
// 2️⃣ Component Chính
// =====================
export default function CheckoutPage() {
    // ... (Các State cơ bản giữ nguyên)
    const [paymentMethod, setPaymentMethod] = useState<string>("card");
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountApplied, setDiscountApplied] = useState<boolean>(false);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [form] = Form.useForm();

    const [showCODPayment, setShowCODPayment] = useState<boolean>(false);

    // ✅ Contexts (Dùng Zustand Store)
    const { cart, clearCart } = useCart();
    const user = useAuthStore(state => state.user) as CheckoutUser | null; // 👈 Lấy user từ Zustand

    // Dữ liệu tạm cho COD Payment Modal
    const [orderDataForPayment, setOrderDataForPayment] = useState<any>(null); 
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

    // ✅ Địa chỉ
    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [communes, setCommunes] = useState<Location[]>([]);

    // ✅ Xác định client-side render
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 🆕 Xử lý kết quả trả về từ VNPay Callback
    useEffect(() => {
        if (!isClient) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get("vnp_ResponseCode");
        const vnpTransactionStatus = urlParams.get("vnp_TransactionStatus");
        const orderId = urlParams.get("vnp_TxnRef"); // Giả sử orderId là vnp_TxnRef
        
        if (orderId && vnpResponseCode !== null) {
            window.history.replaceState({}, document.title, window.location.pathname);

            if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
                message.success("🎉 Thanh toán VNPay thành công! Đang chuyển hướng...");
                clearCart();
                document.cookie = "paymentStatus=success; max-age=3600; path=/";
                
                setTimeout(() => {
                    window.location.href = `/order-success/${orderId}`;
                }, 2000);
            } else {
                message.error("❌ Thanh toán thất bại hoặc bị hủy!");
            }
        }
    }, [isClient, clearCart]);


    // ✅ Áp dụng mã giảm giá (giữ nguyên)
    const applyDiscount = () => {
        if (discountCode.trim() !== "") {
            setDiscountAmount(100000); 
            setDiscountApplied(true);
            message.success("Áp dụng mã giảm giá thành công!");
        } else {
            setDiscountAmount(0);
            setDiscountApplied(false);
            message.warning("Vui lòng nhập mã giảm giá hợp lệ.");
        }
    };

    // ✅ Helper: Lấy tên từ id location (giữ nguyên)
    const getLocationNameById = (list: Location[], id: number): string => {
        const item = list.find((loc) => loc.id === id);
        return item ? item.full_name : "";
    };
    
    // 🆕 Gọi API tạo thanh toán VNPay và xử lý redirect
    const createPaymentUrl = async (orderId: string, amount: number) => {
        try {
            message.info("🔄 Đang chuyển hướng đến cổng thanh toán VNPay...");
            // Giả lập cuộc gọi API để tạo URL VNPay
            const res = await axios.post(
                "http://localhost:8080/api/vnpay/create_payment", 
                {
                    orderId: orderId,
                    amount: amount,
                    orderInfo: `Thanh toan don hang ${orderId}`,
                    returnUrl: `${window.location.origin}/checkout`, 
                }
            );

            if (res.data?.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                message.error("Không lấy được link thanh toán VNPay. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error creating VNPay payment:", error);
            message.error("Lỗi kết nối đến cổng thanh toán.");
        }
    };


    // ✅ Gọi API tạo đơn hàng (đã điều chỉnh để trả về kết quả)
    const handleCreateOrder = async (finalOrderData: any, isCOD: boolean = false) => {
        setLoadingSubmit(true);
        try {
            // Sử dụng axios để gọi API, giúp dễ dàng bắt lỗi status và payload
            const response = await axios.post(
                `http://localhost:8080/api/orders`, 
                finalOrderData
            );

            const data = response.data;
            const orderId = data.id;

            if (isCOD) {
                message.success("Đặt hàng thành công! Đơn hàng sẽ được giao trong vài ngày.");
                clearCart();
                document.cookie = "paymentStatus=cod-pending; max-age=3600; path=/";

                setTimeout(() => {
                    window.location.href = `/order-success/${orderId}`;
                }, 3000);
            }
            return { success: true, orderId: orderId, data };

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;

            // 🆕 Logic xử lý lỗi PENDING tương tự OrderPage.tsx
            if (errorMsg.startsWith("PENDING:")) {
                const txnRef = errorMsg.split(":")[1];
                
                Modal.confirm({
                    title: "Đơn hàng đang chờ thanh toán",
                    content: (
                        <>
                            <p>Đơn hàng này đã có hóa đơn đang ở trạng thái <b>PENDING</b>.</p>
                            <p>Bạn có muốn tiếp tục thanh toán cho hóa đơn <b>{txnRef}</b> không?</p>
                        </>
                    ),
                    okText: "Tiếp tục thanh toán",
                    cancelText: "Đóng",
                    onOk: async () => {
                        try {
                            // Gọi lại BE để lấy lại URL thanh toán cho hóa đơn cũ
                            const res = await axios.get(`http://localhost:8080/api/vnpay/recreate_payment_url?txnRef=${txnRef}`);
                            if (res.data?.paymentUrl) {
                                message.info("🔄 Đang chuyển hướng đến cổng thanh toán...");
                                window.location.href = res.data.paymentUrl;
                            } else {
                                message.warning("Không tìm thấy đường dẫn thanh toán!");
                            }
                        } catch (e) {
                            console.error(e);
                            message.error("Không thể tải hóa đơn cũ!");
                        }
                    },
                });

                return { success: false, error: error };
            }
            
            // Lỗi chung
            console.error("Error creating order:", errorMsg);
            message.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
            return { success: false, error: error };
        } finally {
            setLoadingSubmit(false); 
        }
    };


    // ✅ Tính toán giá tiền (giữ nguyên)
    const originalPrice = (cart || []).reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
    );
    const shippingFee = 30000;
    const totalBeforeDiscount = originalPrice + shippingFee;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;

    // ✅ Submit form thanh toán (Đã cập nhật logic)
    const handleSubmit = () => {
        if (!cart || cart.length === 0) {
            message.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
            return;
        }

        form
            .validateFields()
            .then(async (values) => { 
                
                const cityName = getLocationNameById(cities, values.city);
                const districtName = getLocationNameById(districts, values.district);
                const communeName = getLocationNameById(communes, values.commune);
                
                const orderData = {
                    ...values,
                    city_name: cityName,
                    district_name: districtName,
                    commune_name: communeName,
                    userid: user?.id,
                    userfullname: user?.name,
                    paymentMethod: paymentMethod,
                    status: "pending", // Trạng thái ban đầu
                    orderItems: (cart || []).map((item: CartItem) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        pricePerUnit: item.price,
                        name: item.name,
                        imageUrl: item.image,
                    })),
                    totalAmount: totalAfterDiscount,
                    discountAmount: discountAmount,
                    orderDate: new Date().toISOString(),
                };

                // 1. Xử lý COD (Tiền mặt)
                if (paymentMethod === "cod" || paymentMethod === "receive") {
                    setOrderDataForPayment(orderData);
                    setShowCODPayment(true); 
                }
                // 2. Xử lý Thanh toán qua cổng (Card/VNPay/Wallet)
                else {
                    setLoadingSubmit(true);
                    // B1: Tạo đơn hàng trên Backend
                    const result = await handleCreateOrder(orderData, false);
                    // setLoadingSubmit(false) được gọi trong handleCreateOrder

                    if (result.success && result.orderId) {
                        // B2: Tạo link thanh toán VNPay và redirect
                        await createPaymentUrl(result.orderId, totalAfterDiscount);
                    }
                }

            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
                message.error("Vui lòng điền đầy đủ và chính xác thông tin nhận hàng.");
            });
    };

    // ✅ Render client (giữ nguyên)
    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto pt-20 px-4 py-8">
                <Form form={form} layout="vertical">
                    <div className="flex flex-wrap -mx-4">
                        {/* LEFT */}
                        <div className="w-full lg:w-2/3 px-4 mb-8">
                            <PaymentMethod
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                            />
                            <ShippingInfo
                                form={form}
                                user={user} // 👈 User từ Zustand
                                cities={cities}
                                setCities={setCities}
                                districts={districts}
                                setDistricts={setDistricts}
                                communes={communes}
                                setCommunes={setCommunes}
                            />
                        </div>

                        {/* RIGHT */}
                        <div className="w-full lg:w-1/3 px-4">
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <OrderSummary
                                    orderItems={cart}
                                    originalPrice={originalPrice}
                                    shippingFee={shippingFee}
                                    discountCode={discountCode}
                                    applyDiscount={applyDiscount}
                                    setDiscountCode={setDiscountCode}
                                    discountApplied={discountApplied}
                                    discountAmount={discountAmount}
                                    totalAfterDiscount={totalAfterDiscount}
                                />
                            </div>

                            <div className="flex flex-col space-y-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="!rounded-button bg-blue-500 h-12 whitespace-nowrap"
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleSubmit}
                                    loading={loadingSubmit}
                                >
                                    Hoàn tất thanh toán
                                </Button>

                                <Button
                                    type="default"
                                    size="large"
                                    className="!rounded-button whitespace-nowrap"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => window.history.back()}
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>


            {/* CODPayment Modal */}
            {showCODPayment && orderDataForPayment && (
                <CODPayment
                    totalAfterDiscount={totalAfterDiscount}
                    onCancel={() => setShowCODPayment(false)}
                    orderData={orderDataForPayment}
                    // Hàm handleCreateOrder sẽ được gọi với isCOD=true bên trong CODPayment
                    onCreateOrder={(data: any) => handleCreateOrder(data, true)} 
                />
            )}
        </div>
    );
}