import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";

// Hàm gọi API để lấy thống kê dịch vụ
const fetchServiceStats = async (startDate: string, endDate: string, period: string) => {
    const response = await axiosClient.get(`/stats/appointment-stats`, {
        params: { startDate, endDate, period }
    });
    return response.data;  // Giả sử API trả về dữ liệu như bạn muốn
};

// Hook để lấy thống kê dịch vụ
export const useServiceStats = (startDate: string, endDate: string, period: string = "last_30_days") => {
    return useQuery({
        queryKey: ["serviceStats", startDate, endDate, period], // queryKey là một mảng
        queryFn: () => fetchServiceStats(startDate, endDate, period), // queryFn là hàm gọi API
        staleTime: 1000 * 60 * 5,  // Dữ liệu sẽ được cache trong 5 phút
        enabled: !!startDate && !!endDate,  // Chỉ gọi API khi có `startDate` và `endDate`
    });
};

const fetchOverviewStats = async (startDate: string, endDate: string, period: string) => {
    const response = await axiosClient.get(`/stats/overview`, {
        params: { startDate, endDate, period }
    });
    return response.data;  // Giả sử API trả về dữ liệu như bạn muốn
};


export const useOverviewStats = (startDate: string, endDate: string, period: string = "today") => {
    return useQuery({
        queryKey: ["overviewStats", startDate, endDate, period], // queryKey là một mảng
        queryFn: () => fetchOverviewStats(startDate, endDate, period), // queryFn là hàm gọi API
        staleTime: 1000 * 60 * 5,  // Dữ liệu sẽ được cache trong 5 phút
        enabled: !!startDate && !!endDate,  // Chỉ gọi API khi có `startDate` và `endDate`
    });
};

const fetchCustomerStats = async (startDate: string, endDate: string, period: string) => {
    const response = await axiosClient.get(`/stats/customers`, {
        params: { startDate, endDate, period }
    });
    return response.data;  // Giả sử API trả về dữ liệu như bạn muốn
};

export const useCustomerStats = (startDate: string, endDate: string, period: string = "today") => {
    return useQuery({
        queryKey: ["customerStats", startDate, endDate, period], // queryKey là một mảng
        queryFn: () => fetchCustomerStats(startDate, endDate, period), // queryFn là hàm gọi API
        staleTime: 1000 * 60 * 5,  // Dữ liệu sẽ được cache trong 5 phút
        enabled: !!startDate && !!endDate,  // Chỉ gọi API khi có `startDate` và `endDate`
    });
};


const fetchPerformanceStats = async (startDate: string, endDate: string, period: string) => {
  try {
    const response = await axiosClient.get(`/stats/performance`, {
      params: { startDate, endDate, period }
    });
    console.log("Dữ liệu trả về từ API:", response.data); // Kiểm tra dữ liệu trả về
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};


export const usePerformanceStats = (startDate: string, endDate: string, period: string = "today") => {
    return useQuery({
        queryKey: ["performanceStats", startDate, endDate, period], // queryKey là một mảng
        queryFn: () => fetchPerformanceStats(startDate, endDate, period), // queryFn là hàm gọi API
        staleTime: 1000 * 60 * 5,  // Dữ liệu sẽ được cache trong 5 phút
        enabled: !!startDate && !!endDate,  // Chỉ gọi API khi có `startDate` và `endDate`
    });
};


const fetchRevenueStats = async (mode: string, year?: number) => {
  try {
    const response = await axiosClient.get(`/stats/revenue-analysis`, {
      params: { mode, year }
    });

    console.log("Dữ liệu trả về từ API:", response.data);
    return response.data;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};



export const useRevenueStats = (mode: "month", year?: number) => {
    return useQuery({
        queryKey: ["RevenueStats", mode, year],
        queryFn: () => fetchRevenueStats(mode, year),
        staleTime: 1000 * 60 * 5,  // cache 5 phút
        enabled: !!mode,           // chỉ gọi API khi có mode
    });
};


const fetchCategoryStats = async () => {
  try {
    const response = await axiosClient.get(`/stats/category-summary`);

    console.log("Dữ liệu trả về từ API:", response.data);
    return response.data;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};



export const useCategoryStats = () => {
    return useQuery({
        queryKey: ["RevenueStats"],
        queryFn: () => fetchCategoryStats(),
        staleTime: 1000 * 60 * 5,  // cache 5 phút
    });
};