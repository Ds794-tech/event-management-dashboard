import { Layout } from "antd";
import React from "react";


const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const { Footer } = Layout;

const FooterComponent = () => {
    return (
        <Footer style={footerStyle}>
            <p>© 2023 Event Management Dashboard. All rights reserved.</p>
        </Footer>
    );
}

export default FooterComponent;