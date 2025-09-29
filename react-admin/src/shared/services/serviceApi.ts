import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";

export const fetchServices = async (page = 1, limit = 5) => {
    const response = await axiosClient.get(`/services`, {
        params: { page, limit },
    });

    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
};

// Lấy chi tiết service
export const fetchServiceById = async (id: number) => {
    const res = await axiosClient.get(`/services/${id}`);
    return res.data;
};

export const useServices = (page = 1, limit = 5) => {
    return useQuery({
        queryKey: ["services", page, limit],
        queryFn: () => fetchServices(page, limit),
        staleTime: 1000 * 60 * 5, // cache 5 phút
    });
};