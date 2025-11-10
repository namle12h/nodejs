import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

// ✅ Lấy danh sách customer
export const fetchCustomers = async (page = 1, limit = 5) => {
  const res = await axiosClient.get(`/customers`, {
    params: { page: page - 1, size: limit },
  });
  return res.data || { content: [], totalElements: 0 };
};

// ✅ Lấy chi tiết
export const fetchCustomerById = async (id: number) => {
  const res = await axiosClient.get(`/customers/${id}`);
  return res.data;
};

// ✅ Tạo mới
export const createCustomer = async (data: any) => {
  const res = await axiosClient.post(`/customers`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Cập nhật
export const updateCustomer = async (id: number, data: any) => {
  const res = await axiosClient.put(`/customers/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Hook
export const useCustomers = (page = 1, limit = 5) =>
  useQuery({
    queryKey: ["customers", page, limit],
    queryFn: () => fetchCustomers(page, limit),
    staleTime: 1000 * 60 * 5,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      message.success("Thêm khách hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => message.error("Lỗi khi thêm khách hàng"),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      message.success("Cập nhật khách hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => message.error("Lỗi khi cập nhật khách hàng"),
  });
};


export const fetchCustomerAll = async () => {
  // Sử dụng limit (size) rất lớn để lấy toàn bộ danh sách trong 1 lần gọi
  const ALL_CUSTOMERS_LIMIT = 9999; 
  const res = await axiosClient.get(`/customers`, {
    params: { page: 0, size: ALL_CUSTOMERS_LIMIT }, // Bắt đầu từ trang 0
  });
  
  // Giả định API trả về định dạng { content: CustomerDTO[], totalElements: number }
  return res.data.content || [];
};