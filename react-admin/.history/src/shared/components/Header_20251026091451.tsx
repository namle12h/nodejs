


import { Menu, Input, Button, List, Dropdown, Badge } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { MdSpa } from 'react-icons/md';
import UserInfo from './UserInfo';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSearchParams } from "react-router-dom";
import { useServices } from '../services/serviceApi';
import { useState } from 'react';



export default function Header() {

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const { user } = useAuthStore();


    const navigate = useNavigate();
    const { data: services = [] } = useServices(1, 10);



    const menuItems = [
        {
            key: 'home',
            label: 'Trang Chủ',
            onClick: () => navigate('/home'),
        },
        {
            key: 'services', label: 'Dịch Vụ',
            children: services.map((s: any) => ({
                key: `service-${s.id}`,
                label: s.name,
                onClick: () => navigate(`/services/${s.id}`),
            })),
        },
        { key: 'product', label: 'Sản Phẩm', onClick: () => navigate(`/products`), },
        { key: 'booking', label: 'Đặt Lịch' },
        { key: 'about', label: 'Về Chúng Tôi' },
        { key: 'contact', label: 'Liên Hệ' },
    ];


    const [notifications, setNotifications] = useState([
        { id: 1, title: "Đặt lịch #1234 thành công", time: "26/10/2025", isRead: false },
        { id: 2, title: "Hóa đơn #99 đã được tạo", time: "25/10/2025", isRead: true },
        { id: 3, title: "Bạn có đánh giá mới", time: "25/10/2025", isRead: false },
    ]);

    const notificationSound = new Audio("/sounds/news-ting-6832.mp3");
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // 🔔 Menu popup danh sách thông báo
    const notificationMenu = (
        <div style={{ width: 300, maxHeight: 400, overflowY: 'auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', fontWeight: 600 }}>Thông báo</div>
            <List
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            background: item.isRead ? '#fafafa' : '#e6f4ff',
                            cursor: 'pointer',
                            padding: '10px 15px',
                        }}
                        onClick={() => {
                            setNotifications((prev) =>
                                prev.map((n) =>
                                    n.id === item.id ? { ...n, isRead: true } : n
                                )
                            );
                        }}
                    >
                        <List.Item.Meta
                            title={<span style={{ fontWeight: item.isRead ? 400 : 600 }}>{item.title}</span>}
                            description={<span style={{ fontSize: 12, color: '#999' }}>{item.time}</span>}
                        />
                    </List.Item>
                )}
            />
            <div style={{ borderTop: '1px solid #eee', textAlign: 'center', padding: 10 }}>
                <Button type="link" onClick={() => navigate('/notifications')}>
                    Xem tất cả
                </Button>
            </div>
        </div>
    );

    return (
        <header className="fixed w-full z-30 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                <div onClick={() => navigate('/')} className="flex items-center cursor-pointer">
                    <MdSpa className="text-pink-500 text-2xl m-2" />
                    <div className="font-bold text-pink-600 text-xl "> Bella Spa</div>
                </div>
                <Menu
                    mode="horizontal"
                    className="hidden md:flex flex-1 justify-center border-none "
                    items={menuItems}
                />

                <div className="flex items-center gap-3">
                    <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm dịch vụ..." className="hidden md:block w-60" />
                    <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']}>
                        <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                            <BellOutlined className="text-xl cursor-pointer text-gray-700 hover:text-pink-600" />
                        </Badge>
                    </Dropdown>
                    {/* 🔥 Nếu user tồn tại -> hiển thị UserInfo, ngược lại hiển thị nút Đăng nhập */}
                    {user ? (
                        <UserInfo />
                    ) : (
                        <Button
                            type="default"
                            icon={<UserOutlined className="!text-white" />}
                            className="!bg-pink-700"
                            onClick={() => navigate("/login")}
                        >
                            <span className="text-white">Đăng Nhập</span>
                        </Button>
                    )}



                </div>
            </div>
        </header>
    );
}