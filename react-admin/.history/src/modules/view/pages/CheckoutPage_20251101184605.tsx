// // ...existing code...
// import { useState, useEffect } from "react";
// import { Button, Form, message } from "antd";
// import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import PaymentMethod from "../components/PaymentMethod";
// import ShippingInfo from "../components/ShippingInfo";
// import OrderSummary from "../components/OrderSummary";
// import CODPayment from "../components/CODPayment";
// import "@ant-design/v5-patch-for-react-19";
// import Header from "../../../shared/components/Header";

// type Location = { id: number; full_name: string };
// type CartItem = { id: number; name: string; price: number; quantity: number; image?: string };
// type User = { id?: number; name?: string | null };


// const useCart = () => ({
//     cart: [] as CartItem[],
//     clearCart: () => { },
// });
// const useAuth = () => ({
//     user: null as User | null,
// });

// export default function CheckoutPage() {
//     // ✅ State cơ bản
//     const [paymentMethod, setPaymentMethod] = useState<string>("card");
//     const [discountCode, setDiscountCode] = useState<string>("");
//     const [discountApplied, setDiscountApplied] = useState<boolean>(false);
//     const [discountAmount, setDiscountAmount] = useState<number>(0);
//     const [isClient, setIsClient] = useState<boolean>(false);
//     const [form] = Form.useForm();

//     const [showCODPayment, setShowCODPayment] = useState<boolean>(false);

//     // ✅ Contexts (thay bằng hook thực tế nếu có)
//     const { cart, clearCart } = useCart();
//     const { user } = useAuth();

//     const [orderIdFromServer, setOrderIdFromServer] = useState<string | null>(null);
//     const [orderDataForPayment, setOrderDataForPayment] = useState<any>(null);
//     const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

//     // ✅ Địa chỉ
//     const [cities, setCities] = useState<Location[]>([]);
//     const [districts, setDistricts] = useState<Location[]>([]);
//     const [communes, setCommunes] = useState<Location[]>([]);

//     // ✅ Xác định client-side render
//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     // ✅ Áp dụng mã giảm giá
//     const applyDiscount = () => {
//         if (discountCode.trim() !== "") {
//             setDiscountAmount(100000); // Giảm 100k ví dụ
//             setDiscountApplied(true);
//             message.success("Áp dụng mã giảm giá thành công!");
//         } else {
//             message.warning("Vui lòng nhập mã giảm giá hợp lệ.");
//         }
//     };

//     // ✅ Helper: Lấy tên từ id location
//     const getLocationNameById = (list: Location[], id: number): string => {
//         const item = list.find((loc) => loc.id === id);
//         return item ? item.full_name : "";
//     };

//     // ✅ Gọi API tạo đơn hàng
//     const handleCreateOrder = async (finalOrderData: any) => {
//         setLoadingSubmit(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:8080/api/products`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(finalOrderData),
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 message.success("Đặt hàng thành công!");
//                 setOrderIdFromServer(data.id);
//                 clearCart();
//                 document.cookie = "paymentStatus=success; max-age=3600; path=/";

//                 // Điều hướng sau 3s
//                 setTimeout(() => {
//                     window.location.href = `/order-success/${data.id}`;
//                 }, 3000);
//             } else {
//                 const errorData = await response.json();
//                 console.error("Failed to create order:", errorData);
//                 message.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
//             }
//         } catch (error: any) {
//             console.error("Error creating order:", error?.message || error);
//             message.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
//         } finally {
//             setLoadingSubmit(false);
     
//             setShowCODPayment(false);
//         }
//     };

//     // ✅ Tính toán giá tiền
//     const originalPrice = (cart || []).reduce(
//         (total: number, item: CartItem) => total + item.price * item.quantity,
//         0
//     );
//     const shippingFee = 30000;
//     const totalBeforeDiscount = originalPrice + shippingFee;
//     const totalAfterDiscount = totalBeforeDiscount - discountAmount;

