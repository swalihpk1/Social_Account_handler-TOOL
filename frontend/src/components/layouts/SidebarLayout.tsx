import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useState } from 'react';

const SidebarLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const drawerWidth = sidebarOpen ? 200 : 80;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `${drawerWidth}px 1fr`,
            transition: 'grid-template-columns 0.6s',
            background: '#E1E5E9',
            height: "100vh"

        }}>
            <Sidebar setOpen={setSidebarOpen} />
            <div
                style={{
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default SidebarLayout;
