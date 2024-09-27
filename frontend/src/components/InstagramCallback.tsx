import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Box } from '@mui/material';

const InstagramCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');

        console.log('accessToken', accessToken);

        if (accessToken) {
            axios.get('http://localhost:3001/connect/instagram/getUser', {
                params: { access_token: accessToken }
            })
                .then(response => {
                    console.log('Response from backend:', response);

                    navigate(`/connect?user=${encodeURIComponent(JSON.stringify(response.data))}`);
                })
                .catch(error => {
                    console.error('Error sending access token to backend:', error);
                });
        } else {
            console.error('Access token not found in URL fragment');
        }
    }, [navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            <InstagramIcon sx={{ fontSize: 64, color: '#E1306C' }} />
        </Box>
    );
};

export default InstagramCallback;