//     // ✅ Submit form thanh toán
//     const handleSubmit = () => {
//         if (!cart || cart.length === 0) {
//             message.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
//             return;
//         }

//         form
//             .validateFields()
//             .then((values) => {
//                 const cityName = getLocationNameById(cities, values.city);
//                 const districtName = getLocationNameById(districts, values.district);
//                 const communeName = getLocationNameById(communes, values.commune);
//                 const statuses = ["pending", "confirmed", "shipping", "delivered"];
//                 const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

//                 const orderData = {
//                     ...values,
//                     city_name: cityName,
//                     district_name: districtName,
//                     commune_name: communeName,
//                     userid: user?.id,
//                     userfullname: user?.name,
//                     paymentMethod: paymentMethod,
//                     status: randomStatus,
//                     orderItems: (cart || []).map((item: CartItem) => ({
//                         productId: item.id,
//                         quantity: item.quantity,
//                         pricePerUnit: item.price,
//                         name: item.name,
//                         imageUrl: item.image,
//                     })),
//                     totalAmount: totalAfterDiscount,
//                     discountAmount: discountAmount,
//                     orderDate: new Date().toISOString(),
//                 };

//                 setOrderDataForPayment(orderData);
//                 if (paymentMethod === "cod") {
//                     setShowCODPayment(true);
//                 }
//             })
//             .catch((errorInfo) => {
//                 console.log("Validation Failed:", errorInfo);
//             });
//     };

//     // ✅ Render client
//     if (!isClient) return <div>Loading...</div>;

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header />
//             <div className="container mx-auto pt-20 px-4 py-8">
//                 <Form form={form} layout="vertical">
//                     <div className="flex flex-wrap -mx-4">
//                         {/* LEFT */}
//                         <div className="w-full lg:w-2/3 px-4 mb-8">
//                             <PaymentMethod
//                                 paymentMethod={paymentMethod}
//                                 setPaymentMethod={setPaymentMethod}
//                             />
//                             <ShippingInfo
//                                 form={form}
//                                 cities={cities}
//                                 setCities={setCities}
//                                 districts={districts}
//                                 setDistricts={setDistricts}
//                                 communes={communes}
//                                 setCommunes={setCommunes}
//                             />
//                         </div>

//                         {/* RIGHT */}
//                         <div className="w-full lg:w-1/3 px-4">
//                             <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//                                 <OrderSummary
//                                     orderItems={cart}
//                                     originalPrice={originalPrice}
//                                     shippingFee={shippingFee}
//                                     discountCode={discountCode}
//                                     applyDiscount={applyDiscount}
//                                     setDiscountCode={setDiscountCode}
//                                     discountApplied={discountApplied}
//                                     discountAmount={discountAmount}
//                                     totalAfterDiscount={totalAfterDiscount}
//                                 />
//                             </div>

//                             <div className="flex flex-col space-y-3">
//                                 <Button
//                                     type="primary"
//                                     size="large"
//                                     className="!rounded-button bg-blue-500 h-12 whitespace-nowrap"
//                                     icon={<CheckCircleOutlined />}
//                                     onClick={handleSubmit}
//                                     loading={loadingSubmit}
//                                 >
//                                     Hoàn tất thanh toán
//                                 </Button>

//                                 <Button
//                                     type="default"
//                                     size="large"
//                                     className="!rounded-button whitespace-nowrap"
//                                     icon={<ArrowLeftOutlined />}
//                                     onClick={() => window.history.back()}
//                                 >
//                                     Quay lại
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </Form>
//             </div>




