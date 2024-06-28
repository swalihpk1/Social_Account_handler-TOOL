import React, { useEffect, useState } from 'react';
import { Box, Container, Stack, Typography, Grid, Snackbar, Alert } from "@mui/material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ConnectedBTN } from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/auth/CredSlice';
import { RootState } from '../../app/store';
import SocialAccountBox from '../../components/SocialAccountBox';

const Connect: React.FC = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSocialLogin = (provider: string) => {
        if (userInfo?.socialAccounts && userInfo.socialAccounts[provider]) {
            setSnackbarMessage('Already connected');
            setSnackbarOpen(true);
        } else {
            window.location.href = `http://localhost:3001/connect/${provider}`;
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get('user');
        if (userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam));
            console.log('User data:', userData);
            dispatch(updateUser({
                provider: userData.provider,
                profileName: userData.profileName
            }));
        }
    }, [dispatch]);

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Container
            component="main"
            maxWidth={false}
            disableGutters
            sx={{
                background: 'linear-gradient(90deg, #43528C, #203170)',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Stack
                sx={{
                    m: 5,
                    border: '2px solid white',
                    borderRadius: 2,
                    width: { xs: '95%', sm: '85%' },
                    height: { xs: '95%', sm: '85%' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        width: { xs: '100%', sm: '50%' },
                        height: { xs: '50%', sm: '100%' },
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src="LoginImage.jpg" alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />
                </Box>
                <Stack
                    spacing={3}
                    sx={{
                        width: { xs: '100%', sm: '50%' },
                        height: { xs: '50%', sm: '100%' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <Box>
                        <Typography variant="h6" color='whitesmoke'>
                            Step 2 of 2
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: 'whitesmoke' }} />
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: '#57D7FF' }} />
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'white',
                                fontSize: { xs: 'large', sm: 'x-large' },
                                fontWeight: 100,
                                marginBottom: 0,
                            }}
                        >
                            Let’s add some{' '}
                            <Typography component='span'
                                sx={{
                                    color: '#FF7AC3',
                                    fontSize: { xs: 'large', sm: 'x-large' },
                                    fontWeight: 500
                                }}
                            >
                                Social accounts
                            </Typography>
                        </Typography>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: 'small',
                                    marginTop: 0,
                                    color: 'white',
                                    fontWeight: '100',
                                    textDecoration: 'none',
                                }}
                            >
                                You at-least add
                                <Typography
                                    component="span"
                                    sx={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    {' '}two social accounts{' '}
                                </Typography>
                                right now. You can always add more later!
                            </Typography>
                        </Box>

                        <Stack spacing={2} sx={{ mt: 3 }}>
                            <Typography
                                sx={{
                                    marginTop: 0,
                                    color: 'white',
                                    fontWeight: '400',
                                    textDecoration: 'none',
                                }}
                            >
                                Choose a social network to add an account
                            </Typography>

                            {Object.keys(userInfo?.socialAccounts || {}).length === 1 && (
                                <Typography
                                    sx={{
                                        marginTop: 1,
                                        color: 'white',
                                        fontWeight: '400',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Add another social account :
                                </Typography>
                            )}

                            <Grid container rowGap={2} sx={{ width: { xs: '100%', sm: '60%' }, margin: 'auto' }}>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '30px!important' }} />}
                                        onClick={() => handleSocialLogin('facebook')}
                                    >
                                        Facebook
                                    </ConnectedBTN>
                                </Grid>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<InstagramIcon sx={{ color: '#EE1973', fontSize: '30px!important' }} />}
                                        onClick={() => handleSocialLogin('instagram')}
                                    >
                                        Instagram
                                    </ConnectedBTN>
                                </Grid>

                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<LinkedInIcon sx={{ color: '#1877F2', fontSize: '30px!important' }} />}
                                        onClick={() => handleSocialLogin('linkedin')}
                                    >
                                        LinkedIn
                                    </ConnectedBTN>
                                </Grid>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<XIcon sx={{ color: '#00000', fontSize: '30px!important' }} />}
                                        onClick={() => handleSocialLogin('twitter')}
                                    >
                                        Twitter X
                                    </ConnectedBTN>
                                </Grid>
                            </Grid>

                            {Object.keys(userInfo?.socialAccounts || {}).length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 'medium', marginRight: 1, background: 'white', color: 'green', borderRadius: '10px' }} />
                                    <Typography
                                        sx={{
                                            marginTop: 0,
                                            color: 'white',
                                            fontWeight: '400',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {Object.keys(userInfo?.socialAccounts || {}).length} account added
                                    </Typography>
                                </Box>
                            )}

                            <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
                                {Object.entries(userInfo?.socialAccounts || {}).map(([provider, profileName]) => (
                                    <SocialAccountBox
                                        key={provider}
                                        provider={provider}
                                        profileName={profileName}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Connect;
