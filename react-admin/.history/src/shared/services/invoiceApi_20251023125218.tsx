import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

/**
 * 🧾 API: Tạo hóa đơn
 * @param data object gồm appointmentId, customerId, vat, discountAmount, items[], paymentMethod
 */
export const createInvoice = async (data: any) => {
  // 👉 Gửi JSON thuần, không cần FormData
  const res = await axiosClient.post("/invoices", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

/**
 * ⚙️ Hook React Query để tạo hóa đơn
 */
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,

    onSuccess: (res) => {
      message.success("✅ Thanh toán và tạo hóa đơn thành công!");
      console.log("📦 Hóa đơn đã tạo:", res);

      // Làm mới danh sách hóa đơn (nếu có)
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },

    onError: (error: any) => {
      console.error("❌ Lỗi khi tạo hóa đơn:", error.response || error);
      message.error(
        error?.response?.data?.message || "❌ Thanh toán thất bại! Vui lòng thử lại."
      );
    },
  });
};
