import { useState } from 'react';
import { ChevronDown, X, Check, Calendar, Tag } from 'lucide-react'; 
import React from 'react'; // Cần import React để dùng React.Dispatch

// ===================================================
// I. ĐỊNH NGHĨA INTERFACE
// ===================================================
interface DropdownItem { name: string; }
type CustomerTypeItem = string;

// Props cho CustomDropdown (chỉ dùng nội bộ cho CustomDropdown)
interface CustomDropdownBaseProps { 
    data: DropdownItem[] | CustomerTypeItem[]; 
    type: 'service' | 'staff' | 'customer' | 'branch'; 
    isMultiSelect: boolean; 
}

// Props cho SelectWrapper (Đây là kiểu public)
interface SelectWrapperProps { 
    label: string; 
    placeholder: string; 
    data: DropdownItem[] | CustomerTypeItem[]; 
    type: 'service' | 'staff' | 'customer' | 'branch'; 
    isMultiSelect: boolean; 
    isOpen: boolean; 
    onToggle: () => void;
    
    // Kiểu dữ liệu chấp nhận: string (single) hoặc string[] (multi)
    value: string | string[]; 
    
    // Kiểu hàm setState của React, chấp nhận cập nhật state với cả string và string[]
    onChange: React.Dispatch<React.SetStateAction<string | string[]>>;
}

