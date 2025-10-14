

import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom'; 
export default function UserInfo() {
    const { user, clearToken, setUser } = useAuthStore();
    const navigate = useNavigate(); 

    const formatDisplayName = (fullName?: string) => {
        if (!fullName) return 'Guest';
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return parts.join(' ');
        return parts.slice(-2).join(' ');
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            key: '2',
            label: 'Tài Khoản Của Tôi',
        },
        {
            key: '3',
            label: 'Lịch Sử Đơn Hàng',
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            label: 'Log out',
            icon: <LogoutOutlined />,
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '2':
                // ✅ Chuyển đến trang hồ sơ cá nhân
                navigate('/profile');
                break;
            case '3':
                navigate('/profile/orders');
                
                break;

            case '4':
                // ✅ Đăng xuất, xóa token và reload lại trang
                setUser(null);
                clearToken();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
                break;

            default:
                break;
        }
    };

    return (
        <Dropdown menu={{ items, onClick }}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <Avatar icon={<UserOutlined className="!text-pink-500" />} />
                    <span
                        style={{ whiteSpace: 'nowrap', color: '#1677ff', fontWeight: 500 }}
                    >
                        {formatDisplayName(user?.name)}
                    </span>
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
}
