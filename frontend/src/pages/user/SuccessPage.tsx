import { Container, Box, Typography, Button } from '@mui/material';
import React from 'react';

const SuccessPage: React.FC = () => {
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
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: {
                        xs: '10%',
                        sm: '15%',
                        md: '20%',
                        lg: '20%',
                    },
                    left: {
                        xs: '5%',
                        sm: '10%',
                        md: '15%',
                        lg: '15%',
                    },
                }}
            >
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: {
                            xs: '1rem',
                            md: '1rem',
                            lg: '2.5rem',
                        },
                    }}
                >
                    You’re all set. <span style={{ color: '#FF69B4' }}>Let’s get social!</span>
                </Typography>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    width: {
                        xs: '70%',
                        sm: '60%',
                        md: '50%',
                        lg: '50%',
                    },
                    bottom: 0,
                    left: 0,
                    color: '#fff',
                }}
            >
                <img
                    src='SuccessImage.png'
                    alt="Success"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                    }}
                />
            </Box>
            <Button
                variant="contained"
                sx={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    left: {
                        xs: '70%',
                        sm: '80%',
                        md: '85%',
                        lg: '90%',
                    },
                    bottom: '5%',
                    textTransform: 'none',
                    fontSize: {
                        xs: '0.75rem',
                        sm: '1rem',
                        md: '1.25rem',
                        lg: '1rem',
                    },
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                        '0%': {
                            transform: 'scale(1)',
                        },
                        '50%': {
                            transform: 'scale(1.1)',
                        },
                        '100%': {
                            transform: 'scale(1)',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                }}
                href='/dashboard'
            >
                Lets go! &#8250;
            </Button>
        </Container>
    );
};

export default SuccessPage;
