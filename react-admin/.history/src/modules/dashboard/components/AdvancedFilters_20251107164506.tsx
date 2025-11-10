import { useState } from 'react';
import { ChevronDown, X, Check } from 'lucide-react'; 

// ===================================================
// I. ĐỊNH NGHĨA INTERFACE (Kiểu dữ liệu)
// ===================================================

// Kiểu dữ liệu chung cho các mục trong Dropdown (Service, Staff, Branch)
interface DropdownItem {
    name: string;
    // Thêm các thuộc tính khác nếu cần (ví dụ: id: number)
}

// Kiểu dữ liệu cho các mục trong Loại khách hàng (chỉ là mảng string)
type CustomerTypeItem = string;

// Props cho CustomDropdown
interface CustomDropdownProps {
    data: DropdownItem[] | CustomerTypeItem[]; // Chấp nhận mảng DropdownItem hoặc mảng string
    type: 'service' | 'staff' | 'customer' | 'branch';
    isMultiSelect: boolean;
}

// Props cho SelectWrapper
interface SelectWrapperProps {
    label: string;
    placeholder: string;
    data: DropdownItem[] | CustomerTypeItem[];
    type: 'service' | 'staff' | 'customer' | 'branch';
    isMultiSelect: boolean;
    isOpen: boolean;
    onToggle: () => void;
}

// ===================================================
// II. CUSTOM DROPDOWN COMPONENT (Không lỗi 'data' any)
// ===================================================

