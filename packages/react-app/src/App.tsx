import { Layout, Menu, Typography } from "antd";
import "antd/dist/antd.css";
import React from 'react';
import {
  BrowserRouter as Router, NavLink, Routes, Route
} from "react-router-dom";
import QuickStart from './components/QuickStart'
import Collections from './components/Collections'
import Gank from './components/Gank'
import Ranking from './components/Ranking'
import Account from "./components/Account";
import "./style.css";
import Proposal from './components/Proposal'
import Vote from './components/Vote'
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
          <Title level={5}>MetaJungle</Title>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["quickstart"]}>
            <Menu.Item key="quickstart">
              <NavLink to="/quickstart">🚀  Quick Start</NavLink>
            </Menu.Item>
            <Menu.Item key="collections">
              <NavLink to="/collections">🖼  Collections</NavLink>
            </Menu.Item>
            <Menu.Item key="gank">
              <NavLink to="/gank">👛 Gank</NavLink>
            </Menu.Item>
            <Menu.Item key="hide-on-bush">
              <NavLink to="/hide-on-bush">👛 Hide-On-Bush</NavLink>
            </Menu.Item>
            <Menu.Item key="ranking">
              <NavLink to="/ranking">👛 Ranking</NavLink>
            </Menu.Item>
            <Menu.Item key="propose">
              <NavLink to="/proposal">👛 Proposal</NavLink>
            </Menu.Item>
            <Menu.Item key="vote">
              <NavLink to="/vote">👛 Vote</NavLink>
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
            <Route path='/gank' element={<Gank />} />
            <Route path='/proposal' element={<Proposal />} />
            <Route path='/vote' element={<Vote />} />
            <Route path='/ranking' element={<Ranking />} />
          </Routes>
        </div>
      </Router>
    </Layout >
  );
}

export default App;
