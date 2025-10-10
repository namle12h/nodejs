import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

export const fetchHistory = async (page = 1, limit = 10) => {
  const res = await axiosClient.get(`/history`, {
    params: { page: page - 1, size: limit }, // ✅ fix offset (Spring Boot page index = 0)
  });

  // ✅ Lấy dữ liệu chính xác dù BE có bọc trong "data" hay không
  const data = res.data?.data || res.data;

  if (data && Array.isArray(data.content)) {
    return data; // Page<AuditLog> chuẩn
  }

  // fallback nếu BE trả về dạng mảng
  return { content: data || [], totalElements: 0, totalPages: 1 };
};


export const useHistory = (page = 1, limit = 10) => {
  const query = useQuery({
    queryKey: ["history", page, limit],
    queryFn: () => fetchHistory(page, limit),
    refetchOnWindowFocus: true, // ✅ tự reload khi quay lại tab
    refetchInterval: 10000, // ✅ reload mỗi 10 giây (tùy chọn)
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });

  if (query.error) {
    console.error("❌ Lỗi lấy lịch sử:", (query.error as any).response?.data);
    message.error("Không thể tải lịch sử hoạt động");
  }

  return query;
};