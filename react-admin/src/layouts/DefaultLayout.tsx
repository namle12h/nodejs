import '@ant-design/v5-patch-for-react-19';
import { Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  DesktopOutlined,
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
// import { useNavigate } from 'react-router';
import { useNavigate } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;


const DefaultLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();





  const { user, token } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    // Your effect logic here
    if (!user && !token) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]); // khi token hoặc user thay đổi thì sẽ kiểm tra lại



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
    getItem('Dashboard', '', <PieChartOutlined />),
    getItem('Categories', 'categories', <DesktopOutlined />),
    getItem('Products', 'products', <ShoppingCartOutlined />),
    getItem('Orders', 'order', <ShoppingOutlined />),
    getItem('Reviews', 'reviews', <StarOutlined />),
    getItem('Users', 'user', <UsergroupAddOutlined />, [
      getItem('Admin', 'ad'),
      getItem('Employee', 'em'),
      getItem('Customer', 'cu'),
    ]),
    getItem('Brand', 'brand', <AppstoreOutlined />, [getItem('brand 1', '6'), getItem('brand 2', '7')]),
    getItem('Reports', 'report', <BarChartOutlined />),
  ];




  return (
    <Layout hasSider style={{ minHeight: '100vh' }} >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="h-10 m-4 rounded-md bg-white/20" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            console.log("key", key);
            navigate(`/${key}`);
          }} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          <Flex className='py-5' justify="end" >
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