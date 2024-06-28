import React from 'react';
import { Box, Typography, Stack } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'; // Ensure this import is correct
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { SocialAccountBoxProps } from '../types/Types';

const icons: Record<string, JSX.Element> = {
    facebook: <FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    instagram: <InstagramIcon sx={{ color: '#EE1973', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    linkedin: <LinkedInIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    twitter: <XIcon sx={{ color: '#000000', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
};

const SocialAccountBox: React.FC<SocialAccountBoxProps> = ({ provider, profileName }) => {
    const icon = icons[provider as keyof typeof icons] || <AccountCircleIcon sx={{ color: 'grey', fontSize: '30px', background: 'white', borderRadius: '20px' }} />;

    return (
        <Stack
            direction='row'
            spacing={1}
            sx={{
                width: { xs: '45%', sm: '27%' },
                padding: '5px',
                alignItems: 'center',
                backgroundColor: 'rgba(217, 217, 217, 0.2)',
                borderRadius: 2,
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <AccountCircleIcon sx={{ color: 'grey', fontSize: '30px', background: 'white', borderRadius: '20px' }} />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -5,
                        right: -2,
                        padding: '2px',
                    }}
                >
                    {icon}
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '12px' }}>
                    {profileName}
                </Typography>
                <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '7px' }}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Typography>
            </Box>
            <CancelIcon sx={{
                color: '#B1B1B1', fontSize: '25px',
                '&:hover': {
                    color: 'aliceblue',
                },
            }} />
        </Stack>
    );
};

export default SocialAccountBox;
