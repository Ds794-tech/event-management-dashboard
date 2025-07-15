import React from "react";
import { Layout, theme, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header } = Layout;


const HeaderComponent: React.FC<{ collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const logOutHandler = () => {
        localStorage.removeItem('loggedIn');
        window.location.href = '/login';
    };

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>Event Management Dashboard</span>
            <Button
                type="primary"
                style={{ float: 'right', marginRight: 20, marginTop: 20 }}
                onClick={logOutHandler}
            >
                logout
            </Button>
        </Header>
    );
}

export default HeaderComponent;