import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient"; // Import axiosClient

// Hàm gọi API để lấy thống kê dịch vụ
const fetchServiceStats = async (startDate: string, endDate: string, period: string) => {
    const response = await axiosClient.get(`/api/stats/appointment-stats`, {
        params: { startDate, endDate, period }
    });
    return response.data;  // Giả sử API trả về dữ liệu như bạn muốn
};

// Hook để lấy thống kê dịch vụ
export const useServiceStats = (startDate: string, endDate: string, period: string = "last_30_days") => {
    return useQuery(
        ["serviceStats", startDate, endDate, period],
        () => fetchServiceStats(startDate, endDate, period), 
        {
            staleTime: 1000 * 60 * 5,  // Dữ liệu sẽ được cache trong 5 phút
            enabled: !!startDate && !!endDate,  // Chỉ gọi API khi có `startDate` và `endDate`
        }
    );
};
