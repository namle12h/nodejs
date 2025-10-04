import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";

// Lấy danh sách
export const fetchAppointments = async (page = 1, limit = 5) => {
  const response = await axiosClient.get(`/appointments`, {
    params: { page, limit },
  });

  // BE trả Page<Appointment>
  if (response.data && Array.isArray(response.data.content)) {
    return response.data; // ✅ trả nguyên object Page để FE dùng pagination
  }

  return { content: [], totalElements: 0, totalPages: 0 };
};


// Lấy chi tiết appointment
export const fetchAppointmentsById = async (id: number) => {
  const res = await axiosClient.get(`/appointments/${id}`);
  return res.data;
};

// Tạo mới appointment
export const createAppointment = async (data: any) => {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date, // yyyy-MM-dd
    time: data.time, // HH:mm
    notes: data.notes,
    serviceId: data.serviceId,
    customerId: data.customerId,
  };
  const res = await axiosClient.post("/appointments/public", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Hook list
export const useAppointments = (page = 1, limit = 5) => {
  return useQuery({
    queryKey: ["appointments", page, limit],
    queryFn: () => fetchAppointments(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};

// Hook tạo mới
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      message.success("Booking created successfully");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      console.log("FE error:", error.response?.data);
      message.error(error.response?.data?.message || "Lỗi đặt lịch");
    },
  });
};