const CustomDropdown = ({ data, type, isMultiSelect }: CustomDropdownProps) => {
    // State để theo dõi các mục đã chọn
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // Sử dụng string array cho tên/label

    const handleToggle = (item: string) => {
        setSelectedItems(prev => {
            if (isMultiSelect) {
                if (prev.includes(item)) {
                    return prev.filter(i => i !== item);
                } else {
                    return [...prev, item];
                }
            } else {
                // Logic Single-select: Nếu đã chọn, bỏ chọn, nếu chưa thì chọn mục mới
                return prev[0] === item ? [] : [item];
            }
        });
    };
    
    // Tùy chỉnh danh sách hiển thị cho Loại khách hàng
    const displayData = type === 'customer' ? (data as CustomerTypeItem[]) : (data as DropdownItem[]);

    return (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {displayData.map((item, index) => {
                const label = typeof item === 'string' ? item : item.name;
                const isSelected = selectedItems.includes(label);

                return (
                    <div
                        key={index}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                            !isMultiSelect && isSelected ? 'bg-pink-50' : ''
                        }`}
                        onClick={() => handleToggle(label)}
                    >
                        {/* Checkbox cho Multi-select */}
                        {isMultiSelect && (
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                        )}
                        
                        <span className={`flex-1 ${isMultiSelect ? 'ml-2' : ''} text-sm ${isSelected && !isMultiSelect ? 'font-medium text-pink-600' : 'text-gray-900'}`}>
                            {label}
                        </span>

                        {/* Icon check cho Single-select */}
                        {!isMultiSelect && isSelected && (
                            <Check className="w-4 h-4 text-pink-600" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ===================================================
// III. SELECT WRAPPER COMPONENT (Không lỗi 'data' any)
// ===================================================

const SelectWrapper = ({ label, placeholder, data, type, isMultiSelect, isOpen, onToggle }: SelectWrapperProps) => {
    
    // Giả định logic hiển thị số lượng mục đã chọn (cần state thực tế từ component cha)
    const selectedItemsCount = 0; 

    const getDisplayValue = () => {
        if (selectedItemsCount > 0) {
            return `${selectedItemsCount} đã chọn`;
        }
        return placeholder;
    };
    
    const displayValue = getDisplayValue();

    return (
        <div className="flex flex-col space-y-1 relative">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div 
                className={`w-full p-2.5 border rounded-lg text-gray-700 bg-white pr-8 cursor-pointer flex justify-between items-center ${
                    isOpen ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-300'
                }`}
                onClick={onToggle}
            >
                <span className={displayValue === placeholder ? 'text-gray-500' : 'text-gray-900'}>
                    {displayValue}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Hiển thị CustomDropdown khi isOpen là true */}
            {isOpen && <CustomDropdown data={data} type={type} isMultiSelect={isMultiSelect} />}
        </div>
    );
};


// ===================================================
// IV. MAIN COMPONENT
// ===================================================

export default function AdvancedFilters() {
    const [isFiltersVisible] = useState(true); 
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleToggleDropdown = (dropdownName: string) => { // Định nghĩa kiểu string cho dropdownName
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    // Dữ liệu mẫu (Gán kiểu dữ liệu đã định nghĩa)
    const serviceData: DropdownItem[] = [
        { name: "Massage Thư Giãn" },
        { name: "Chăm Sóc Da Mặt" },
        { name: "Tắm Trắng Toàn Thân" },
        { name: "Nail Art & Spa" },
        { name: "Liệu Pháp Đá Nóng" }
    ];
    
    const staffData: DropdownItem[] = [
        { name: "Nguyễn Thị Lan" },
        { name: "Trần Văn Minh" },
        { name: "Lê Thị Hoa" },
        { name: "Phạm Văn Đức" },
        { name: "Hoàng Thị Mai" }
    ];

    const customerTypeData: CustomerTypeItem[] = [
        "Tất cả khách hàng", 
        "Khách hàng mới", 
        "Khách hàng quay lại", 
        "Khách hàng VIP", 
        "Thành viên"
    ];
    
    const branchData: DropdownItem[] = [
        { name: "Tất cả chi nhánh" },
        { name: "Chi nhánh Quận 1" },
        { name: "Chi nhánh Quận 3" },
    ];


    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            
            {/* ... PHẦN HEADER VÀ NÚT BỘ LỌC ... */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900">Thống Kê Spa</h1>
                    <p className="text-sm text-gray-500">Tổng quan hiệu suất và doanh thu</p>
                </div>

                <div className="flex space-x-3 items-center">
                    {/* ... (Các nút điều khiển) */}
                </div>
            </div>

            {/* BỘ LỌC NÂNG CAO */}
            {isFiltersVisible && (
                <div className="mt-4 p-5 border border-gray-200 rounded-xl bg-gray-50">
                    
                    {/* Tiêu đề Bộ lọc nâng cao */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc nâng cao</h3>
                        <button className="text-pink-600 text-sm hover:underline flex items-center space-x-1">
                            <X className="w-4 h-4" />
                            <span>Xóa tất cả</span>
                        </button>
                    </div>

                    {/* Grid các trường Input/Select */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        
                        {/* Khoảng thời gian (Date Range) */}
                        <div className="flex flex-col space-y-1">
                            {/* ... (Input ngày tháng) ... */}
                        </div>

                        {/* Dịch vụ (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Dịch vụ" 
                            placeholder="Chọn dịch vụ" 
                            data={serviceData} // Đã gán kiểu DropdownItem[]
                            type="service"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'service'}
                            onToggle={() => handleToggleDropdown('service')}
                        />
                        
                        {/* Nhân viên (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Nhân viên" 
                            placeholder="Chọn nhân viên" 
                            data={staffData} // Đã gán kiểu DropdownItem[]
                            type="staff"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'staff'}
                            onToggle={() => handleToggleDropdown('staff')}
                        />
                        
                        {/* Loại khách hàng (Dropdown Single-select/Radio) */}
                        <SelectWrapper 
                            label="Loại khách hàng" 
                            placeholder="Tất cả khách hàng" 
                            data={customerTypeData} // Đã gán kiểu CustomerTypeItem[] (string[])
                            type="customer"
                            isMultiSelect={false}
                            isOpen={openDropdown === 'customer'}
                            onToggle={() => handleToggleDropdown('customer')}
                        />

                        {/* Chi nhánh (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Chi nhánh" 
                            placeholder="Tất cả chi nhánh" 
                            data={branchData} // Đã gán kiểu DropdownItem[]
                            type="branch"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'branch'}
                            onToggle={() => handleToggleDropdown('branch')}
                        />
                    </div>
                    
                    {/* ... (Bộ lọc nhanh) ... */}
                </div>
            )}
        </div>
    );
}