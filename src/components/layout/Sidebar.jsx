import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import SidebarLinks from './SidebarLinks';

const { Sider } = Layout;

const Sidebar = () => { 
  const [openKeys, setOpenKeys] = useState([]);
  const linksArray = SidebarLinks();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <Sider
      width={256}
      className={`bg-pink border-r rounded-3xl shadow-lg mt-16`}
      collapsedWidth={80}
      collapsible
      trigger={null}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col items-center justify-center space-y-2 mt-8">
          <h2 className="text-blue">Bienvenido</h2>
        </div>
        <Menu
          mode="inline"
      className={`bg-pink`}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {linksArray.map(({ icon, label, to, subMenu }) => (
            subMenu ? (
              <Menu.SubMenu
                key={label}
                icon={icon}
                title={label}
                expandIcon={({ isOpen }) => isOpen ? <DownOutlined /> : <RightOutlined />}
              >
                {subMenu.map(({ label, to }) => (
                  <Menu.Item key={to}>
                    <NavLink to={to}>{label}</NavLink>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={to} icon={icon}>
                <NavLink to={to}>{label}</NavLink>
              </Menu.Item>
            )
          ))}
        </Menu>
      </div>
    </Sider>
  );
};

export default Sidebar;
