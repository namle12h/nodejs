import { useState } from 'react';
import { ChevronDown, X, Check, Calendar, Tag } from 'lucide-react'; 

// ===================================================
// I. ĐỊNH NGHĨA INTERFACE (Giữ nguyên)
// ===================================================
interface DropdownItem { name: string; }
type CustomerTypeItem = string;
interface CustomDropdownProps { data: DropdownItem[] | CustomerTypeItem[]; type: 'service' | 'staff' | 'customer' | 'branch'; isMultiSelect: boolean; }
interface SelectWrapperProps { 
    label: string; 
    placeholder: string; 
    data: DropdownItem[] | CustomerTypeItem[]; 
    type: 'service' | 'staff' | 'customer' | 'branch'; 
    isMultiSelect: boolean; 
    isOpen: boolean; 
    onToggle: () => void;
    value: string | string[]; 
    onChange: React.Dispatch<React.SetStateAction<string | string[]>>;
}

// ---------------------------------------------------
// CUSTOM DROPDOWN COMPONENT (Không đổi)
// ---------------------------------------------------
const CustomDropdown = ({ data, type, isMultiSelect, value, onChange }: CustomDropdownProps & { value: string | string[], onChange: (newValue: string | string[]) => void }) => {
    const selectedItems = Array.isArray(value) ? value : (value ? [value] : []);
    const handleToggle = (item: string) => {
        if (isMultiSelect) {
            const isSelected = selectedItems.includes(item);
            const newSelection = isSelected 
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item];
            onChange(newSelection);
        } else {
            const newSelection = selectedItems[0] === item ? "" : item;
            onChange(newSelection);
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

            {isOpen && <CustomDropdown data={data} type={type} isMultiSelect={isMultiSelect} value={value} onChange={onChange} />}
        </div>
    );
};


// ===================================================
// III. MAIN COMPONENT (AdvancedFilters)
// ===================================================

export default function AdvancedFilters() {
    
    // Dữ liệu mẫu (Không đổi)
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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedService, setSelectedService] = useState<string[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [selectedCustomerType, setSelectedCustomerType] = useState('Tất cả khách hàng');
    const [selectedBranch, setSelectedBranch] = useState('Tất cả chi nhánh');
    
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


    return (
        // Loại bỏ padding/margin/background của thẻ cha để DashBoardPage kiểm soát
        <div className="p-4 rounded-xl border border-gray-200 bg-white/50">
            
            {/* Tiêu đề Bộ lọc nâng cao & Nút Reset */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Bộ lọc nâng cao</h3>
                <button 
                    onClick={handleReset} // 👈 Gắn hàm reset vào nút
                    className="text-pink-600 text-sm hover:underline flex items-center space-x-1 font-medium"
                >
                    <span>Xóa tất cả</span>
                </button>
            </div>

            {/* Grid các trường Input/Select - BỐ CỤC CHÍNH CẦN TINH CHỈNH */}
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

                {/* 2. Dịch vụ (Chiếm 1 cột) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Dịch vụ" 
                        placeholder="Chọn dịch vụ" 
                        data={serviceData} type="service" isMultiSelect={true} 
                        isOpen={openDropdown === 'service'} onToggle={() => handleToggleDropdown('service')}
                        value={selectedService} onChange={setSelectedService}
                    />
                </div>
                
                {/* 3. Nhân viên (Chiếm 1 cột) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Nhân viên" 
                        placeholder="Chọn nhân viên" 
                        data={staffData} type="staff" isMultiSelect={true} 
                        isOpen={openDropdown === 'staff'} onToggle={() => handleToggleDropdown('staff')}
                        value={selectedStaff} onChange={setSelectedStaff}
                    />
                </div>
                
                {/* 4. Loại khách hàng (Chiếm 1 cột) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Loại khách hàng" 
                        placeholder="Tất cả khách hàng" 
                        data={customerTypeData} type="customer" isMultiSelect={false} 
                        isOpen={openDropdown === 'customer'} onToggle={() => handleToggleDropdown('customer')}
                        value={selectedCustomerType} onChange={setSelectedCustomerType}
                    />
                </div>

                {/* 5. Chi nhánh (Chiếm 1 cột) */}
                <div className="col-span-1">
                    <SelectWrapper 
                        label="Chi nhánh" 
                        placeholder="Tất cả chi nhánh" 
                        data={branchData} type="branch" isMultiSelect={false} 
                        isOpen={openDropdown === 'branch'} onToggle={() => handleToggleDropdown('branch')}
                        value={selectedBranch} onChange={setSelectedBranch}
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