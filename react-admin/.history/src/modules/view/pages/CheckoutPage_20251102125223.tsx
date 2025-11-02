import { useState, useEffect } from "react";
import { Button, Form, message, Modal } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import PaymentMethod from "../components/PaymentMethod";
import ShippingInfo from "../components/ShippingInfo";
import OrderSummary from "../components/OrderSummary";
import CODPayment from "../components/CODPayment";
import "@ant-design/v5-patch-for-react-19";
import Header from "../../../shared/components/Header";
import axios from "axios";
import { useAuthStore } from "../../../shared/stores/authStore";
import { useCart, type CartItem } from "../../../shared/context/CartContext";


// =====================
// 1️⃣ Interfaces
// =====================
type Location = { id: number; full_name: string };

type CheckoutUser = {
    id?: number;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
};


// =====================
// 2️⃣ Component Chính
// =====================
export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<string>("card");
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountApplied, setDiscountApplied] = useState<boolean>(false);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [form] = Form.useForm();

    const [showCODPayment, setShowCODPayment] = useState<boolean>(false);

    // ✅ FIX 1: Lấy hook giỏ hàng, NHƯNG CHỈ DÙNG clearCart
    const { clearCart } = useCart();

    // ⭐️ GIỮ NGUYÊN: Khai báo user và token để component con sử dụng
    const user = useAuthStore(state => state.user) as CheckoutUser | null;
    const token = useAuthStore(state => state.token?.accessToken); 

    const [orderDataForPayment, setOrderDataForPayment] = useState<any>(null);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

    // ✅ FIX 2: STATE CHÍNH - LƯU SẢN PHẨM ĐÃ CHỌN TỪ Local Storage
    const [selectedOrderItems, setSelectedOrderItems] = useState<CartItem[]>([]);

    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [communes, setCommunes] = useState<Location[]>([]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // ✅ FIX 3: useEffect TẢI DỮ LIỆU SẢN PHẨM ĐÃ CHỌN TỪ Local Storage
    useEffect(() => {
        if (!isClient) return;
        try {
            const selectedItemsRaw = localStorage.getItem("checkoutItems");
            if (selectedItemsRaw) {
                const parsedItems: CartItem[] = JSON.parse(selectedItemsRaw);
                const validItems = parsedItems.filter(item => item && item.quantity > 0);
                setSelectedOrderItems(validItems);
            }
        } catch (e) {
            console.error("Lỗi khi tải checkoutItems:", e);
            message.error("Lỗi dữ liệu sản phẩm. Vui lòng quay lại giỏ hàng.");
        }
    }, [isClient]);

    // 🆕 Xử lý kết quả trả về từ VNPay Callback (Giữ nguyên)
    useEffect(() => {
        if (!isClient) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get("vnp_ResponseCode");
        const vnpTransactionStatus = urlParams.get("vnp_TransactionStatus");
        const orderId = urlParams.get("vnp_TxnRef");

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


    // ✅ Áp dụng mã giảm giá (Giữ nguyên)
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

    // ✅ Helper: Lấy tên từ id location (Giữ nguyên)
    const getLocationNameById = (list: Location[], id: number): string => {
        const item = list.find((loc) => loc.id === id);
        return item ? item.full_name : "";
    };

    // ✅ FIX 4: HÀM TẠO LINK THANH TOÁN (SỬ DỤNG TOKEN AN TOÀN)
    const createPaymentUrl = async (orderId: string, amount: number) => {
        const { token: authStoreToken } = useAuthStore.getState(); 
        const currentToken = authStoreToken?.accessToken;
        
        if (!currentToken) {
            message.error("Vui lòng đăng nhập để thực hiện thanh toán online.");
            return;
        }

        try {
            message.info("🔄 Đang chuyển hướng đến cổng thanh toán VNPay...");
            const res = await axios.post(
                "http://localhost:8080/api/vnpay/create_payment",
                {
                    orderId: orderId,
                    amount: amount,
                    orderInfo: `Thanh toan don hang ${orderId}`,
                    returnUrl: `${window.location.origin}/checkout`,
                },
                { headers: { 'Authorization': `Bearer ${currentToken}` } }
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


    // ✅ FIX 5: HÀM TẠO ĐƠN HÀNG (SỬ DỤNG TOKEN AN TOÀN)
    const handleCreateOrder = async (finalOrderData: any, isCOD: boolean = false) => {
        setLoadingSubmit(true);

        const { token: authStoreToken } = useAuthStore.getState();
        const currentToken = authStoreToken?.accessToken;

        if (!currentToken) {
            message.error("Lỗi xác thực: Vui lòng đăng nhập lại.");
            setLoadingSubmit(false);
            return { success: false, error: { message: "Token is missing" } };
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/orders`, // 👈 Endpoint mới
                finalOrderData,
                { headers: { 'Authorization': `Bearer ${currentToken}` } }
            );

            const data = response.data.order; // ✅ SỬA: Lấy .order từ response body
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
                            const res = await axios.get(
                                `http://localhost:8080/api/vnpay/recreate_payment_url?txnRef=${txnRef}`,
                                { headers: { 'Authorization': `Bearer ${currentToken}` } }
                            );
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

            console.error("Error creating order:", errorMsg);
            message.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
            return { success: false, error: error };
        } finally {
            setLoadingSubmit(false);
        }
    };


    // ✅ Tính toán giá tiền (Sử dụng selectedOrderItems)
    const originalPrice = selectedOrderItems.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
    );
    const shippingFee = 30000;
    const totalBeforeDiscount = originalPrice + shippingFee;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;

    // ✅ Submit form thanh toán (SỬ DỤNG selectedOrderItems)
    const handleSubmit = () => {
        if (selectedOrderItems.length === 0) {
            message.error("Không có sản phẩm nào được chọn để thanh toán.");
            return;
        }

        form
            .validateFields()
            .then(async (values) => {

                const cityName = getLocationNameById(cities, values.city);
                const districtName = getLocationNameById(districts, values.district);
                const communeName = getLocationNameById(communes, values.commune);

                // ✅ FIX 6: CHUẨN BỊ DATA CHO API (Bao gồm các trường địa chỉ mới)
                const orderData = {
                    ...values,
                    // THÔNG TIN NHẬN HÀNG MỚI
                    receiverName: values.fullName, // Giả định form.fullName là tên người nhận
                    receiverPhone: values.phone,   // Giả định form.phone là SĐT người nhận
                    addressDetail: values.address, // Chi tiết địa chỉ
                    cityName: cityName,
                    districtName: districtName,
                    communeName: communeName,
                    
                    // THÔNG TIN USER VÀ THANH TOÁN
                    userid: user?.id,
                    userfullname: user?.name,
                    paymentMethod: paymentMethod,
                    status: "pending",
                    
                    // SỬ DỤNG selectedOrderItems
                    items: selectedOrderItems.map((item: CartItem) => ({ 
                        productId: item.id,
                        quantity: item.quantity,
                        pricePerUnit: item.price,
                        // Bổ sung các trường cần thiết cho backend
                        name: item.name,
                        imageUrl: item.imageUrl,
                    })),
                    
                    // TỔNG TIỀN
                    totalAmount: totalAfterDiscount,
                    discountAmount: discountAmount,
                    shippingFee: shippingFee, // 👈 Truyền phí ship
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
                    const result = await handleCreateOrder(orderData, false);

                    if (result.success && result.orderId) {
                        await createPaymentUrl(result.orderId, totalAfterDiscount);
                    }
                }

            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
                message.error("Vui lòng điền đầy đủ và chính xác thông tin nhận hàng.");
            });
    };

    // ... (Phần Render giữ nguyên)
    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto pt-20 px-4 py-8">
                <Form form={form} layout="vertical">
                    <div className="flex flex-wrap -mx-4">
                        {/* LEFT */}
                        <div className="w-full lg:w-2/3 px-4 mb-8">
                             {/* ... PaymentMethod & ShippingInfo giữ nguyên ... */}
                        </div>

                        {/* RIGHT */}
                        <div className="w-full lg:w-1/3 px-4">
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <OrderSummary
                                    orderItems={selectedOrderItems.map(item => ({
                                        name: item.name,
                                        quantity: item.quantity,
                                        price: item.price,
                                        image: item.imageUrl, // 👈 FIX: Mapping imageUrl thành image
                                    }))}
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
                                {/* ... Quay lại button giữ nguyên ... */}
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
                    onCreateOrder={(data: any) => handleCreateOrder(data, true)}
                />
            )}
        </div>
    );
}