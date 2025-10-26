import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";
import dayjs from "dayjs";

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
  try {
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
  } catch (error) {
    console.error("FE create error:", error.response?.data);
    message.error(error.response?.data?.message || "Lỗi khi tạo lịch hẹn");
  }
  
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
export const useCreateAppointment = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      message.success("Booking created successfully");
       if (options?.onSuccess) options.onSuccess();
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      console.log("FE error:", error.response?.data);
      message.error(error.response?.data?.message || "Lỗi đặt lịch");
    },
  });
};


// Cập nhật appointment
export const updateAppointment = async (id: number, data: any) => {
  const payload = {
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    startAt: data.startAt ? dayjs(data.startAt) : null,
    endAt: data.endAt ? dayjs(data.endAt) : null,
    staffId: data.staffId,
    roomId: data.roomId,
    serviceId: data.serviceId,
    status: data.status,
    notes: data.notes,
  };

  const res = await axiosClient.put(`/appointments/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};


// Hook cập nhật lịch hẹn
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateAppointment(id, data),
    onSuccess: () => {
      // message.success("Cập nhật lịch hẹn thành công!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      console.error("FE update error:", error.response?.data);
      message.error(error.response?.data?.message || "Lỗi khi cập nhật lịch hẹn");
    },
  });
};


// 🔹 Lấy danh sách nhân viên
export const fetchStaffList = async () => {
  const res = await axiosClient.get("/staff");
  return res.data?.data || res.data; // ✅ tự động lấy mảng đúng
};

// 🔹 Lấy danh sách phòng
export const fetchRoomList = async () => {
  const res = await axiosClient.get("/rooms");
  return res.data?.data || res.data;
};


// 🔹 Lấy danh sách dịch vụ
export const fetchServiceList = async () => {
  const res = await axiosClient.get("/services");
  return res.data?.data || res.data;
};
