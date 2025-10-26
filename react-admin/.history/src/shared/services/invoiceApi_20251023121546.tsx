import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

// =======================
// API: Tạo hóa đơn mới
// =======================
export const createInvoice = async (data: any) => {
  const res = await axiosClient.post("/invoices", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// =======================
// Hook React Query
// =======================
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (res) => {
      message.success("✅ Thanh toán và tạo hóa đơn thành công!");
      console.log("📦 Hóa đơn đã tạo:", res);
      // Nếu bạn có query hóa đơn thì refetch lại
      queryClient.invalidateQueries({ queryKey: ["invoic]()
