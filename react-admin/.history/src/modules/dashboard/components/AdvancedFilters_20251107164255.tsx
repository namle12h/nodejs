import React, { useState } from 'react';
import { ChevronDown, Calendar, Filter, X, ArrowDownToLine, Tag, Check } from 'lucide-react'; 
// Sử dụng thư viện lucide-react cho các icons

// ---------------------------------------------------
// 1. Component Dropdown tùy chỉnh (Cho Dịch vụ/Nhân viên)
// ---------------------------------------------------

const CustomDropdown = ({ data, type, isMultiSelect = true }) => {
    // State để theo dõi các mục đã chọn
    const [selectedItems, setSelectedItems] = useState([]);

    const handleToggle = (item) => {
        setSelectedItems(prev => {
            if (isMultiSelect) {
                // Logic cho Multi-select (Dịch vụ, Nhân viên)
                if (prev.includes(item)) {
                    return prev.filter(i => i !== item);
                } else {
                    return [...prev, item];
                }
            } else {
                // Logic cho Single-select (Loại khách hàng)
                return prev[0] === item ? [] : [item];
            }
        });
    };
    
    // Tùy chỉnh danh sách hiển thị cho Loại khách hàng
    if (type === 'customer') {
        data = [ 'Tất cả khách hàng', ...data.filter(d => d !== 'Tất cả khách hàng') ];
    }
    
    return (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {data.map((item, index) => {
                // Đối với Loại khách hàng, item là string
                const label = item.name || item; 
                const isSelected = selectedItems.includes(label);

                return (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                            type === 'customer' && isSelected ? 'bg-pink-50 font-medium' : ''
                        }`}
                        onClick={() => handleToggle(label)}
                    >
                        {/* Hiển thị Checkbox cho Dịch vụ & Nhân viên */}
                        {(isMultiSelect || label === 'Tất cả khách hàng') && (
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                        )}
                        
                        {/* Hiển thị Icon check cho Single-select (Loại khách hàng) */}
                        {(!isMultiSelect && isSelected && type !== 'customer') && (
                            <Check className="w-4 h-4 text-pink-600" />
                        )}

                        <span className={`flex-1 ml-2 text-sm ${type === 'customer' ? 'font-medium' : ''}`}>
                            {label}
                        </span>

                        {/* Nếu là Single-select "Loại khách hàng", checkbox sẽ nằm ngoài item "Tất cả..." */}
                        {type === 'customer' && !isMultiSelect && isSelected && label !== 'Tất cả khách hàng' && (
                            <Check className="w-4 h-4 text-pink-600" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ---------------------------------------------------
// 2. Component Select Wrapper (Trường nhập giả)
// ---------------------------------------------------

const SelectWrapper = ({ label, placeholder, data, type, isMultiSelect = true, isOpen, onToggle }) => {
    
    // State để theo dõi các mục đã chọn (giả định)
    // Thực tế bạn nên đưa state này lên component cha (AdvancedFilters)
    const [selectedItemsCount] = useState(0); 

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

// ---------------------------------------------------
// 3. Component Chính (AdvancedFilters)
// ---------------------------------------------------

export default function AdvancedFilters() {
    const [isFiltersVisible, setIsFiltersVisible] = useState(true); // Giữ là true để hiển thị mặc định

    // State để theo dõi dropdown nào đang mở
    const [openDropdown, setOpenDropdown] = useState(null); // 'service', 'staff', 'customer', 'branch'

    const handleToggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    // Dữ liệu mẫu
    const serviceData = [
        { name: "Massage Thư Giãn" },
        { name: "Chăm Sóc Da Mặt" },
        { name: "Tắm Trắng Toàn Thân" },
        { name: "Nail Art & Spa" },
        { name: "Liệu Pháp Đá Nóng" }
    ];
    
    const staffData = [
        { name: "Nguyễn Thị Lan" },
        { name: "Trần Văn Minh" },
        { name: "Lê Thị Hoa" },
        { name: "Phạm Văn Đức" },
        { name: "Hoàng Thị Mai" }
    ];

    const customerTypeData = [
        "Tất cả khách hàng", 
        "Khách hàng mới", 
        "Khách hàng quay lại", 
        "Khách hàng VIP", 
        "Thành viên"
    ];
    
    const branchData = [
        { name: "Tất cả chi nhánh" },
        { name: "Chi nhánh Quận 1" },
        { name: "Chi nhánh Quận 3" },
    ];


    // ... (Phần còn lại của component AdvancedFilters)
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            
            {/* ... PHẦN HEADER VÀ NÚT BỘ LỌC KHÔNG ĐỔI ... */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                {/* ... (Phần Header, Tiêu đề, nút Báo cáo) */}
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
                            <label className="text-sm font-medium text-gray-700">Khoảng thời gian</label>
                            <div className="relative">
                                <input type="text" placeholder="dd/mm/yyyy" className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8 focus:ring-pink-500 focus:border-pink-500" />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <input type="text" placeholder="dd/mm/yyyy" className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8 focus:ring-pink-500 focus:border-pink-500" />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Dịch vụ (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Dịch vụ" 
                            placeholder="Chọn dịch vụ" 
                            data={serviceData} 
                            type="service"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'service'}
                            onToggle={() => handleToggleDropdown('service')}
                        />
                        
                        {/* Nhân viên (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Nhân viên" 
                            placeholder="Chọn nhân viên" 
                            data={staffData} 
                            type="staff"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'staff'}
                            onToggle={() => handleToggleDropdown('staff')}
                        />
                        
                        {/* Loại khách hàng (Dropdown Single-select/Radio) */}
                        <SelectWrapper 
                            label="Loại khách hàng" 
                            placeholder="Tất cả khách hàng" 
                            data={customerTypeData}
                            type="customer"
                            isMultiSelect={false} // Là single-select, không có checkbox
                            isOpen={openDropdown === 'customer'}
                            onToggle={() => handleToggleDropdown('customer')}
                        />

                        {/* Chi nhánh (Dropdown Checkbox) */}
                        <SelectWrapper 
                            label="Chi nhánh" 
                            placeholder="Tất cả chi nhánh" 
                            data={branchData}
                            type="branch"
                            isMultiSelect={true}
                            isOpen={openDropdown === 'branch'}
                            onToggle={() => handleToggleDropdown('branch')}
                        />
                    </div>
                    
                    {/* Bộ lọc nhanh (Không thay đổi) */}
                    <div className="mt-6 flex items-center space-x-3">
                        {/* ... (Mã Bộ lọc nhanh) */}
                    </div>
                </div>
            )}
        </div>
    );
}