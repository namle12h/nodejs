import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Tag } from 'lucide-react';
import { useServices } from '../../../shared/services/serviceApi';
import { useStaffs } from '../../../shared/services/staffApi';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Cấu hình plugin Day.js
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// ===================================================
// I. TYPES / INTERFACES
// ===================================================
interface DropdownItem { name: string }
type CustomerTypeItem = string;
type DropdownType = 'service' | 'staff' | 'customer';

type CommonDropdownProps = {
  data: DropdownItem[] | CustomerTypeItem[];
  type: DropdownType;
};

type CustomDropdownMultiProps = CommonDropdownProps & {
  isMultiSelect: true;
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

type CustomDropdownSingleProps = CommonDropdownProps & {
  isMultiSelect: false;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

type CustomDropdownProps = CustomDropdownMultiProps | CustomDropdownSingleProps;

type CommonSelectProps = {
  label: string;
  placeholder: string;
  data: DropdownItem[] | CustomerTypeItem[];
  type: DropdownType;
  isOpen: boolean;
  onToggle: () => void;
};

type SelectWrapperMultiProps = CommonSelectProps & {
  isMultiSelect: true;
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

type SelectWrapperSingleProps = CommonSelectProps & {
  isMultiSelect: false;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

type SelectWrapperProps = SelectWrapperMultiProps | SelectWrapperSingleProps;

// ===================================================
// II. CUSTOM DROPDOWN
// ===================================================
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data, type, isMultiSelect, value, onChange
}) => {
  const selectedItems = Array.isArray(value) ? value : (value ? [value] : []);
  const displayData = type === 'customer'
    ? (data as CustomerTypeItem[])
    : (data as DropdownItem[]);

  const toggle = (item: string) => {
    if (isMultiSelect) {
      const arr = value as string[];
      const exists = arr.includes(item);
      const next = exists ? arr.filter(i => i !== item) : [...arr, item];
      (onChange as React.Dispatch<React.SetStateAction<string[]>>)(next);
    } else {
      const current = value as string;
      const next = current === item ? '' : item;
      (onChange as React.Dispatch<React.SetStateAction<string>>)(next);
    }
  };

  return (
    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
      {displayData.map((item, idx) => {
        const label = typeof item === 'string' ? item : item.name;
        const isSelected = selectedItems.includes(label);
        const singleStyles = isSelected && !isMultiSelect
          ? 'bg-pink-50 font-medium text-pink-600'
          : 'text-gray-900';

        return (
          <div
            key={idx}
            className={`flex items-center p-3 cursor-pointer transition-colors ${isMultiSelect ? 'hover:bg-gray-100' : `hover:bg-pink-50/50 ${singleStyles}`
              } ${singleStyles}`}
            onClick={() => toggle(label)}
          >
            {isMultiSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
            )}
            <span className={`flex-1 ${isMultiSelect ? 'ml-2' : ''} text-sm`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ===================================================
// III. SELECT WRAPPER
// ===================================================
const SelectWrapper: React.FC<SelectWrapperProps> = ({
  label, placeholder, data, type, isMultiSelect, isOpen, onToggle, value, onChange
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && isOpen) {
        onToggle();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onToggle]);

  const displayValue =
    (Array.isArray(value) && value.length > 0)
      ? `${value.length} đã chọn`
      : (typeof value === 'string' && value ? value : placeholder);

  return (
    <div className="flex flex-col space-y-1 relative" ref={wrapperRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`w-full p-2.5 border rounded-lg text-gray-700 bg-white pr-8 cursor-pointer flex justify-between items-center ${isOpen ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-300'
          }`}
        onClick={onToggle}
      >
        <span className={displayValue === placeholder ? 'text-gray-500' : 'text-gray-900'}>
          {displayValue}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </div>

      {isOpen && (
        <CustomDropdown
          data={data}
          type={type}
          isMultiSelect={isMultiSelect as any}
          value={value as any}
          onChange={onChange as any}
        />
      )}
    </div>
  );
};

interface AdvancedFiltersProps {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  onDateChange: (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null) => void;
}

// ===================================================
// IV. MAIN COMPONENT
// ===================================================
export default function AdvancedFilters({ startDate, endDate, onDateChange }: AdvancedFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<null | DropdownType>(null);
  // const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  // const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const handleDateChange = (newStartDate: dayjs.Dayjs | null, newEndDate: dayjs.Dayjs | null) => {
    onDateChange(newStartDate, newEndDate);
  };

  const { data: servicesData, isLoading: isLoadingServices } = useServices();
  const { data: staffsData, isLoading: isLoadingStaffs } = useStaffs();

  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('Tất cả khách hàng');

  const customerTypeData: CustomerTypeItem[] = [
    'Tất cả khách hàng', 'Khách hàng mới', 'Khách hàng quay lại', 'Khách hàng VIP', 'Thành viên'
  ];

  const serviceOptions: DropdownItem[] = Array.isArray(servicesData)
    ? servicesData.map((s: any) => ({ name: s.name ?? s.title ?? String(s) }))
    : [];
  const staffOptions: DropdownItem[] = Array.isArray(staffsData)
    ? staffsData.map((s: any) => ({ name: s.name ?? s.fullName ?? String(s) }))
    : [];

  const loading = isLoadingServices || isLoadingStaffs;

  const handleReset = () => {
    onDateChange(null, null);
    setSelectedService([]);
    setSelectedStaff([]);
    setSelectedCustomerType('Tất cả khách hàng');
    setOpenDropdown(null);

  };


  const toggleDropdown = (name: DropdownType) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const quickFilters = [
    { label: 'Khách hàng mới', color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Khách VIP', color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Massage phổ biến', color: 'text-pink-500 bg-pink-500/10' },
  ];

  const calculateDaysDifference = () => {
    if (startDate && endDate) {
      return endDate.diff(startDate, 'day'); // Sử dụng dayjs để tính số ngày giữa 2 ngày
    }
    return 0;
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white/50">
      {/* Header + Reset */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc nâng cao</h3>
        <button
          onClick={handleReset}
          className="text-pink-600 text-sm hover:underline flex items-center space-x-1 font-medium"
        >
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* 1. Khoảng thời gian */}
        <div className="col-span-2 flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Khoảng thời gian</label>
          <div className="flex space-x-4">
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8"
              value={startDate ? startDate.format('YYYY-MM-DD') : ''}
              onChange={(e) => handleDateChange(dayjs(e.target.value), endDate)}
            />
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 pr-8"
              value={endDate ? endDate.format('YYYY-MM-DD') : ''}
              onChange={(e) => handleDateChange(startDate, dayjs(e.target.value))}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span>{`Số ngày: ${calculateDaysDifference()}`}</span>
          </div>
        </div>

        {/* 2. Dịch vụ (Multi) */}
        <div className="col-span-1">
          <SelectWrapper
            label="Dịch vụ"
            placeholder="Chọn dịch vụ"
            data={serviceOptions}
            type="service"
            isMultiSelect={true}
            isOpen={openDropdown === 'service'}
            onToggle={() => toggleDropdown('service')}
            value={selectedService}
            onChange={setSelectedService}

          />
        </div>

        {/* 3. Nhân viên (Multi) */}
        <div className="col-span-1">
          <SelectWrapper
            label="Nhân viên"
            placeholder="Chọn nhân viên"
            data={staffOptions}
            type="staff"
            isMultiSelect={true}
            isOpen={openDropdown === 'staff'}
            onToggle={() => toggleDropdown('staff')}
            value={selectedStaff}
            onChange={setSelectedStaff}
          />
        </div>

        {/* 4. Loại khách hàng (Single) */}
        <div className="col-span-1">
          <SelectWrapper
            label="Loại khách hàng"
            placeholder="Tất cả khách hàng"
            data={customerTypeData}
            type="customer"
            isMultiSelect={false}
            isOpen={openDropdown === 'customer'}
            onToggle={() => toggleDropdown('customer')}
            value={selectedCustomerType}
            onChange={setSelectedCustomerType}
          />
        </div>
      </div>

      {/* Bộ lọc nhanh */}
      <div className="mt-6 flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Bộ lọc nhanh:</span>
        {quickFilters.map((f, i) => (
          <button
            key={i}
            className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors ${f.color} hover:opacity-80`}
          >
            <Tag className="w-3 h-3 mr-1" />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
