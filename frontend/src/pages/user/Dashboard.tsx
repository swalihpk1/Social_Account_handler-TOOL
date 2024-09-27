import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    CircularProgress,
    LinearProgress,
    Button,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import AddIcon from '@mui/icons-material/Add';
import { useFetchAnalyticsMutation } from '../../api/ApiSlice';
import RocketIcon from '@mui/icons-material/Rocket';
import CarouselComponent from '../../components/CarouselComponent';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const score = 76;
    const scoreBreakdown = [
        { label: 'Total posts', value: 28 },
        { label: 'Total scheduled posts', value: 43 },
        { label: 'Engagement', value: 61 },

    ];

    const navigate = useNavigate();
    // const [fetchAnalytics, { data: analyticsData, isLoading, isError }] = useFetchAnalyticsMutation();

    // useEffect(() => {
    //     fetchAnalytics();
    // }, [fetchAnalytics]);

    // console.log("DATA", analyticsData);

    const ScoreBreakdown = ({ label, value }) => (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2" fontWeight="bold">{value}%</Typography>
            </Box>

            <Box sx={{ position: 'relative', height: 10, borderRadius: 5, mt: 1, bgcolor: '#D5D5D5' }}>
                {/* Foreground progress layer */}
                <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: 5,
                        background: '#BEBEBE',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#522070',
                        },
                    }}
                />
            </Box>
        </Box>
    );



    return (
        <>
            {/* Top section */}
            <Box
                sx={{
                    bgcolor: '#203170',
                    p: 3,
                    minHeight: '30vh',
                    display: 'flex',
                    flexDirection: 'column',
                    pl: '7rem',
                    pt: '4rem',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'white', mr: 2, fontWeight: 'bold' }}>
                        Selected profiles to post ✨
                    </Typography>
                    <Avatar sx={{ bgcolor: '#4267B2' }}>
                        <FacebookIcon />
                    </Avatar>
                    <Avatar sx={{ bgcolor: '#E1306C' }}>
                        <InstagramIcon />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'grey' }}>
                        <AddIcon />
                    </Avatar>
                </Box>
            </Box>

            {/* Main content */}
            <Box
                sx={{
                    width: '85vw',
                    height: 'calc(100vh - 23vh)',
                    marginTop: '-14vh',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                }}
            >
                <Grid container columnSpacing={7} sx={{ height: '100%' }}>
                    {/* Left section */}
                    <Grid item xs={12} md={8.5}>
                        <Box sx={{ height: '100%' }} boxShadow={3}>
                            <Grid container sx={{ height: '100%' }}>
                                <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                                    <Box sx={{ bgcolor: '#D5D5D5', height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ bgcolor: '#D5D5D5', height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box sx={{ position: 'relative', display: 'inline-flex', width: '210px', height: '210px' }}>
                                                {/* Background Circle */}
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={100}
                                                    size="100%"
                                                    thickness={3}
                                                    sx={{
                                                        color: '#BEBEBE',
                                                        position: 'absolute',
                                                        left: 0,
                                                        '& .MuiCircularProgress-circle': {
                                                            strokeLinecap: 'round',
                                                        },
                                                    }}
                                                />
                                                {/* Progress Circle */}
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={score}
                                                    size="100%"
                                                    thickness={3}
                                                    sx={{
                                                        color: '#522070',
                                                        position: 'absolute',
                                                        left: 0,
                                                        transform: 'rotate(100deg)!important',
                                                        '& .MuiCircularProgress-circle': {
                                                            strokeLinecap: 'round',
                                                        },
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h2" color="text.secondary" sx={{ fontWeight: 'bold', pl: '2rem' }}>
                                                        {score}%
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="button" sx={{ mt: 2, bgcolor: '#52207036', fontWeight: 'bold', px: 2, py: 0.5, borderRadius: 5, color: '#522070' }}>
                                                KEEP IT UP
                                            </Typography>

                                            <Box sx={{ width: '100%', mt: 3 }}>
                                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: '#394A88' }}>Score breakdown</Typography>
                                                {scoreBreakdown.map((item, index) => (
                                                    <ScoreBreakdown key={index} label={item.label} value={item.value} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8} sx={{ height: '100%' }}>
                                    <Box sx={{ bgcolor: '#E7E5E5', p: 3, height: '100%' }}>
                                        <Typography variant="h5" sx={{ color: '#3f51b5', mb: 2, pt: 4 }}>
                                            Your social score
                                        </Typography>

                                        <Box sx={{ bgcolor: '#9eade340', p: 2, mb: 3, borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <RocketIcon />
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    Keep it up
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontFamily='inherit' fontWeight='300' >
                                                Great job! Your social media is performing better than many businesses. To boost it further, plan your content for the next week and track which posts perform best.
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            Personalized recommendation to level up your <br /> social presence
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ p: 1, height: '100%' }}>
                                                    <img
                                                        src="FbDashboard.jpg"
                                                        alt="Analytics Background"
                                                        style={{ width: '100%', height: '140px', display: 'block', marginBottom: '5px', objectFit: 'cover' }}
                                                    />
                                                    <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#203170' }}>About Facebook</Typography>
                                                    <Typography variant='subtitle2' color='grey' sx={{ mb: 1 }}>
                                                        Your social media presence is performing well compared to others.
                                                    </Typography>
                                                    <Button variant="outlined" color="primary" size="small" sx={{ fontSize: '0.75rem', p: 1 }}>
                                                        Get more likes on Facebook
                                                    </Button>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ p: 1, height: '100%' }}>
                                                    <img
                                                        src="IgDashboard.jpg"
                                                        alt="Analytics Background"
                                                        style={{ width: '100%', height: '140px', display: 'block', marginBottom: '5px', objectFit: 'cover' }}
                                                    />
                                                    <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#203170' }}>About Facebook</Typography>
                                                    <Typography variant='subtitle2' color='grey' sx={{ mb: 1 }}>
                                                        Your social media presence is performing well compared to others.
                                                    </Typography>
                                                    <Button variant="outlined" color="primary" size="small" sx={{ fontSize: '0.75rem', p: 1 }}>
                                                        Get more likes on Facebook
                                                    </Button>
                                                </Box>

                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid >

                    {/* Right section */}
                    <Grid item xs={12} md={3.5} sx={{ height: '100%' }}>
                        <Box
                            sx={{
                                bgcolor: '#E7E5E5',
                                height: '60%',
                            }}
                        >
                            <CarouselComponent
                                images={['Logo.jpg', 'LoginImage.jpg', 'analyticsBG.jpg']}
                                content={[
                                    { description: 'Description for the first slide' },
                                    { description: 'Description for the second slide' },
                                    { description: 'Description for the third slide' },
                                ]}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={
                                <img
                                    src="/Compose.svg"
                                    alt="Compose"
                                    style={{
                                        filter: 'invert(55%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
                                    }}
                                />
                            }
                            onClick={() => navigate('/create')}
                            sx={{
                                width: '100%',
                                fontSize: '15px',
                                mt: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'black',
                                borderColor: '#9C9C9C',
                                '&:hover': {
                                    borderColor: '#203170',
                                },
                                textTransform: 'none',
                            }}
                        >
                            Schedule post
                        </Button>
                    </Grid>
                </Grid >
            </Box >
        </>
    );
};

export default Dashboard;
