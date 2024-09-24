import { Box, Typography, Grid, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const AnalyticsBox = ({ platform, icon, color }) => {
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
            <Grid container spacing={4} alignItems="center">
                {['Followers', 'Mentions', 'Posts', 'Post Impression'].map((item, index) => (
                    <Grid item xs={6} sm={3} key={item}>
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
                                {index === 0 ? '30' : index === 1 ? '0' : index === 2 ? '1' : '0%'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" textAlign="center">
                                {item}
                            </Typography>
                            <Box sx={{ height: 40, width: '100%', mt: 2, backgroundColor: '#F0F2F5', borderRadius: '8px' }}>
                                {/* Placeholder for chart */}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
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