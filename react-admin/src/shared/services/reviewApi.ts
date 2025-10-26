import { axiosClient } from "../lib/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

/* ============================================================
 🧾 REVIEW API SERVICES — CONNECTS TO /api/reviews ON BACKEND
============================================================ */

/** 🔹 Lấy danh sách review theo loại (Product/Service) và refId */
export const fetchReviews = async (
  type: string,
  refId: number,
  approvedOnly = true
) => {
  try {
    const res = await axiosClient.get(`/reviews`, {
      params: { type, refId, approvedOnly },
    });

    console.log("📡 [FE] Gọi API:", res.config.url);
    console.log("📦 [FE] Params:", { type, refId, approvedOnly });
    console.log("📩 [FE] Response:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi fetchReviews:", err);
    throw err.response?.data || err;
  }
};

/** 🔹 Lấy toàn bộ review (dành cho Admin hoặc test) */
export const fetchAllReviews = async () => {
  try {
    const res = await axiosClient.get(`/reviews`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi fetchAllReviews:", err);
    throw err.response?.data || err;
  }
};

/** 🔹 Tạo review mới (POST /api/reviews) */
// export const createReview = async (data: any) => {
//   try {
//     const res = await axiosClient.post(`/reviews`, data, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return res.data;
//   } catch (err: any) {
//     console.error("❌ Lỗi createReview:", err);
//     throw err.response?.data || err;
//   }
// };


// reviewApi.ts
export const createReview = async (data: any) => {
  try {
    const formData = new FormData();

    if (data.fileList && data.fileList.length > 0) {
      formData.append("file", data.fileList[0].originFileObj);
    }

    formData.append(
      "data",
      new Blob(
        [JSON.stringify({
          rating: data.rating,
          comment: data.comment,
          reviewType: data.reviewType,
          refId: data.refId,
          customerId: data.customerId,
        })],
        { type: "application/json" }
      )
    );

    const res = await axiosClient.post("/reviews", formData);
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi createReview:", err);
    throw err.response?.data || err;
  }
};

/** 🔹 Cập nhật review */
export const updateReview = async (id: number, data: any) => {
  try {
    const res = await axiosClient.put(`/reviews/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi updateReview:", err);
    throw err.response?.data || err;
  }
};

/** 🔹 Duyệt review (Admin) */
export const approveReview = async (id: number) => {
  try {
    const res = await axiosClient.patch(`/reviews/${id}/approve`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi approveReview:", err);
    throw err.response?.data || err;
  }
};

/** 🔹 Xoá review (Admin hoặc người dùng) */
export const deleteReview = async (id: number) => {
  try {
    const res = await axiosClient.delete(`/reviews/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Lỗi deleteReview:", err);
    throw err.response?.data || err;
  }
};

/* ============================================================
 🔹 HOOKS — REACT QUERY WRAPPERS
============================================================ */

/** 🟢 Lấy danh sách review theo loại + id */
export const useReviews = (
  type: string,
  refId: number,
  approvedOnly = true
) =>
  useQuery({
    queryKey: ["reviews", type, refId, approvedOnly],
    queryFn: () => fetchReviews(type, refId, approvedOnly),
    enabled: !!refId, // chỉ gọi khi có refId
    staleTime: 1000 * 60 * 5,
  });

/** 🟢 Lấy tất cả reviews (Admin dashboard) */
export const useAllReviews = () =>
  useQuery({
    queryKey: ["reviews", "all"],
    queryFn: fetchAllReviews,
    staleTime: 1000 * 60 * 5,
  });

/** 🟢 Gửi review mới */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      message.success("🎉 Gửi đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "❌ Lỗi khi gửi đánh giá");
    },
  });
};

/** 🟢 Cập nhật review */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateReview(id, data),
    onSuccess: () => {
      message.success("✅ Cập nhật đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => message.error("❌ Lỗi khi cập nhật đánh giá"),
  });
};

/** 🟢 Duyệt review (Admin) */
export const useApproveReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      message.success("✅ Đã duyệt đánh giá!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => message.error("❌ Lỗi khi duyệt đánh giá"),
  });
};

/** 🟢 Xóa review */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      message.success("🗑️ Đã xóa đánh giá!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => message.error("❌ Lỗi khi xóa đánh giá"),
  });
};
