"use client";

import { useState } from "react";
import { Modal, Button, Alert, message } from "antd"; 
import { useAuthStore } from "../../../shared/stores/authStore"; // 👈 Cần import này

const CODPayment: React.FC<{
    totalAfterDiscount: number;
    onCancel: () => void;
    orderData: any; // Nhận dữ liệu đơn hàng từ component cha
    // Callback này sẽ gọi API tạo đơn hàng thực tế
    onCreateOrder: (orderData: any, isCOD: boolean) => Promise<{ success: boolean; orderId?: string; data?: any; error?: any; }>; 
}> = ({
    totalAfterDiscount,
    onCancel,
    orderData,
    onCreateOrder,
}) => {
    const [loading, setLoading] = useState(false);  
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); 
    const [showAlert, setShowAlert] = useState(false); 
    
    // ✅ FIX 1: Lấy user từ Store ngay trong component
    const { user } = useAuthStore();
    // ✅ Lấy ID khách hàng từ user đã đăng nhập
    const customerId = user?.id;

    const handleCODPayment = async () => {
        setLoading(true);
        setShowAlert(false);

        // ⚠️ Kiểm tra user ID trước khi gửi
        if (!customerId) {
            setPaymentStatus("Đặt hàng thất bại: Phiên đăng nhập không hợp lệ.");
            setShowAlert(true);
            setLoading(false);
            return;
        }

        // 1. Gọi callback onCreateOrder để tạo đơn hàng thực tế ở backend
        try {
            // Gửi dữ liệu đầy đủ (bao gồm cả Customer ID - Dù đã có logic ở component cha)
            const result = await onCreateOrder({ 
                ...orderData, 
                paymentMethod: "cod", 
                status: "pending",
                // ✅ FIX 2: ĐẢM BẢO USER ID ĐƯỢC TRUYỀN (Nếu component cha thiếu)
                customerId: customerId
            }, true);
            
            if (result.success) {
                setPaymentStatus("Đặt hàng COD thành công! Đang xử lý chuyển hướng...");
                setShowAlert(true);
            } else {
                // Hiển thị lỗi chính xác từ component cha (Token is missing, Validation, v.v.)
                const errorMsg = result.error?.response?.data?.message || result.error?.message || "Lỗi không xác định.";

                throw new Error(errorMsg); 
            }
        } catch (error: any) {
            console.error("Lỗi khi tạo đơn hàng COD:", error.message);
            setPaymentStatus(`Đặt hàng thất bại: ${error.message}`);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Xác nhận đặt hàng (Thanh toán khi nhận hàng)"
            open={true}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <div className="p-4">
                {/* ... (Phần hiển thị tổng tiền và thông tin COD giữ nguyên) ... */}
                <p className="mb-2 text-lg">
                    Tổng số tiền thanh toán:{" "}
                    <span className="font-bold text-red-600">
                        {totalAfterDiscount.toLocaleString()} VND
                    </span>
                </p>
                <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-1">
                        * Phương thức: <span className="font-semibold">Thanh toán khi nhận hàng (COD)</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        * Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc.
                    </p>
                    <p className="text-sm text-gray-500">
                        * Vui lòng chuẩn bị đúng số tiền đã nêu ở trên khi nhận hàng.
                    </p>
                </div>
            </div>

            {showAlert && (
                <Alert
                    message={paymentStatus}
                    type={paymentStatus?.includes("thành công") ? "success" : "error"}
                    showIcon
                    closable
                    className="mb-4"
                />
            )}

            <div className="flex justify-end space-x-4 mt-8">
                <Button onClick={onCancel} className="!rounded-button">Hủy bỏ</Button>
                <Button
                    type="primary"
                    onClick={handleCODPayment}
                    className="!rounded-button bg-blue-500 hover:!bg-blue-600"
                    loading={loading}
                    disabled={paymentStatus?.includes("thành công")} 
                >
                    Xác nhận đặt hàng
                </Button>
            </div>
        </Modal>
    );
};

export default CODPayment;