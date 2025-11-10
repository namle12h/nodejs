// File: src/hooks/useNameLookupMaps.ts (hoặc thư mục hooks của bạn)

import { useMemo } from 'react';
import { useAllServices, useAllProducts } from '../../shared/services/serviceApi'; // 👈 Điều chỉnh đường dẫn này
import type { CustomerDTO, ProductDTO, ServiceDTO } from '../types/type';
import { useCustomerAll } from './customerApi';

// --- 1. KHAI BÁO KIỂU DỮ LIỆU ---

export interface NameMap {
    [id: number]: string;
}




// --- 2. HOOK TRA CỨU TÊN ---

export const useNameLookupMaps = () => {
    const { data: serviceData, isLoading: isLoadingServices } = useAllServices();
    const { data: productData, isLoading: isLoadingProducts } = useAllProducts();
    const { data: customerData, isLoading: isLoadingCustomers } = useCustomerAll();

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
// Trong file useNameLookupMaps.ts
const customerNameMap: NameMap = useMemo(() => {
    if (!customerData || !Array.isArray(customerData)) return {};
    
    return customerData.reduce((acc, customer: CustomerDTO) => {
        
        // 🥇 Ưu tiên 1: Tên đầy đủ (name) từ Customer DTO (Ví dụ: "Phương Anh Đào")
        // 🥈 Ưu tiên 2: receiverName (Nếu có trong DTO)
        // 🥉 Ưu tiên 3: Email (Nếu không có tên nào khác)
        const displayId = customer.name // ✅ SỬ DỤNG TRƯỜNG NAME CÓ TRONG DỮ LIỆU
                          ?? customer.receiverName 
                          ?? customer.email 
                          ?? `Khách hàng #${customer.id}`;
                          
        acc[customer.id] = displayId;
        return acc;
    }, {} as NameMap);
}, [customerData]);

    return {
        serviceNameMap,
        productNameMap,
        customerNameMap,
        isLoading: isLoadingServices || isLoadingProducts || isLoadingCustomers,
        isReady: !isLoadingServices && !isLoadingProducts && !isLoadingCustomers,
    };
};