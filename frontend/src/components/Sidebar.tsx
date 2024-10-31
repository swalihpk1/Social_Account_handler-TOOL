import React, { useState, useEffect } from 'react';
import { Drawer, List, IconButton, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarIcon from './icons/CalendarIcon';
import BarChartIcon from '@mui/icons-material/BarChart';
import ProfileIcon from './icons/ProfileIcon';
import StyledListItem from '../pages/user/Themes/StyledListItem';
import ProfileDetails from './ProfileDetails';
import SearchIcon from './icons/SearchIcon';
import SearchModal from '../pages/user/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ShareIcon from '@mui/icons-material/Share';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import Edit from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AnalyticIcon from './icons/AnalyticIcon';

const drawerWidth = 200;
const reducedDrawerWidth = 80;
const expandedDrawerWidth = 400;

const Sidebar: React.FC<any> = ({ setOpen }) => {
    const [open, setOpenState] = useState(false);
    const [profileView, setProfileView] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // new state for selected item

    const handleDrawerToggle = () => {
        setOpenState(!open);
    };

    const handleProfileClick = () => {
        setProfileView(!profileView);
    };

    const handleCloseProfileView = () => {
        setProfileView(false);
    };

    const handleItemClick = (itemName: string) => {
        setSelectedItem(itemName);
    };

    const handleSearchClick = () => {
        handleItemClick('Search');
        setSearchModalOpen(true);
    };

    const handleCloseSearchModal = () => {
        setSearchModalOpen(false);
    };

    useEffect(() => {
        setOpen(open);
    }, [open, setOpen]);

    return (
        <>
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
                                <StyledListItem
                                    icon={<DashboardOutlinedIcon />}
                                    text="Dashboard"
                                    open={open}
                                    to="/dashboard"
                                    selected={selectedItem === 'Dashboard'}
                                    onClick={() => handleItemClick('Dashboard')}
                                />
                                <StyledListItem
                                    icon={<SearchIcon />}
                                    text="Search"
                                    open={open}
                                    selected={selectedItem === 'Search'}
                                    onClick={handleSearchClick}
                                />
                                <StyledListItem
                                    icon={<img src='Compose.svg' alt="Compose" style={{ filter: 'brightness(0) invert(1)' }} />}
                                    text="Create Post"
                                    open={open}
                                    to="/create"
                                    selected={selectedItem === 'Create Post'}
                                    onClick={() => handleItemClick('Create Post')}
                                />
                                <StyledListItem
                                    icon={<CalendarIcon />}
                                    text="Planner"
                                    open={open}
                                    to="/planner"
                                    selected={selectedItem === 'Planner'}
                                    onClick={() => handleItemClick('Planner')}
                                />
                                <StyledListItem
                                    icon={<AnalyticIcon />}
                                    text="Analytics"
                                    open={open}
                                    to="/analytics"
                                    selected={selectedItem === 'Analytics'}
                                    onClick={() => handleItemClick('Analytics')}
                                />
                            </List>
                        )}
                        {profileView && <ProfileDetails onClose={handleCloseProfileView} />}
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
                                    selected={selectedItem === 'Profile'}
                                    onClick={() => { handleProfileClick(); handleItemClick('Profile'); }}
                                />
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>

            <SearchModal
                open={searchModalOpen}
                onClose={handleCloseSearchModal}
                sidebarOptions={[
                    { name: 'Dashboard', icon: <DashboardOutlinedIcon />, action: () => { window.location.href = '/dashboard'; handleCloseSearchModal(); } },
                    { name: 'Create Post', icon: <img src='Compose.svg' alt="Compose" style={{ fill: 'lightgrey', width: '24px', height: '24px' }} />, action: () => { window.location.href = '/create'; handleCloseSearchModal(); } },
                    { name: 'Planner', icon: <CalendarToday />, action: () => { window.location.href = '/planner'; handleCloseSearchModal(); } },
                    { name: 'Analytics', icon: <BarChartIcon />, action: () => { window.location.href = '/analytics'; handleCloseSearchModal(); } },
                    { name: 'Facebook', icon: <FacebookRoundedIcon />, action: () => { window.location.href = '/analytics'; handleCloseSearchModal(); } },
                    { name: 'Instagram', icon: <InstagramIcon />, action: () => { window.location.href = '/analytics'; handleCloseSearchModal(); } },
                    { name: 'LinkedIn', icon: <LinkedInIcon />, action: () => { window.location.href = '/analytics'; handleCloseSearchModal(); } },
                    { name: 'X', icon: <XIcon />, action: () => { window.location.href = '/analytics'; handleCloseSearchModal(); } },
                    { name: 'Profile', icon: < AccountCircleIcon />, action: handleProfileClick },
                    { name: 'Add Social account', icon: <PersonAddAltIcon />, action: handleProfileClick },
                    { name: 'Connect', icon: <ShareIcon />, action: handleProfileClick },
                    { name: 'Sheduled Posts', icon: <CalendarMonthIcon />, action: () => { window.location.href = '/planner'; handleCloseSearchModal(); } },
                    { name: 'Edit name', icon: <Edit />, action: handleProfileClick },
                    { name: 'Log out', icon: <ExitToAppIcon />, action: handleProfileClick },
                ]}
            />
        </>
    );
};

export default Sidebar;
