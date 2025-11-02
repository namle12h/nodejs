import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

// Định nghĩa Response Type để sử dụng cho các hàm query
interface OrderResponse {
    id: number;
    txnRef: string;
    total: number;
    status: string;
    paymentMethod: string;
    // Thêm các trường khác từ backend DTO nếu cần (ví dụ: orderItems, receiverName)
    [key: string]: any; 
}

/**
 * 🛒 API: Tạo Đơn hàng Mua sắm Online
 * Gửi dữ liệu đơn hàng đến endpoint mới cho khách hàng.
 */
export const createOrder = async (data: any): Promise<OrderResponse> => {
    // ✅ GỌI ENDPOINT MỚI: /api/orders
    const res = await axiosClient.post("/api/orders", data, {
        headers: { "Content-Type": "application/json" },
    });
    // Phản hồi có thể nằm trong res.data.order hoặc res.data
    return res.data?.order || res.data; 
};

/**
 * ⚙️ Hook React Query để tạo Đơn hàng
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,

        onSuccess: (res) => {
            console.log("🛒 Đơn hàng Online đã tạo:", res);

            // Làm mới danh sách đơn hàng (nếu bạn có trang Lịch sử mua hàng)
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },

        onError: (error: any) => {
            console.error("❌ Lỗi khi tạo đơn hàng:", error.response || error);
            message.error(
                error?.response?.data?.message || "❌ Đặt hàng thất bại! Vui lòng thử lại."
            );
        },
    });
};

// --- API GET THÔNG TIN ĐƠN HÀNG ---

/**
 * API: Lấy chi tiết MỘT đơn hàng theo TxnRef (Dùng cho trang Order Success)
 */
export const getOrderDetail = async (txnRef: string): Promise<OrderResponse> => {
    // ✅ GỌI ENDPOINT CHI TIẾT ĐƠN HÀNG
    const res = await axiosClient.get(`/api/orders/${txnRef}`);
    return res.data;
};

/**
 * Hook React Query để lấy chi tiết Đơn hàng
 */
export const useOrderDetail = (txnRef: string) => {
    return useQuery({
        queryKey: ["orderDetail", txnRef],
        queryFn: () => getOrderDetail(txnRef),
        enabled: !!txnRef, // Chỉ chạy query khi có txnRef
    });
};


// --- API GET DANH SÁCH ĐƠN HÀNG ---

/**
 * API: Lấy danh sách đơn hàng của khách hàng (hoặc tất cả cho Admin)
 */
export const getOrders = async (isAdmin: boolean = false): Promise<OrderResponse[]> => {
    const endpoint = isAdmin ? "/orders/all" : "/orders";
    const res = await axiosClient.get(endpoint);
    return res.data;
};

/**
 * Hook React Query để lấy danh sách đơn hàng
 */
export const useOrders = (isAdmin: boolean = false) => {
    return useQuery({
        queryKey: ["orders", isAdmin],
        queryFn: () => getOrders(isAdmin),
        // Có thể thêm tùy chọn staleTime, cacheTime, v.v.
    });
};