//             {showCODPayment && orderDataForPayment && (
//                 <CODPayment
//                     totalAfterDiscount={totalAfterDiscount}
//                     onCancel={() => setShowCODPayment(false)}
//                     orderData={orderDataForPayment}
//                     onCreateOrder={handleCreateOrder}
//                 />
//             )}
//         </div>
//     );
// }
// // ...existing code...
// ...existing code...
import { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import PaymentMethod from "../components/PaymentMethod";
import ShippingInfo from "../components/ShippingInfo";
import OrderSummary from "../components/OrderSummary";
import CODPayment from "../components/CODPayment";
import "@ant-design/v5-patch-for-react-19";
import Header from "../../../shared/components/Header";
// 🆕 Thêm axios để gọi API thanh toán
import axios from "axios";

type Location = { id: number; full_name: string };
type CartItem = { id: number; name: string; price: number; quantity: number; image?: string };
type User = { id?: number; name?: string | null };


const useCart = () => ({
    cart: [] as CartItem[],
    clearCart: () => { },
});
const useAuth = () => ({
    user: null as User | null,
});

export default function CheckoutPage() {
    // ✅ State cơ bản
    const [paymentMethod, setPaymentMethod] = useState<string>("card"); // Mặc định là card (có thể là VNPay)
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountApplied, setDiscountApplied] = useState<boolean>(false);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [form] = Form.useForm();

    const [showCODPayment, setShowCODPayment] = useState<boolean>(false);

    // ✅ Contexts (thay bằng hook thực tế nếu có)
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    // 🔴 Bỏ orderIdFromServer, OrderDataForPayment vì sẽ xử lý trực tiếp
    // const [orderIdFromServer, setOrderIdFromServer] = useState<string | null>(null);
    // const [orderDataForPayment, setOrderDataForPayment] = useState<any>(null);

    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

    // ✅ Địa chỉ
    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [communes, setCommunes] = useState<Location[]>([]);

    // ✅ Xác định client-side render
    useEffect(() => {
        setIsClient(true);
    }, []);


    // 🆕 Xử lý kết quả trả về từ VNPay (Tương tự OrderPage.tsx)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get("vnp_ResponseCode");
        const vnpTransactionStatus = urlParams.get("vnp_TransactionStatus");
        const orderId = urlParams.get("orderId"); // Giả sử backend trả về orderId

        if (orderId && vnpResponseCode) {
            // Xóa tham số khỏi URL để tránh xử lý lại khi refresh
            window.history.replaceState({}, document.title, window.location.pathname);

            if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
                message.success("🎉 Thanh toán VNPay thành công!");
                // ℹ️ Có thể gọi API để kiểm tra lại status đơn hàng lần cuối

                clearCart();
                document.cookie = "paymentStatus=success; max-age=3600; path=/";
                // Điều hướng sau 2s
                setTimeout(() => {
                    window.location.href = `/order-success/${orderId}`;
                }, 2000);
            } else {
                // Xử lý thất bại / bị hủy
                message.error("❌ Thanh toán thất bại hoặc bị hủy!");
                // Điều hướng về trang thanh toán ban đầu hoặc trang thông báo lỗi
                // setTimeout(() => navigate("/checkout"), 2000); // Giả sử dùng useNavigate
            }
        }
    }, [clearCart]);



    // ✅ Áp dụng mã giảm giá (giữ nguyên)
    const applyDiscount = () => {
        if (discountCode.trim() !== "") {
            setDiscountAmount(100000); // Giảm 100k ví dụ
            setDiscountApplied(true);
            message.success("Áp dụng mã giảm giá thành công!");
        } else {
            message.warning("Vui lòng nhập mã giảm giá hợp lệ.");
        }
    };

    // ✅ Helper: Lấy tên từ id location (giữ nguyên)
    const getLocationNameById = (list: Location[], id: number): string => {
        const item = list.find((loc) => loc.id === id);
        return item ? item.full_name : "";
    };


    // 🆕 Gọi API tạo đơn hàng (chủ yếu dùng cho COD)
    const handleCreateOrder = async (finalOrderData: any, isCOD: boolean = false) => {
        setLoadingSubmit(true);
        try {
            // Giả lập gọi API tạo đơn hàng
            const response = await fetch(
                `http://localhost:8080/api/orders`, // ⚠️ Đổi endpoint sang /api/orders
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalOrderData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const orderId = data.id;

                if (isCOD) {
                    // Xử lý COD: thành công và chuyển hướng
                    message.success("Đặt hàng thành công! Đơn hàng sẽ được giao trong vài ngày.");
                    clearCart();
                    document.cookie = "paymentStatus=cod-pending; max-age=3600; path=/";

                    setTimeout(() => {
                        window.location.href = `/order-success/${orderId}`;
                    }, 3000);
                    return { success: true, orderId: orderId, data };
                } else {
                    // Xử lý VNPay/Card: trả về dữ liệu đơn hàng
                    return { success: true, orderId: orderId, data };
                }

            } else {
                const errorData = await response.json();
                console.error("Failed to create order:", errorData);
                message.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
                return { success: false, error: errorData };
            }
        } catch (error: any) {
            console.error("Error creating order:", error?.message || error);
            message.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
            return { success: false, error: error };
        } finally {
            setLoadingSubmit(false);
            setShowCODPayment(false);
        }
    };

    // 🆕 Gọi API tạo thanh toán VNPay (Chỉ dùng khi thanh toán qua cổng)
    const createPaymentUrl = async (orderId: string, amount: number) => {
        try {
            message.info("🔄 Đang tạo liên kết thanh toán VNPay...");
            const res = await axios.post(
                "http://localhost:8080/api/vnpay/create_payment", // ⚠️ Endpoint tạo link VNPay
                {
                    orderId: orderId,
                    amount: amount,
                    orderInfo: `Thanh toan don hang ${orderId}`,
                    returnUrl: `${window.location.origin}/checkout`, // URL sau khi VNPay callback
                }
            );

            if (res.data?.paymentUrl) {
                // 🚀 Redirect người dùng
                window.location.href = res.data.paymentUrl;
            } else {
                message.error("Không lấy được link thanh toán VNPay. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error creating VNPay payment:", error);
            message.error("Lỗi kết nối đến cổng thanh toán.");
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
            .then(async (values) => { // ❗ Thêm async
                const cityName = getLocationNameById(cities, values.city);
                const districtName = getLocationNameById(districts, values.district);
                const communeName = getLocationNameById(communes, values.commune);
                const randomStatus = "pending"; // Trạng thái ban đầu

                const orderData = {
                    ...values,
                    city_name: cityName,
                    district_name: districtName,
                    commune_name: communeName,
                    userid: user?.id,
                    userfullname: user?.name,
                    paymentMethod: paymentMethod,
                    status: randomStatus,
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

                // 1. Xử lý COD
                if (paymentMethod === "cod") {
                    // Dùng CODPayment component để confirm (vì đây là giao diện mẫu)
                    // Nếu không dùng modal, có thể gọi handleCreateOrder trực tiếp
                    // await handleCreateOrder(orderData, true); 
                    setShowCODPayment(true); // Hiển thị modal COD Payment để confirm
                }
                // 2. Xử lý Thanh toán qua cổng (Card / VNPay)
                else {
                    setLoadingSubmit(true);
                    // B1: Tạo đơn hàng (order)
                    const result = await handleCreateOrder(orderData, false);

                    if (result.success && result.orderId) {
                        // B2: Tạo link thanh toán VNPay
                        await createPaymentUrl(result.orderId, totalAfterDiscount);

                        // Lưu ý: createPaymentUrl sẽ tự redirect, 
                        // nên các code bên dưới sẽ không chạy
                    }
                    setLoadingSubmit(false); // Sẽ không chạy nếu có redirect
                }

            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
                message.error("Vui lòng điền đầy đủ và chính xác thông tin nhận hàng.");
            });
    };
}
    // ... (Phần render giữ nguyên)
// ...existing code...