// ---------------------------------------------------
// CUSTOM DROPDOWN COMPONENT (Đã sửa lỗi kiểu dữ liệu)
// ---------------------------------------------------
// Component này nhận props phức tạp hơn một chút do cần phải xử lý cả string và string[]
const CustomDropdown = ({ data, type, isMultiSelect, value, onChange }: CustomDropdownBaseProps & { value: string | string[], onChange: React.Dispatch<React.SetStateAction<string | string[]>> }) => {
    
    // Đảm bảo value là mảng (cho multi-select) hoặc chuỗi (cho single-select)
    const selectedItems = Array.isArray(value) ? value : (value ? [value] : []);

    const handleToggle = (item: string) => {
        if (isMultiSelect) {
            // Logic cho Multi-select: newSelection là string[]
            const isSelected = selectedItems.includes(item);
            const newSelection = isSelected 
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item];
            
            // Ép kiểu newSelection thành kiểu mà onChange chấp nhận
            onChange(newSelection as React.SetStateAction<string | string[]>);
        } else {
            // Logic cho Single-select: newSelection là string
            const newSelection = selectedItems[0] === item ? "" : item;
            
            // Ép kiểu newSelection thành kiểu mà onChange chấp nhận
            onChange(newSelection as React.SetStateAction<string | string[]>);
            
        }
    };
    
    const displayData = type === 'customer' ? (data as CustomerTypeItem[]) : (data as DropdownItem[]);

    return (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {displayData.map((item, index) => {
                const label = typeof item === 'string' ? item : item.name;
                const isSelected = selectedItems.includes(label);

                return (
                    <div
                        key={index}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${!isMultiSelect && isSelected ? 'bg-pink-50' : ''}`}
                        onClick={() => handleToggle(label)}
                    >
                        {isMultiSelect && (<input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />)}
                        <span className={`flex-1 ${isMultiSelect ? 'ml-2' : ''} text-sm ${isSelected && !isMultiSelect ? 'font-medium text-pink-600' : 'text-gray-900'}`}>{label}</span>
                        {!isMultiSelect && isSelected && (<Check className="w-4 h-4 text-pink-600" />)}
                    </div>
                );
            })}
        </div>
    );
};

// ---------------------------------------------------
// SELECT WRAPPER COMPONENT (Không đổi)
// ---------------------------------------------------
const SelectWrapper = ({ label, placeholder, data, type, isMultiSelect, isOpen, onToggle, value, onChange }: SelectWrapperProps) => {
    
    const displayValue = Array.isArray(value) && value.length > 0
        ? `${value.length} đã chọn`
        : (typeof value === 'string' && value ? value : placeholder);

    return (
        <div className="flex flex-col space-y-1 relative">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div 
                className={`w-full p-2.5 border rounded-lg text-gray-700 bg-white pr-8 cursor-pointer flex justify-between items-center ${
                    isOpen ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-300'
                }`}
                onClick={onToggle}
            >
                <span className={displayValue === placeholder ? 'text-gray-500' : 'text-gray-900'}>{displayValue}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Truyền props xuống CustomDropdown */}
            {isOpen && <CustomDropdown data={data} type={type} isMultiSelect={isMultiSelect} value={value} onChange={onChange} />}
        </div>
    );
};


// ===================================================
// III. MAIN COMPONENT (AdvancedFilters)
// ===================================================

export default function AdvancedFilters() {
    
    // Dữ liệu mẫu 
    const serviceData: DropdownItem[] = [{ name: "Massage Thư Giãn" }, { name: "Chăm Sóc Da Mặt" }, { name: "Tắm Trắng Toàn Thân" }, { name: "Nail Art & Spa" }, { name: "Liệu Pháp Đá Nóng" }];
    const staffData: DropdownItem[] = [{ name: "Nguyễn Thị Lan" }, { name: "Trần Văn Minh" }, { name: "Lê Thị Hoa" }, { name: "Phạm Văn Đức" }, { name: "Hoàng Thị Mai" }];
    const customerTypeData: CustomerTypeItem[] = ["Tất cả khách hàng", "Khách hàng mới", "Khách hàng quay lại", "Khách hàng VIP", "Thành viên"];
    const branchData: DropdownItem[] = [{ name: "Tất cả chi nhánh" }, { name: "Chi nhánh Quận 1" }, { name: "Chi nhánh Quận 3" }];
    const quickFilters = [
        { label: "Khách hàng mới", color: "text-blue-500 bg-blue-500/10" },
        { label: "Khách VIP", color: "text-purple-500 bg-purple-500/10" },
        { label: "Massage phổ biến", color: "text-pink-500 bg-pink-500/10" },
    ];

    // Trạng thái cho các bộ lọc
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    // Sử dụng string[] cho multi-select
    const [selectedService, setSelectedService] = useState<string[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    
    // Sử dụng string cho single-select
    const [selectedCustomerType, setSelectedCustomerType] = useState<string>('Tất cả khách hàng');
    const [selectedBranch, setSelectedBranch] = useState<string>('Tất cả chi nhánh');
    
    // Hàm xử lý Reset
    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSelectedService([]);
        setSelectedStaff([]);
        setSelectedCustomerType('Tất cả khách hàng');
        setSelectedBranch('Tất cả chi nhánh');
        setOpenDropdown(null); 
    };

    const handleToggleDropdown = (dropdownName: string) => { 
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    // Hàm tiện ích để đảm bảo kiểu dữ liệu luôn là Dispatch<SetStateAction<string | string[]>>
    // Cần thiết vì setSelectedService là Dispatch<SetStateAction<string[]>> (kiểu con)
    const setServiceWrapper = setSelectedService as React.Dispatch<React.SetStateAction<string | string[]>>;
    const setStaffWrapper = setSelectedStaff as React.Dispatch<React.SetStateAction<string | string[]>>;
    const setCustomerWrapper = setSelectedCustomerType as React.Dispatch<React.SetStateAction<string | string[]>>;
    const setBranchWrapper = setSelectedBranch as React.Dispatch<React.SetStateAction<string | string[]>>;


    return (
        <div className="p-4 rounded-xl border border-gray-200 bg-white/50">
            
            {/* Tiêu đề Bộ lọc nâng cao & Nút Reset */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Bộ lọc nâng cao</h3>
                <button 
                    onClick={handleReset} 
                    className="text-pink-600 text-sm hover:underline flex items-center space-x-1 font-medium"
                >
                    <span>Xóa tất cả</span>
                </button>
            </div>

            {/* Grid các trường Input/Select - BỐ CỤC ĐÃ TINH CHỈNH */}
            <div className="grid grid-cols-5 gap-4">
                
                {/* 1. Khoảng thời gian (Chiếm 1 cột) */}
                <div className="col-span-1 flex flex-col space-y-2"> 
                    <label className="text-sm font-medium text-gray-700">Khoảng thời gian</label>
                    
                    {/* Input Start Date */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="dd/mm/yyyy" 
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8 focus:ring-pink-500 focus:border-pink-500" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    
                    {/* Input End Date */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="dd/mm/yyyy" 
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8 focus:ring-pink-500 focus:border-pink-500" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* 2. Dịch vụ (Multi-select) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Dịch vụ" 
                        placeholder="Chọn dịch vụ" 
                        data={serviceData} type="service" isMultiSelect={true} 
                        isOpen={openDropdown === 'service'} onToggle={() => handleToggleDropdown('service')}
                        value={selectedService} onChange={setServiceWrapper} // 👈 SỬA: Dùng Wrapper
                    />
                </div>
                
                {/* 3. Nhân viên (Multi-select) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Nhân viên" 
                        placeholder="Chọn nhân viên" 
                        data={staffData} type="staff" isMultiSelect={true} 
                        isOpen={openDropdown === 'staff'} onToggle={() => handleToggleDropdown('staff')}
                        value={selectedStaff} onChange={setStaffWrapper} // 👈 SỬA: Dùng Wrapper
                    />
                </div>
                
                {/* 4. Loại khách hàng (Single-select) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Loại khách hàng" 
                        placeholder="Tất cả khách hàng" 
                        data={customerTypeData} type="customer" isMultiSelect={false} 
                        isOpen={openDropdown === 'customer'} onToggle={() => handleToggleDropdown('customer')}
                        value={selectedCustomerType} onChange={setCustomerWrapper} // 👈 SỬA: Dùng Wrapper
                    />
                </div>

                {/* 5. Chi nhánh (Single-select) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Chi nhánh" 
                        placeholder="Tất cả chi nhánh" 
                        data={branchData} type="branch" isMultiSelect={false} 
                        isOpen={openDropdown === 'branch'} onToggle={() => handleToggleDropdown('branch')}
                        value={selectedBranch} onChange={setBranchWrapper} // 👈 SỬA: Dùng Wrapper
                    />
                </div>
            </div>
            
            {/* Bộ lọc nhanh */}
            <div className="mt-6 flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Bộ lọc nhanh:</span>
                {quickFilters.map((filter, index) => (
                    <button
                        key={index}
                        className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors ${filter.color} hover:opacity-80`}
                    >
                        <Tag className="w-3 h-3 mr-1" />
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}