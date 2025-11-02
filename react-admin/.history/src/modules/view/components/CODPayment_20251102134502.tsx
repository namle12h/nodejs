"use client";

import { useState } from "react";
import { Modal, Button, Alert, message } from "antd"; 
import { useAuthStore } from "../../../shared/stores/authStore"; // 👈 Cần import này

const CODPayment: React.FC<{
    totalAfterDiscount: number;
    onCancel: () => void;
    orderData: any; 
    // FIX: Đảm bảo signature của onCreateOrder khớp với component cha
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

    const handleCODPayment = async () => {
        setLoading(true);
        setShowAlert(false);

        // ⚠️ Kiểm tra user ID trước khi gửi
        if (!user?.id) {
            setPaymentStatus("Đặt hàng thất bại: Phiên đăng nhập không hợp lệ.");
            setShowAlert(true);
            setLoading(false);
            return;
        }
        
        // Tạo payload cuối cùng để gửi về CheckoutPage
        const finalOrderData = { 
            ...orderData, 
            paymentMethod: "cod", 
            status: "pending",
            // FIX 2: Truyền userId để component cha sử dụng cho logic Token an toàn
            userId: user.id 
        };

        // 1. Gọi callback onCreateOrder (handleCreateOrder)
        try {
            const result = await onCreateOrder(finalOrderData, true);
            
            if (result.success) {
                setPaymentStatus("Đặt hàng COD thành công! Đang xử lý chuyển hướng...");
                setShowAlert(true);
            } else {
                // Hiển thị lỗi chính xác từ component cha (Token is missing, Validation, v.v.)
                const errorMsg = result.error?.response?.data?.message || result.error?.message || "Lỗi không xác định.";
                // Cắt bỏ "Token is missing" để tránh hiển thị lỗi xác thực
                const displayMsg = errorMsg.includes("Token is missing") ? "Lỗi xác thực, vui lòng thử lại." : errorMsg;
                throw new Error(displayMsg); 
            }
        } catch (error: any) {
            console.error("Lỗi khi tạo đơn hàng COD:", error.message);
            setPaymentStatus(`Đặt hàng thất bại: ${error.message}`);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };
    // ... (Phần render giữ nguyên)
    return (
        <Modal
            title="Xác nhận đặt hàng (Thanh toán khi nhận hàng)"
            open={true}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            {/* ... (Phần hiển thị tổng tiền giữ nguyên) ... */}
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