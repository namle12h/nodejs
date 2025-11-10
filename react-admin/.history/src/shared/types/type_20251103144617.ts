// --- Kiểu dữ liệu cho các Entity liên quan (DTOs) ---

export interface CustomerDTO {
    id: number;
    receiverName: string;
    email: string;
    // Thêm các trường khác như phone nếu cần
}

export interface ServiceDTO {
    id: number;
    name: string;
    imageUrl?: string | null; // Có thể null
}

export interface ProductDTO {
    id: number;
    name: string;
    imageUrl?: string | null; // Có thể null
}

// --- Cấu trúc chi tiết hóa đơn (Item) ---

export interface ApiInvoiceItem {
    id: number;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    // 🎯 THAY THẾ ID BẰNG OBJECT DTO
    service: ServiceDTO | null; 
    product: ProductDTO | null; 
}


// --- Cấu trúc Hóa đơn Chính (Invoice) ---

export interface ApiInvoice {
    id: number;
    appointmentId: number | null;
    // 🎯 THAY THẾ customerId BẰNG OBJECT DTO
    customer: CustomerDTO; 
    
    vat: number;
    discountAmount: number;
    total: number;
    status: 'PAID' | 'PENDING' | 'FAILED' | 'DRAFT'; 
    paymentMethod: 'cash' | 'card' | 'qr' | 'wallet'; 
    txnRef: string | null;
    createdAt: string; 
    updatedAt: string;
    
    // 🎯 SỬ DỤNG ITEM CÓ OBJECT DTO
    items: ApiInvoiceItem[]; 
    
    // Thêm các trường từ OrderServiceImpl (nếu bạn gộp 2 Service):
    receiverName?: string | null; 
    receiverPhone?: string | null; 
    // ...
}

// --- Kiểu dữ liệu cho Bảng Hiển thị (Order) (Giữ nguyên cho sự tương thích UI) ---

export interface Order {
    id: string; 
    type: 'Appointment' | 'Product';
    customer: string; 
    email: string; 
    product: string; 
    value: string;
    date: string;
    time: string;
    status: 'Hoàn thành' | 'Đang xử lý' | 'Chờ xử lý' | 'Thất bại';
}

// --- Kiểu dữ liệu cho Request (Đầu vào) (Giữ nguyên) ---

export interface InvoiceCreateRequest {
    // ... (Giữ nguyên)
}