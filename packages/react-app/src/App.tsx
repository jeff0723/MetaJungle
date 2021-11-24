import { Layout, Menu, Typography } from "antd";
import "antd/dist/antd.css";
import React from 'react';
import {
  BrowserRouter as Router, NavLink, Routes, Route
} from "react-router-dom";
import QuickStart from './components/QuickStart'
const { Header } = Layout;
const { Title } = Typography;
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff"
  },
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "30px",
    padding: "10px",
  },
}
function App() {
  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header} >
          <Title level={5}>Bulls-and-Bears</Title>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["quickstart"]}>
            <Menu.Item key="quickstart">
              <NavLink to="/quickstart">🚀 Quick Start</NavLink>
            </Menu.Item>
            <Menu.Item key="wallet">
              <NavLink to="/wallet">👛 Wallet</NavLink>
            </Menu.Item>
            <Menu.Item key="onramp">
              <NavLink to="/onramp">💵 Fiat</NavLink>
            </Menu.Item>
            <Menu.Item key="dex">
              <NavLink to="/1inch">🏦 Dex</NavLink>
            </Menu.Item>
            <Menu.Item key="balances">
              <NavLink to="/erc20balance">💰 Balances</NavLink>
            </Menu.Item>
            <Menu.Item key="transfers">
              <NavLink to="/erc20transfers">💸 Transfers</NavLink>
            </Menu.Item>
            <Menu.Item key="nft">
              <NavLink to="/nftBalance">🖼 NFTs</NavLink>
            </Menu.Item>
            <Menu.Item key="contract">
              <NavLink to="/contract">📄 Contract</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <div style={styles.content}>
          <Routes>
            <Route path='/quickstart' element={<QuickStart />} />
          </Routes>
        </div>
      </Router>
    </Layout >
  );
}

export default App;
