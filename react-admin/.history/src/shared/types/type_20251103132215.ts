// --- Kiểu dữ liệu API trả về ---

export interface ApiInvoiceItem {
    id: number;
    serviceId: number | null; // ID dịch vụ
    productId: number | null; // ID sản phẩm
    qty: number;
    unitPrice: number;
    lineTotal: number;
    // Bổ sung các trường cần thiết khác
}

export interface ApiInvoice {
    id: number;
    appointmentId: number | null;
    customerId: number;
    vat: number;
    discountAmount: number;
    total: number;
    amountPaid: number;
    changeAmount: number | null;
    status: 'PAID' | 'PENDING' | 'FAILED' | 'DRAFT'; // Trạng thái API
    paymentMethod: 'cash' | 'card' | 'qr' | 'wallet'; // Phương thức thanh toán
    txnRef: string | null;
    createdAt: string; // Giả định có trường thời gian tạo
    updatedAt: string;
    items: ApiInvoiceItem[];
    // ... các trường khác
}

// --- Kiểu dữ liệu cho Request (Đầu vào) ---

export interface InvoiceCreateRequest {
    appointmentId: number | null;
    customerId: number;
    vat: number;
    discountAmount: number;
    items: {
        serviceId?: number;
        productId?: number;
        quantity: number;
        price: number;
    }[];
    paymentMethod: 'cash' | 'transfer' | 'qr'; 
}

// --- Kiểu dữ liệu cho Bảng Hiển thị (Order) ---
// Dùng trong component OrderProductPage

export interface Order {
    id: string; // Định dạng INV-ID
    type: 'Appointment' | 'Product';
    customer: string; // Tên khách hàng (cần lookup/join)
    email: string; // Email khách hàng
    product: string; // Tên dịch vụ/sản phẩm chính (cần lookup/join)
    value: string;
    date: string;
    time: string;
    status: 'Hoàn thành' | 'Đang xử lý' | 'Chờ xử lý' | 'Thất bại';
}