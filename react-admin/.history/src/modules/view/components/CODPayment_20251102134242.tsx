

"use client";

import { useState } from "react";
import { Modal, Button, Alert } from "antd"; 

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
    const [loading, setLoading] = useState(false);  // Trạng thái loading
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Trạng thái thông báo
    const [showAlert, setShowAlert] = useState(false); // Quản lý việc hiển thị Alert

    const handleCODPayment = async () => {
        setLoading(true);
        setShowAlert(false);

        // 1. Gọi callback onCreateOrder để tạo đơn hàng thực tế ở backend
        try {
            // Truyền cờ isCOD = true (vì đây là thanh toán COD)
            const result = await onCreateOrder({ ...orderData, paymentMethod: "cod", status: "pending" }, true);
            
            if (result.success) {
                // 2. Chỉ hiển thị thông báo thành công NẾU onCreateOrder THÀNH CÔNG
                // *Lưu ý: Component cha sẽ chịu trách nhiệm chuyển hướng sau khi tạo đơn hàng thành công
                setPaymentStatus("Đặt hàng COD thành công! Đang xử lý chuyển hướng...");
                setShowAlert(true);
            } else {
                // Xử lý lỗi từ backend (ví dụ: giỏ hàng trống, lỗi server)
                throw new Error(result.error?.message || "Lỗi không xác định từ máy chủ.");
            }
        } catch (error: any) {
            console.error("Lỗi khi tạo đơn hàng COD:", error.message);
            setPaymentStatus(`Đặt hàng thất bại: ${error.message}`);
            setShowAlert(true);
        } finally {
            // Loading chỉ tắt nếu không có chuyển hướng (chuyển hướng sẽ tự ngắt component)
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
                    disabled={paymentStatus?.includes("thành công")} // Ngăn click lại sau khi thành công
                >
                    Xác nhận đặt hàng
                </Button>
            </div>
        </Modal>
    );
};

export default CODPayment;