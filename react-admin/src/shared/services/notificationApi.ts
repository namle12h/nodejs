import { axiosClient } from "../lib/axiosClient";


// 👉 Đường dẫn API chính
const API_URL = "/notifications";

/**
 * 📩 Lấy danh sách thông báo của 1 người dùng
 */
export const getNotifications = async (userId: number) => {
  try {
    const res = await axiosClient.get(`${API_URL}/${userId}`);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi tải thông báo:", error);
    throw error.response?.data || error;
  }
};

/**
 * ✅ Đánh dấu 1 thông báo đã đọc
 */
export const markRead = async (id: number) => {
  try {
    const res = await axiosClient.put(`${API_URL}/${id}/read`);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi đánh dấu đã đọc:", error);
    throw error.response?.data || error;
  }
};

/**
 * ✅ Đánh dấu tất cả thông báo của user đã đọc
 */
export const markAllRead = async (userId: number) => {
  try {
    const res = await axiosClient.put(`${API_URL}/user/${userId}/read-all`);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi đánh dấu tất cả đã đọc:", error);
    throw error.response?.data || error;
  }
};

/**
 * 🗑 Ẩn (xóa mềm) toàn bộ thông báo của user
 */
export const deleteAll = async (userId: number) => {
  try {
    const res = await axiosClient.put(`${API_URL}/user/${userId}`);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa tất cả:", error);
    throw error.response?.data || error;
  }
};

/**
 * 🚀 Tạo thông báo mới
 */
export const createNotification = async (data: any) => {
  try {
    const res = await axiosClient.post(API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo thông báo:", error);
    throw error.response?.data || error;
  }
};
