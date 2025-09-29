import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useAuthStore } from '../stores/authStore';
export default function UserInfo() {
    const { user, clearToken, setUser } = useAuthStore();

    const formatDisplayName = (fullName?: string) => {
        if (!fullName) return "Guest";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return parts.join(" ");
        // Mặc định lấy 2 từ cuối cùng (Ví dụ: Văn Dũng, Lan Anh)
        return parts.slice(-2).join(" ");
    };


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
        },
        {
            key: '3',
            label: 'Billing',
        },
        {
            key: '4',
            label: 'Log out',
            icon: <LogoutOutlined />,
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key === '4') {

            setUser(null);

            clearToken();
            localStorage.removeItem('token'); // 🔥 xóa token khỏi localStorage
            localStorage.removeItem('user');  // 🔥 xóa user khỏi localStorage
        }
    }
    return (
        <Dropdown menu={{ items, onClick }}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <Avatar icon={<UserOutlined className='!text-pink-500 ' />} />
                    {/* {user?.name || 'Guest'} */}
                    <span
                    style={{ whiteSpace: "nowrap", color: "#1677ff", fontWeight: "500" }}
                    >{formatDisplayName(user?.name)}</span>
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )

}
