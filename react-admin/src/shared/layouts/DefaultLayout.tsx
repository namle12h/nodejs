import '@ant-design/v5-patch-for-react-19';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  DesktopOutlined,
  HomeOutlined,
  PieChartOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Flex, Layout, Menu, theme } from 'antd';
import { useAuthStore } from '../stores/authStore';
import UserInfo from '../components/UserInfo';
import Search from 'antd/es/input/Search';

const { Header, Content, Footer, Sider } = Layout;

const DefaultLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { user, token } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]);

  type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem('Dashboard', '', <PieChartOutlined />), // /dashboard
    getItem('Services', 'services', <DesktopOutlined />), // /dashboard/services
    getItem('Products', 'products', <ShoppingCartOutlined />), // /dashboard/products
    getItem('Orders', 'orders', <ShoppingOutlined />), // /dashboard/orders
    getItem('Rooms', 'rooms', <HomeOutlined />), // /dashboard/rooms
    getItem('Reviews', 'reviews', <StarOutlined />), // /dashboard/reviews
    getItem('Users', 'users', <UsergroupAddOutlined />, [
      getItem('Admin', 'admin'),
      getItem('Employee', 'employee'),
      getItem('Customer', 'customer'),
    ]),
    getItem('Brands', 'brands', <AppstoreOutlined />, [
      getItem('Brand 1', 'brand1'),
      getItem('Brand 2', 'brand2'),
    ]),
    getItem('Reports', 'reports', <BarChartOutlined />),
  ];

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="h-10 m-4 rounded-md bg-white/20" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['']}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            console.log('key', key);
            navigate(`/dashboard/${key}`);
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer }}>
          <Flex justify="space-between" align="center" className="!px-15">
            <Search
              placeholder="Tìm dịch vụ..."
              allowClear
              style={{ maxWidth: 500 }}
            />
            <UserInfo />
          </Flex>
        </Header>

        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
