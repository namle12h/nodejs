"use client";

import { useState } from "react";
import { Modal, Button, Alert, message } from "antd"; 
import { useAuthStore } from "../../../shared/stores/authStore"; 

const CODPayment: React.FC<{
    totalAfterDiscount: number;
    onCancel: () => void;
    orderData: any; 
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
    
    // ✅ Lấy user từ Store ngay trong component để debug
    const { user } = useAuthStore();

    const handleCODPayment = async () => {
        setLoading(true);
        setShowAlert(false);

        // ⚠️ LOG SỐ 1: KIỂM TRA TRẠNG THÁI USER TRƯỚC KHI GỌI API
        console.log("--- CODPAYMENT DEBUG: TRẠNG THÁI USER ---");
        console.log("User Object:", user);
        console.log("User ID:", user?.id);

        if (!user?.id) {
            console.error("LỖI: User ID không tồn tại!");
            setPaymentStatus("Đặt hàng thất bại: Phiên đăng nhập không hợp lệ.");
            setShowAlert(true);
            setLoading(false);
            return;
        }
        
        const finalOrderData = { 
            ...orderData, 
            paymentMethod: "cod", 
            status: "pending",
            userId: user.id 
        };

        try {
            const result = await onCreateOrder(finalOrderData, true);
            
            if (result.success) {
                setPaymentStatus("Đặt hàng COD thành công! Đang xử lý chuyển hướng...");
                setShowAlert(true);
            } else {
                const errorMsg = result.error?.response?.data?.message || result.error?.message || "Lỗi không xác định.";
                
                // ⚠️ LOG SỐ 2: XUẤT LỖI GỐC TỪ API RA CONSOLE
                console.error("LỖI GỐC TỪ API:", result.error);

                const displayMsg = errorMsg.includes("Token is missing") ? "Lỗi xác thực, vui lòng đăng nhập lại." : errorMsg;
                
                throw new Error(displayMsg); 
            }
        } catch (error: any) {
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
            {/* ... (Nội dung Modal) ... */}
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