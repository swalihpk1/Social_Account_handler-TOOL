import { useState, useEffect } from 'react';
import { Box, LinearProgress, Fade, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import XIcon from '@mui/icons-material/X';

const SocialPlatformUploader = ({ open, handleClose, selectedPlatforms, scheduledTime }) => {
    const [uploadStatus, setUploadStatus] = useState({});
    const [overallProgress, setOverallProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        if (open) {

            const initialStatus = Object.fromEntries(selectedPlatforms.map(p => [p, { uploading: false, success: false }]));
            setUploadStatus(initialStatus);
            setOverallProgress(0);
            setShowProgressBar(true);
            setShowSuccessMessage(false);

            selectedPlatforms.forEach((platform, index) => {
                simulateUpload(platform, index);
            });

            const totalAnimationTime = (selectedPlatforms.length * 2 + 1) * 1000;

            setTimeout(() => {
                setShowProgressBar(false);
                setShowSuccessMessage(true);
            }, totalAnimationTime);

            setTimeout(() => {
                handleClose();
            }, totalAnimationTime + 2000);
        }
    }, [open, selectedPlatforms, handleClose]);

    const simulateUpload = (platform, index) => {
        setTimeout(() => {
            setUploadStatus(prev => ({
                ...prev,
                [platform]: { uploading: false, success: true }
            }));
            setOverallProgress((prev) => prev + (100 / selectedPlatforms.length));
        }, index * 2000);
    };

    const renderPlatform = (platform, icon, progressPercentage) => (
        <Box
            key={platform}
            position="absolute"
            left={`calc(${progressPercentage}% - 20px)`}
            top="-50px"
            display="inline-flex"
            justifyContent="center"
            sx={{
                zIndex: 1,
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    bgcolor: uploadStatus[platform]?.success ? 'white' : 'background.paper',
                    color: uploadStatus[platform]?.success
                        ? platform === 'facebook'
                            ? '#1877F2'
                            : platform === 'twitter'
                                ? '#1DA1F2'
                                : platform === 'instagram'
                                    ? '#E1306C'
                                    : platform === 'linkedin'
                                        ? '#0077B5'
                                        : 'black'
                        : 'grey',
                    border: '1px solid black',
                    borderRadius: '50%',
                    p: 1.5,
                    transition: 'background-color 0.5s ease',
                    animation: uploadStatus[platform]?.uploading ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
                        },
                        '70%': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
                        },
                        '100%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
                        },
                    },
                }}
            >
                {icon}
            </Box>
            {uploadStatus[platform]?.success && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'success.main',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'popIn 0.3s ease-out',
                        '@keyframes popIn': {
                            '0%': {
                                transform: 'scale(0)',
                                opacity: 0,
                            },
                            '100%': {
                                transform: 'scale(1)',
                                opacity: 1,
                            },
                        },
                    }}
                >
                    <CheckCircleRoundedIcon sx={{ fontSize: 16, color: 'white' }} />
                </Box>
            )}
        </Box>
    );

    return open ? (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Fade in={showProgressBar}>
                        <Box width="100%" position="relative" sx={{ mb: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={overallProgress}
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'lightgray',
                                    overflow: 'hidden',

                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#78deff',
                                    },
                                }}
                            />

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                position="relative"
                                width="100%"
                                mt={2}
                            >
                                {selectedPlatforms.map((platform, index) =>
                                    renderPlatform(platform, getPlatformIcon(platform), (index + 1) * (100 / selectedPlatforms.length))
                                )}
                            </Box>
                        </Box>
                    </Fade>

                    {showSuccessMessage && (
                        <Fade in={showSuccessMessage}>
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 53, color: 'success.main', mb: 1 }} />
                                <Typography variant="h6" color="success.main">
                                    Post successfully  {scheduledTime ? ' sheduled' : 'created'}
                                </Typography>
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Box>
        </Box>
    ) : null;
};

const getPlatformIcon = (platform) => {
    switch (platform) {
        case 'facebook':
            return <FacebookIcon />;
        case 'twitter':
            return <XIcon />;
        case 'instagram':
            return <InstagramIcon />;
        case 'linkedin':
            return <LinkedInIcon />;
        default:
            return null;
    }
};

export default SocialPlatformUploader;
