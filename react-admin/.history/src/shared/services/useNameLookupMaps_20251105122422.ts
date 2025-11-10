// File: src/hooks/useNameLookupMaps.ts (hoặc thư mục hooks của bạn)

import { useMemo } from 'react';
import { useAllServices, useAllProducts } from '../../shared/services/serviceApi'; // 👈 Điều chỉnh đường dẫn này
import type { CustomerDTO, ProductDTO, ServiceDTO } from '../types/type';

// --- 1. KHAI BÁO KIỂU DỮ LIỆU ---

export interface NameMap {
    [id: number]: string;
}




// --- 2. HOOK TRA CỨU TÊN ---

export const useNameLookupMaps = () => {
    const { data: serviceData, isLoading: isLoadingServices } = useAllServices();
    const { data: productData, isLoading: isLoadingProducts } = useAllProducts();
    const { data: customerData, isLoading: isLoadingCustomers } = useAllCustomers();

    console.log("🔍 [FE] Dữ liệu dịch vụ cho lookup:", serviceData);
    console.log("🔍 [FE] Dữ liệu sản phẩm cho lookup:", productData);
    console.log("🔍 [FE] Dữ liệu khách hàng cho lookup:", customerData);
    // 🔄 TẠO MAP DỊCH VỤ (Service ID -> Name)
    const serviceNameMap: NameMap = useMemo(() => {
        // Giả định serviceData là mảng các object có 'id' và 'name'
        if (!serviceData || !Array.isArray(serviceData)) return {};
        return serviceData.reduce((acc, service: ServiceDTO) => {
            acc[service.id] = service.name;
            return acc;
        }, {} as NameMap);
    }, [serviceData]);



    // 🔄 TẠO MAP SẢN PHẨM (Product ID -> Name)
    const productNameMap: NameMap = useMemo(() => {
        // Giả định productData là mảng các object có 'id' và 'name'
        if (!productData || !Array.isArray(productData)) return {};
        return productData.reduce((acc, product: ProductDTO) => {
            acc[product.id] = product.name;
            return acc;
        }, {} as NameMap);
    }, [productData]);

    const customerNameMap: NameMap = useMemo(() => {
        if (!customerData || !Array.isArray(customerData)) return {};
        return customerData.reduce((acc, customer: CustomerDTO) => {
            // Ưu tiên receiverName nếu có, nếu không lấy email/fallback
            const displayId = customer.receiverName ?? customer.email ?? `Khách hàng #${customer.id}`;
            acc[customer.id] = displayId;
            return acc;
        }, {} as NameMap);
    }, [customerData]);

    return {
        serviceNameMap,
        productNameMap,
        isLoading: isLoadingServices || isLoadingProducts,
        isReady: !isLoadingServices && !isLoadingProducts,
    };
};