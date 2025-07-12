import React, { ReactNode } from 'react';
import HeaderComponent from './header/Header';
import FooterComponent from './footer/Footer';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;


const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(50% - 8px)',
  maxWidth: 'calc(50% - 8px)',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const DefaultLayout: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <HeaderComponent />
            <main style={{ flex: 1, padding: '20px' }}>
                <Layout style={layoutStyle}>
                    <Sider  style={siderStyle}>
                        Sider
                    </Sider>
                    <Layout>
                        <Content style={contentStyle}>Content</Content>
                        <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
                </Layout>
            </main>
            <FooterComponent />
        </div>
    );
}


export default DefaultLayout;