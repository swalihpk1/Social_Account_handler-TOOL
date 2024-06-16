import React from 'react'
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import XIcon from '@mui/icons-material/X';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ConnectedBTN } from './Styles';

const Connect: React.FC = () => {
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
                        alignItems: 'center',
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
                            <Grid container rowGap={2} sx={{ width: { xs: '100%', sm: '60%' }, margin: 'auto' }}>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '30px!important' }} />}
                                    >
                                        Facebook
                                    </ConnectedBTN>
                                </Grid>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<InstagramIcon sx={{ color: '#EE1973', fontSize: '30px!important' }} />}
                                    >
                                        Instagram
                                    </ConnectedBTN>
                                </Grid>

                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<LinkedInIcon sx={{ color: '#1877F2', fontSize: '30px!important' }} />}
                                    >
                                        LinkedIn
                                    </ConnectedBTN>
                                </Grid>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<XIcon sx={{ color: '#00000', fontSize: '30px!important' }} />}
                                    >
                                        Twitter X
                                    </ConnectedBTN>
                                </Grid>
                            </Grid>

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
                                    2 accounts added
                                </Typography>
                            </Box>

                            <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    sx={{
                                        width: { xs: '45%', sm: '27%' },
                                        padding: '5px',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(217, 217, 217, 0.2)',
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(217, 217, 217, 0.3)',
                                        },
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
                                            <FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />
                                        </Box>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '12px' }}>
                                            Username
                                        </Typography>
                                        <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '7px' }}>
                                            Facebook page
                                        </Typography>
                                    </Box>
                                    <CancelIcon sx={{ color: '#B1B1B1', fontSize: '25px' }} />
                                </Stack>

                                <Stack
                                    direction='row'
                                    spacing={1}
                                    sx={{
                                        width: { xs: '45%', sm: '27%' },
                                        padding: '5px',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(217, 217, 217, 0.2)',
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(217, 217, 217, 0.3)',
                                        },
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
                                            <InstagramIcon sx={{ color: '#EE1973', fontSize: '12px', background: 'white', borderRadius: '20px' }} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '12px' }}>
                                            Username
                                        </Typography>
                                        <Typography sx={{ color: 'white', textTransform: 'none', fontSize: '7px' }}>
                                            Instagram
                                        </Typography>
                                    </Box>
                                    <CancelIcon sx={{ color: '#B1B1B1', fontSize: '25px' }} />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Container>
    )
}

export default Connect
