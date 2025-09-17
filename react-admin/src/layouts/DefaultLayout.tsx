import '@ant-design/v5-patch-for-react-19';

import React, { useEffect } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Flex, Layout, Menu, theme } from 'antd';
import { useAuthStore } from '../stores/authStore';
import UserInfo from '../components/UserInfo';
import { useNavigate } from 'react-router';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const DefaultLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();





  const { user, token , setToken, setUser } = useAuthStore();
  const navigate = useNavigate();


  // useEffect(() => {
  //   // 🔥 Load token/user từ localStorage khi app mount
  //   const storedToken = localStorage.getItem('token');
  //   const storedUser = localStorage.getItem('user');

  //   if (storedToken) setToken(JSON.parse(storedToken));
  //   if (storedUser) setUser(JSON.parse(storedUser));
  // }, [setToken, setUser]);

  useEffect(() => {
    // Your effect logic here
    if (!user && !token) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]); // khi token hoặc user thay đổi thì sẽ kiểm tra lại

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          <Flex className='py-5' justify="end" >
            <UserInfo />
          </Flex>
        </Header>
        <Header />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            }
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