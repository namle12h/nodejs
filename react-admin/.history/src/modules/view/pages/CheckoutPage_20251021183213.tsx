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
// ...existing code...

// Minimal types — chỉnh/di chuyển nếu bạn có type chung trong dự án
type Location = { id: number; full_name: string };
type CartItem = { id: number; name: string; price: number; quantity: number; image?: string };
type User = { id?: number; name?: string | null };

// Nếu bạn đã có hooks thực tế trong dự án, uncomment và dùng đường dẫn đúng:
// import { useCart } from "../../contexts/CartContext";
// import { useAuth } from "../../contexts/AuthContext";

// Fallback hooks tạm thời (thay bằng implementation thực tế của bạn)
const useCart = () => ({
    cart: [] as CartItem[],
    clearCart: () => {},
});
const useAuth = () => ({
    user: null as User | null,
});

export default function CheckoutPage() {
    // ✅ State cơ bản
    const [paymentMethod, setPaymentMethod] = useState<string>("card");
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountApplied, setDiscountApplied] = useState<boolean>(false);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [form] = Form.useForm();

    // ✅ Modal & trạng thái thanh toán
    const [showQRCodeModal, setShowQRCodeModal] = useState<boolean>(false);
    const [showCardPayment, setShowCardPayment] = useState<boolean>(false);
    const [showCODPayment, setShowCODPayment] = useState<boolean>(false);

    // ✅ Contexts (thay bằng hook thực tế nếu có)
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    const [searchValue, setSearchValue] = useState<string>("");
    const router = useRouter();
    const [orderIdFromServer, setOrderIdFromServer] = useState<string | null>(null);
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

    // ✅ Áp dụng mã giảm giá
    const applyDiscount = () => {
        if (discountCode.trim() !== "") {
            setDiscountAmount(100000); // Giảm 100k ví dụ
            setDiscountApplied(true);
            message.success("Áp dụng mã giảm giá thành công!");
        } else {
            message.warning("Vui lòng nhập mã giảm giá hợp lệ.");
        }
    };

    // ✅ Helper: Lấy tên từ id location
    const getLocationNameById = (list: Location[], id: number): string => {
        const item = list.find((loc) => loc.id === id);
        return item ? item.full_name : "";
    };

    // ✅ Gọi API tạo đơn hàng
    const handleCreateOrder = async (finalOrderData: any) => {
        setLoadingSubmit(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/orders`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalOrderData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                message.success("Đặt hàng thành công!");
                setOrderIdFromServer(data.id);
                clearCart();
                document.cookie = "paymentStatus=success; max-age=3600; path=/";

                // Điều hướng sau 3s
                setTimeout(() => {
                    router.push(`/payment-success?orderId=${data.id}`);
                }, 3000);
            } else {
                const errorData = await response.json();
                console.error("Failed to create order:", errorData);
                message.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
            }
        } catch (error: any) {
            console.error("Error creating order:", error?.message || error);
            message.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoadingSubmit(false);
            setShowQRCodeModal(false);
            setShowCardPayment(false);
            setShowCODPayment(false);
        }
    };

    // ✅ Tính toán giá tiền
    const originalPrice = (cart || []).reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
    );
    const shippingFee = 30000;
    const totalBeforeDiscount = originalPrice + shippingFee;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;

    // ✅ Submit form thanh toán
    const handleSubmit = () => {
        if (!cart || cart.length === 0) {
            message.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
            return;
        }

        form
            .validateFields()
            .then((values) => {
                const cityName = getLocationNameById(cities, values.city);
                const districtName = getLocationNameById(districts, values.district);
                const communeName = getLocationNameById(communes, values.commune);
                const statuses = ["pending", "confirmed", "shipping", "delivered"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

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

                setOrderDataForPayment(orderData);

                // ✅ Hiển thị modal tương ứng với phương thức thanh toán
                if (paymentMethod === "ewallet" || paymentMethod === "bank") {
                    setShowQRCodeModal(true);
                } else if (paymentMethod === "card") {
                    setShowCardPayment(true);
                } else if (paymentMethod === "cod") {
                    setShowCODPayment(true);
                }
            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
            });
    };

    // ✅ Render client
    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
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
                                    onClick={() => router.back()}
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

            

           
            {showCODPayment && orderDataForPayment && (
                <CODPayment
                    totalAfterDiscount={totalAfterDiscount}
                    onCancel={() => setShowCODPayment(false)}
                    orderData={orderDataForPayment}
                    onCreateOrder={handleCreateOrder}
                />
            )}
        </div>
    );
}
// ...existing code...