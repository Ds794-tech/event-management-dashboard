import React from "react";
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
    return (
        <Header style={{ color: "white", textAlign: 'center' }}>
            <h1>Event Management Dashboard</h1>
            <p>Manage your events efficiently</p>
        </Header>
    );
}

export default HeaderComponent;