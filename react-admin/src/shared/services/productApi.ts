import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { axiosClient } from "../lib/axiosClient";



export const fetchProducts = async () => {
    const res = await axiosClient.get(`/products`);
    return res.data;
};

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
    });
};


export const fetchServiceProducts = async (serviceId: number) => {
  const res = await axiosClient.get(`/services/${serviceId}/products`);
  return res.data;
};

export const useServiceProducts = (serviceId: number) => {
  return useQuery({
    queryKey: ["service-products", serviceId],
    queryFn: () => fetchServiceProducts(serviceId),
    enabled: !!serviceId,
  });
};

// ✅ Xóa sản phẩm khỏi dịch vụ
export const deleteServiceProduct = async ({ serviceId, id }: any) => {
  const res = await axiosClient.delete(`/services/${serviceId}/products/${id}`);
  return res.data;
};

export const useDeleteServiceProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceProduct,
    onSuccess: (_, variables) => {
      message.success("Đã xóa sản phẩm khỏi dịch vụ!");
      queryClient.invalidateQueries({ queryKey: ["service-products", variables.serviceId] });
    },
    onError: () => message.error("Không thể xóa sản phẩm!"),
  });
};


export const addServiceProduct = async ({ serviceId, productId, quantity, note }: any) => {
    const res = await axiosClient.post(`/services/${serviceId}/products`, {
        productId,
        quantity,
        note,
    });
    return res.data;
};

export const useAddServiceProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addServiceProduct,
        onSuccess: () => {
            message.success("Đã thêm sản phẩm vào dịch vụ 🎉");
            queryClient.invalidateQueries({ queryKey: ["service-products"] });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || "Thêm sản phẩm thất bại ❌");
        },
    });
};
