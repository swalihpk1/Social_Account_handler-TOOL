import React, { useState, useEffect } from 'react';
import { Drawer, List, IconButton, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchIcon from './icons/SearchIcon';
import CalendarIcon from './icons/CalendarIcon';
import AnalyticIcon from './icons/AnalyticIcon';
import ProfileIcon from './icons/ProfileIcon';
import StyledListItem from '../pages/user/Themes/StyledListItem';
import ProfileDetails from './ProfileDetails';

const drawerWidth = 200;
const reducedDrawerWidth = 80;
const expandedDrawerWidth = 400;

const Sidebar: React.FC<any> = ({ setOpen }) => {
    const [open, setOpenState] = useState(false);
    const [profileView, setProfileView] = useState(false);

    const handleDrawerToggle = () => {
        setOpenState(!open);
    };

    const handleProfileClick = () => {
        setProfileView(!profileView);
    };

    const handleCloseProfileView = () => {
        setProfileView(false);
    };

    useEffect(() => {
        setOpen(open);
    }, [open, setOpen]);

    return (
        <Drawer
            sx={{
                width: profileView ? expandedDrawerWidth : (open ? drawerWidth : reducedDrawerWidth),
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: profileView ? expandedDrawerWidth : (open ? drawerWidth : reducedDrawerWidth),
                    transition: 'width 0.6s',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                    background: '#43528C',
                    flexDirection: 'column',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                },
            }}
            variant="permanent"
            anchor="left"
            open={open}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Top Box */}
                <Box>
                    {!profileView && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-end' : 'center', padding: '.5rem' }}>
                            <IconButton onClick={handleDrawerToggle}>
                                {open ? <ChevronLeftIcon /> : <MenuIcon />}
                            </IconButton>
                        </Box>
                    )}
                    <Divider />
                    {!profileView && (
                        <List sx={{ color: 'white', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                            <StyledListItem icon={<DashboardOutlinedIcon />} text="Dashboard" open={open} to="/dashboard" />
                            <StyledListItem icon={<SearchIcon />} text="Search" open={open} to="/search" />
                            <StyledListItem icon={<img src="/Compose.svg" alt="Compose" />} text="Create Post" open={open} to="/create" iconStyles={{ paddingTop: '2px' }} />
                            <StyledListItem icon={<CalendarIcon />} text="Calendar" open={open} to="/planner" />
                            <StyledListItem icon={<AnalyticIcon />} text="Analytics" open={open} to="/analytics" />
                        </List>
                    )}
                    {profileView && (
                        <ProfileDetails onClose={handleCloseProfileView} />
                    )}
                </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
                <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!profileView && (
                        <>
                            <StyledListItem
                                icon={<ProfileIcon />}
                                text="Profile"
                                open={open}
                                size="large"
                                iconStyles={{ backgroundColor: 'white', border: '3px #CE9500 solid' }}
                                onClick={handleProfileClick}
                            />
                        </>
                    )}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
