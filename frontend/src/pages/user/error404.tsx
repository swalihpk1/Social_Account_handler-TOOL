import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error404: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            overflow="hidden"
            position="fixed"
            top={0}
            left={0}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                maxWidth="90%"
                maxHeight="90%"
            >
                <img
                    src='/404.png'
                    alt="404 Not Found"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain'
                    }}
                />
                <Typography variant="h5" color="textSecondary" gutterBottom textAlign="center">
                    Oops! Page not found.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard')}
                    sx={{ mt: 2 }}
                >
                    Go to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default Error404;
