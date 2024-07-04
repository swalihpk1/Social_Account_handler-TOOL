import React, { useState } from 'react';
import { Box, Typography, Stack, Snackbar, Alert } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { SocialAccountBoxProps } from '../types/Types';
import { useDispatch } from 'react-redux';
import { removeSocialAccount } from '../features/auth/CredSlice';
import { useRemoveSocialAccountMutation } from '../api/ApiSlice';

const icons: Record<string, JSX.Element> = {
    facebook: <FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    instagram: <InstagramIcon sx={{ color: '#EE1973', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    linkedin: <LinkedInIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    twitter: <XIcon sx={{ color: '#000000', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
};

const SocialAccountBox: React.FC<SocialAccountBoxProps> = ({ provider, profileName, profilePicture }) => {
    const dispatch = useDispatch();
    const [removeSocialAccountApi] = useRemoveSocialAccountMutation();

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleRemove = async () => {
        // const userId = '';
        try {
            await removeSocialAccountApi({ provider }).unwrap();
            dispatch(removeSocialAccount(provider));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to remove social account:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const icon = icons[provider as keyof typeof icons] || <AccountCircleIcon sx={{ color: 'grey', fontSize: '30px', background: 'white', borderRadius: '20px' }} />;

    return (
        <>
            <Stack
                direction='row'
                spacing={1}
                sx={{
                    width: { xs: '100%', sm: '45%' },
                    padding: '5px',
                    alignItems: 'center',
                    backgroundColor: 'rgba(217, 217, 217, 0.2)',
                    borderRadius: 2,
                    marginBottom: 1,
                }}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    {profilePicture ? (
                        <img src={profilePicture} alt={`${provider} profile`} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    ) : (
                        <AccountCircleIcon sx={{ color: 'grey', fontSize: '30px', background: 'white', borderRadius: '20px' }} />
                    )}
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
                    <Typography sx={{ color: 'white', textTransform: 'none', fontSize: 'small' }}>
                        {profileName}
                    </Typography>
                    <Typography sx={{ color: 'white', textTransform: 'none', fontSize: 'xx-small' }}>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </Typography>
                </Box>
                <CancelIcon sx={{
                    color: '#B1B1B1', fontSize: { xs: '20px', sm: '25px' },
                    '&:hover': {
                        color: 'aliceblue',
                    },
                }}
                    onClick={handleRemove}
                />
            </Stack>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Social account removed successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default SocialAccountBox;
