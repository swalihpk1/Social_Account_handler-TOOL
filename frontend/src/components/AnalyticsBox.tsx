import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useFetchAnalyticsMutation } from '../api/ApiSlice';
import AnalyticsLoading from './LoadingAnimation/anlyticsLoading';

const CustomChart = ({ data, color }) => (
    <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
    </ResponsiveContainer>
);


const AnalyticsBox = ({ platform, icon, color }) => {
    const [fetchAnalytics, { data: analyticsData, isLoading, isError }] = useFetchAnalyticsMutation();

    React.useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const getMetricValue = (metricName) => {
        if (!analyticsData) return '0';

        switch (metricName) {
            case 'Posts':
                return analyticsData.totalPostCounts.find(item => item._id === platform.toLowerCase())?.count.toString() || '0';
            case 'Scheduled Posts':
                return analyticsData.scheduledPostCount.find(item => item._id === platform.toLowerCase())?.count.toString() || '0';
            case 'Engagement Rate':
                const rate = analyticsData.platformEngagement.find(item => item.platform === platform.toLowerCase())?.engagementRate || 0;
                return rate.toFixed(1) + '%';
            case 'Best Posting Time':
                const bestTimes = analyticsData.getBestPostingTime.find(item => item.platform === platform.toLowerCase())?.bestTimes || [];
                return bestTimes.length > 0 ? `${bestTimes[0].day} ${bestTimes[0].hour}` : 'N/A';
            default:
                return '0';
        }
    };

    const generateChartData = (metricName) => {
        if (!analyticsData) return [];

        switch (metricName) {
            case 'Posts':
            case 'Scheduled Posts':
                const postsData = metricName === 'Posts' ? analyticsData.totalPostCounts : analyticsData.scheduledPostCount;
                return postsData.slice(-7).map((item, index) => ({
                    time: `Day ${index + 1}`,
                    value: item.count
                }));
            case 'Engagement Rate':
                return analyticsData.platformEngagement.map((item, index) => ({
                    time: `Day ${index + 1}`,
                    value: item.engagementRate
                }));
            default:
                return [];
        }
    };

    const metricsData = [
        { name: 'Posts', value: getMetricValue('Posts'), data: generateChartData('Posts') },
        { name: 'Scheduled Posts', value: getMetricValue('Scheduled Posts'), data: generateChartData('Scheduled Posts') },
        { name: 'Engagement Rate', value: getMetricValue('Engagement Rate'), data: generateChartData('Engagement Rate') },
        { name: 'Best Posting Time', value: getMetricValue('Best Posting Time'), data: [] },
    ];

    return (
        <Box
            sx={{
                background: 'linear-gradient(145deg, #EFEFEF 0%, #F0F2F5 100%)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                p: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-5px)',
                },
                mb: 4,
            }}
        >
            <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: color, display: 'flex', alignItems: 'center' }}>
                {icon}
                {platform} Insights
            </Typography>
            {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <AnalyticsLoading color={color} />
                </Box>
            )}
            {isError && <Typography>Error fetching data</Typography>}
            {!isLoading && !isError && (
                <Grid container spacing={4} alignItems="center">
                    {metricsData.map((item) => (
                        <Grid item xs={6} sm={3} key={item.name}>
                            <Box
                                sx={{
                                    background: '#FFFFFF',
                                    borderRadius: '12px',
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    {item.value}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" textAlign="center">
                                    {item.name}
                                </Typography>
                                {item.name !== 'Best Posting Time' && (
                                    <Box sx={{ height: 40, width: '100%', mt: 2 }}>
                                        <CustomChart data={item.data} color={color} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Box mt={4} textAlign="center">
                <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderColor: color,
                        color: color,
                        '&:hover': {
                            backgroundColor: `${color}10`,
                            borderColor: color,
                        },
                    }}
                >
                    Print report
                </Button>
            </Box>
        </Box>
    );
};


export default AnalyticsBox;