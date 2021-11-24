import { Layout, Menu, Typography } from "antd";
import "antd/dist/antd.css";
import React from 'react';
import {
  BrowserRouter as Router, NavLink, Routes, Route
} from "react-router-dom";
import QuickStart from './components/QuickStart'
import Collections from './components/Collections'
import Account from "./components/Account";
import "./style.css";

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
    marginTop: "75px",
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
            <Menu.Item key="collections">
              <NavLink to="/collections">👛 Collections</NavLink>
            </Menu.Item>
          </Menu>
          <div>
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Routes>
            <Route path='/quickstart' element={<QuickStart />} />
            <Route path='/collections' element={<Collections />} />

          </Routes>
        </div>
      </Router>
    </Layout >
  );
}

export default App;
