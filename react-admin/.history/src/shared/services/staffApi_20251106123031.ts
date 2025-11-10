import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

// ✅ Lấy danh sách Staff
export const fetchStaffs = async (page = 1, limit = 5) => {
  const res = await axiosClient.get(`/Staffs`, {
    params: { page: page - 1, size: limit },
  });
  return res.data || { content: [], totalElements: 0 };
};

// ✅ Lấy chi tiết
export const fetchStaffById = async (id: number) => {
  const res = await axiosClient.get(`/Staffs/${id}`);
  return res.data;
};

// ✅ Tạo mới
export const createStaff = async (data: any) => {
  const res = await axiosClient.post(`/Staffs`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Cập nhật
export const updateStaff = async (id: number, data: any) => {
  const res = await axiosClient.put(`/Staffs/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Hook
export const useStaffs = (page = 1, limit = 5) =>
  useQuery({
    queryKey: ["Staffs", page, limit],
    queryFn: () => fetchStaffs(page, limit),
    staleTime: 1000 * 60 * 5,
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      message.success("Thêm khách hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["Staffs"] });
    },
    onError: () => message.error("Lỗi khi thêm khách hàng"),
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateStaff(id, data),
    onSuccess: () => {
      message.success("Cập nhật khách hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["Staffs"] });
    },
    onError: () => message.error("Lỗi khi cập nhật khách hàng"),
  });
};


export const fetchStaffAll = async () => {
  // Sử dụng limit (size) rất lớn để lấy toàn bộ danh sách trong 1 lần gọi
  const ALL_StaffS_LIMIT = 9999;
  const res = await axiosClient.get(`/Staffs`, {
    headers: { "Content-Type": "application/json" },
    params: { page: 0, size: ALL_StaffS_LIMIT }, // Bắt đầu từ trang 0
  });

  // Giả định API trả về định dạng { content: StaffDTO[], totalElements: number }
  return res.data.content || [];
};

// Trong file API khách hàng của bạn (StaffApi.ts)

export const useStaffAll = () => {
  return useQuery({
    queryKey: ["Staffs-all"],
    queryFn: fetchStaffAll,
    // Cache dữ liệu lâu hơn (ví dụ: 1 giờ) vì nó là danh sách tĩnh cho lookup
    staleTime: 1000 * 60 * 60,
  });
};