import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState, useEffect } from 'react';

const CarouselComponent = ({ slides, interval = 5000, error, noPosts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next');
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (!error && !noPosts && slides.length > 0) {
            const timer = setInterval(() => {
                handleNext();
            }, interval);
            return () => clearInterval(timer);
        }
    }, [currentIndex, interval, error, noPosts, slides.length]);

    const handleNext = () => {
        setDirection('next');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setDirection('prev');
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const renderCarouselContent = () => {
        if (error) {
            return <img
                src="catError.gif"
                alt="Error loading best posts"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
        }

        if (noPosts || slides.length === 0) {
            return <Typography color="textSecondary">No top performing posts available</Typography>;
        }

        return (
            <>
                {slides.map((slide, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: index === currentIndex ? 1 : 0,
                            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                            transform: `translateX(${index === currentIndex ? '0%' :
                                direction === 'next' ? '100%' : '-100%'})`,
                        }}
                    >
                        <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                ))}

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
                        {slides[currentIndex]?.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        {slides.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    mx: 0.5,
                                    bgcolor: index === currentIndex ? 'primary.main' : 'grey.400',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 'next' : 'prev');
                                    setCurrentIndex(index);
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {isHovering && (
                    <>
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: 8,
                                transform: 'translateY(-50%)',
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
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
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </>
                )}
            </>
        );
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#E7E5E5' }}>
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', pl: 1 }}>
                <EmojiEventsIcon sx={{ fontSize: '2rem', color: '#e1af30', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'black' }}>
                    Top performing posts
                </Typography>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {renderCarouselContent()}
            </Box>
        </Box>
    );
};

export default CarouselComponent;
