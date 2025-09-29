


'use client'
import { Menu, Input, Button } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { MdSpa } from 'react-icons/md';

const menuItems = [
    { key: 'home', label: 'Trang Chủ' },
    { key: 'services', label: 'Dịch Vụ' },
    { key: 'booking', label: 'Đặt Lịch' },
    { key: 'about', label: 'Về Chúng Tôi' },
    { key: 'contact', label: 'Liên Hệ' },
];

export default function Header() {
    return (
        <header className="fixed w-full z-30 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                <MdSpa  className="text-pink-500 text-2xl m-2" />
                <div className="font-bold text-pink-600 text-xl "> Bella Spa</div>

                <Menu
                    mode="horizontal"
                    className="hidden md:flex flex-1 justify-center border-none"
                    items={menuItems}
                />

                <div className="flex items-center gap-3">
                    <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm dịch vụ..." className="hidden md:block w-60" />
                    <Button  type="default" icon={<UserOutlined className='!text-white' />} className='!bg-pink-700 '><span className='text-white'>Đăng Nhập</span></Button>
                   

                </div>
            </div>
        </header>
    );
}