import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axiosClient";
import { message } from "antd";


type AddSectionItemParams = {
    serviceId: number;
    type: string;
    data: any;
};
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

// ✅ Lấy chi tiết service theo ID
export const useServiceById = (id?: number) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => fetchServiceById(id!),
        enabled: !!id, // chỉ gọi khi có id hợp lệ
        staleTime: 1000 * 60 * 5,
    });
};

export const addServiceSectionItem = async ({ serviceId, type, data }: any) => {
    const formData = new FormData();

    formData.append("dto", new Blob([JSON.stringify(data)], { type: "application/json" }));

    // ✅ Xử lý riêng cho từng loại
    if (data.extraData) {
        const extra = JSON.parse(data.extraData);

        // 🩵 TYPE: benefit → có ảnh
        if (type === "benefit") {
            if (typeof extra.before === "string" && extra.before.startsWith("data:image")) {
                const beforeFile = base64ToFile(extra.before, "before.jpg");
                formData.append("beforeImage", beforeFile);
            }

            if (typeof extra.after === "string" && extra.after.startsWith("data:image")) {
                const afterFile = base64ToFile(extra.after, "after.jpg");
                formData.append("afterImage", afterFile);
            }
        }


        // 💛 TYPE: notes → chỉ có text
        if (type === "note") {
            data.extraData = JSON.stringify(extra);
            formData.set("dto", new Blob([JSON.stringify(data)], { type: "application/json" }));
        }

    }
    

    const res = await axiosClient.post(
        `/services/${serviceId}/sections/${type}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    console.log("🚀 [POST API]",res);
    console.log("📦 Payload data:", data);
    return res.data;
};


// export const addServiceSectionItem = async ({ serviceId, type, data }: any) => {
//     const formData = new FormData();

//     // ✅ JSON phần dto
//     formData.append(
//         "dto",
//         new Blob([JSON.stringify(data)], { type: "application/json" })
//     );

//     // ✅ Convert base64 → File (nếu có)
//     if (data.image) {
//         const file = base64ToFile(data.image, "image.jpg");
//         formData.append("file", file);
//     }

//     if (data.extraData) {
//         const extra = JSON.parse(data.extraData);

//         if (extra.before && extra.before.startsWith("data:image")) {
//             const beforeFile = base64ToFile(extra.before, "before.jpg");
//             formData.append("beforeImage", beforeFile);
//         }

//         if (extra.after && extra.after.startsWith("data:image")) {
//             const afterFile = base64ToFile(extra.after, "after.jpg");
//             formData.append("afterImage", afterFile);
//         }
//     }

//     const res = await axiosClient.post(
//         `/services/${serviceId}/sections/${type}`,
//         formData,
//         {
//             headers: { "Content-Type": "multipart/form-data" },
//         }
//     );
//     return res.data;
// };


// Helper: convert base64 → File
function base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime || "image/jpeg" });
}


export const useAddServiceSectionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addServiceSectionItem,
        onSuccess: () => {
            message.success("Thêm bước vào liệu trình thành công 🎉");
            queryClient.invalidateQueries({ queryKey: ["service"] }); // reload service detail
        },
        onError: (error: any) => {
            console.error("FE error:", error.response?.data);
            message.error(error.response?.data?.message || "Thêm bước thất bại ❌");
        },
    });
};


export const fetchServiceSectionItems = async (serviceId: number, type: string) => {
    const res = await axiosClient.get(`/services/${serviceId}/sections/${type}`);
    return res.data;
};

export const useServiceSectionItems = (serviceId: number, type: string) => {
    console.log("🔍 [FE] Gọi API:", `/services/${serviceId}/sections/${type}`);
    return useQuery({
        queryKey: ["service-section-items", serviceId, type],
        queryFn: () => fetchServiceSectionItems(serviceId, type),
        enabled: !!serviceId && !!type,
    });
};
