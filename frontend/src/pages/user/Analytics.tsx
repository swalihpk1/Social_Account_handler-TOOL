import React, { useRef, useState } from 'react';
import { Box, Drawer, Typography, IconButton, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import AnalyticsBox from '../../components/AnalyticsBox';


const Analytics: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const facebookRef = useRef(null);
    const instagramRef = useRef(null);
    const linkedInRef = useRef(null);
    const twitterRef = useRef(null);

    const expandedWidth = 240;
    const collapsedWidth = 64;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const scrollToRef = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleIconClick = (platform) => {
        switch (platform) {
            case 'Facebook':
                scrollToRef(facebookRef);
                break;
            case 'Instagram':
                scrollToRef(instagramRef);
                break;
            case 'LinkedIn':
                scrollToRef(linkedInRef);
                break;
            case 'TwitterX':
                scrollToRef(twitterRef);
                break;
            default:
                break;
        }
    };

    const socialMediaItems = [
        { icon: <FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '24px', background: 'white', borderRadius: '50%' }} />, name: 'Facebook' },
        { icon: <InstagramIcon sx={{ color: '#EE1973', fontSize: '24px', background: 'white', borderRadius: '50%' }} />, name: 'Instagram' },
        { icon: <LinkedInIcon sx={{ color: '#1877F2', fontSize: '24px', background: 'white', borderRadius: '50%' }} />, name: 'LinkedIn' },
        { icon: <XIcon sx={{ color: '#000000', fontSize: '24px', background: 'white', borderRadius: '50%' }} />, name: 'TwitterX' },
       
    ];

    const sidebarContent = (
        <Box
            sx={{
                backgroundColor: '#fff6d5',
                height: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
                transition: 'width 0.3s',
                position: 'fixed',
                width: isExpanded ? expandedWidth : collapsedWidth,
            }}
        >
            <Stack
                direction="row"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    height: 64,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isExpanded && (
                        <Typography variant="h6" pl=".5rem" fontWeight="bold" noWrap>
                            Analytics
                        </Typography>
                    )}
                </Box>
                <IconButton sx={{ p: 0 }} onClick={handleExpandToggle}>
                    {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Stack>
            <Box sx={{ p: isExpanded ? 2 : 1 }}>
                {isExpanded && (
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Social
                    </Typography>
                )}
                <List>
                    {socialMediaItems.map((item, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            button
                            sx={{ mb: 1 }}
                            onClick={() => handleIconClick(item.name)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: !isExpanded ? 2 : 0,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {isExpanded && <ListItemText primary={item.name} />}
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );


    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            backgroundImage: 'url(analyticsBG.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <Box
                sx={{
                    width: isExpanded ? expandedWidth : collapsedWidth,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    transition: 'width 0.3s',
                }}
            >
                {sidebarContent}
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: expandedWidth,
                    },
                }}
            >
                {sidebarContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                        mr: 2,
                        display: { md: 'none' },
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <MenuIcon />
                </IconButton>


                <Box sx={{ p: 6 }}>
                    <div ref={facebookRef}>
                        <AnalyticsBox
                            platform="Facebook"
                            icon={<FacebookRoundedIcon sx={{ fontSize: 32, mr: 1 }} />}
                            color="#1877F2"
                        />
                    </div>
                    <div ref={instagramRef}>
                        <AnalyticsBox
                            platform="Instagram"
                            icon={<InstagramIcon sx={{ fontSize: 32, mr: 1 }} />}
                            color="#E4405F"
                        />
                    </div>
                    <div ref={linkedInRef}>
                        <AnalyticsBox
                            platform="LinkedIn"
                            icon={<LinkedInIcon sx={{ fontSize: 32, mr: 1 }} />}
                            color="#0A66C2"
                        />
                    </div>
                    <div ref={twitterRef}>
                        <AnalyticsBox
                            platform="Twitter"
                            icon={<XIcon sx={{ fontSize: 32, mr: 1 }} />}
                            color="#000000"
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default Analytics;