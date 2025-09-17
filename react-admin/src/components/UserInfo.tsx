import { DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useAuthStore } from '../stores/authStore';
export default function UserInfo() {
    const { user, clearToken, setUser } = useAuthStore();

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
                    <Avatar icon={<UserOutlined />} />
                    {user?.firstName + " " + user?.lastName}
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )

}
