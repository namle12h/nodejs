// File: src/hooks/useNameLookupMaps.ts (hoặc thư mục hooks của bạn)

import { useMemo } from 'react';
import { useAllServices, useAllProducts } from '../../shared/services/serviceApi'; // 👈 Điều chỉnh đường dẫn này
import { ServiceDTO, ProductDTO } from '../../shared/types/type'; // 👈 Đảm bảo các DTO được import

// --- 1. KHAI BÁO KIỂU DỮ LIỆU ---

export interface NameMap {
    [id: number]: string;
}

interface ServiceData {
    id: number;
    name: string;
}

interface ProductData {
    id: number;
    name: string;
}


// --- 2. HOOK TRA CỨU TÊN ---

export const useNameLookupMaps = () => {
    const { data: serviceData, isLoading: isLoadingServices } = useAllServices();
    const { data: productData, isLoading: isLoadingProducts } = useAllProducts();

    // 🔄 TẠO MAP DỊCH VỤ (Service ID -> Name)
    const serviceNameMap: NameMap = useMemo(() => {
        // Giả định serviceData là mảng các object có 'id' và 'name'
        if (!serviceData || !Array.isArray(serviceData)) return {};
        return serviceData.reduce((acc, service: ServiceData) => {
            acc[service.id] = service.name;
            return acc;
        }, {} as NameMap);
    }, [serviceData]);

    // 🔄 TẠO MAP SẢN PHẨM (Product ID -> Name)
    const productNameMap: NameMap = useMemo(() => {
        // Giả định productData là mảng các object có 'id' và 'name'
        if (!productData || !Array.isArray(productData)) return {};
        return productData.reduce((acc, product: ProductData) => {
            acc[product.id] = product.name;
            return acc;
        }, {} as NameMap);
    }, [productData]);

    return {
        serviceNameMap,
        productNameMap,
        isLoading: isLoadingServices || isLoadingProducts,
        isReady: !isLoadingServices && !isLoadingProducts,
    };
};