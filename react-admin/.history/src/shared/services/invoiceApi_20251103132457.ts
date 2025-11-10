import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";
import type {
  ApiInvoice,
  InvoiceCreateRequest,
  ApiInvoiceItem
} from "../../shared/types/type";

export const createInvoice = async (data: any) => {
  // 👉 Gửi JSON thuần, không cần FormData
  const res = await axiosClient.post("/invoices", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};


export const getAllInvoices = async (): Promise<ApiInvoice[]> => {
  const res = await axiosClient.get<ApiInvoice[]>("/invoices", {
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

export const useGetAllInvoice = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getAllInvoices,
  });
};
