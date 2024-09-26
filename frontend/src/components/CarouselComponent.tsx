import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const CarouselComponent = ({ images, content }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Fixed Header */}
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', pl: 1 }}>
                <EmojiEventsIcon sx={{ fontSize: '2rem', color: '#e1af30', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                    Top performing posts
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Content Overlay with Dots */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        p: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {content[currentIndex]?.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        {images.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    mx: 0.5,
                                    bgcolor: index === currentIndex ? 'primary.main' : 'grey.400',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Navigation Arrows without background */}
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 8,
                        transform: 'translateY(-50%)',
                        color: 'white',
                    }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 8,
                        transform: 'translateY(-50%)',
                        color: 'white',
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default CarouselComponent;