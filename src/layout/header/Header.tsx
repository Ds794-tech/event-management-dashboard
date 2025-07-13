import React, { SetStateAction, useState } from "react";
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
        </Header>
    );
}

export default HeaderComponent;