import { useRef, useState, useEffect } from 'react';
import { Modal, Box, Button, IconButton, Stack, Card, CardContent, Typography, Divider } from '@mui/material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const ImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
    const cropperRef = useRef(null);
    const [aspectRatio, setAspectRatio] = useState(NaN);
    const [isLocked, setIsLocked] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);

    const getCropper = () => cropperRef.current?.cropper;

    const handleCropComplete = () => {
        const cropper = getCropper();
        if (cropper) {
            const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedDataUrl);  // Store the cropped image
            onCropComplete(croppedDataUrl);
        }
    };

    const handleRotate = (angle) => getCropper()?.rotate(angle);

    const handleFlip = (direction) => {
        const cropper = getCropper();
        if (cropper) {
            const scale = cropper.getData()[`scale${direction}`] || 1;
            cropper[`scale${direction}`](-scale);
        }
    };

    const handleAspectRatioChange = (ratio) => {
        setAspectRatio(ratio);
        getCropper()?.setAspectRatio(ratio);
        setIsLocked(true);
    };

    const toggleLock = () => {
        setIsLocked(!isLocked);
        if (isLocked) {
            setAspectRatio(NaN);
            getCropper()?.setAspectRatio(NaN);
        } else {
            setAspectRatio(aspectRatio || 1);
            getCropper()?.setAspectRatio(aspectRatio || 1);
        }
    };

    // Set up the Cropper with the previously cropped image or the original image
    useEffect(() => {
        if (isOpen && croppedImage) {
            getCropper()?.replace(croppedImage);
        }
    }, [isOpen, croppedImage]);

    const aspectRatios = [
        { name: 'Square', ratio: 1, label: '1:1' },
        { name: 'Landscape', ratio: 16 / 9, label: '16:9' },
        { name: 'Portrait', ratio: 4 / 5, label: '4:5' },
        { name: 'Story', ratio: 9 / 16, label: '9:16' },
    ];

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90vw',
                    height: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Stack direction="row" flexGrow={1}>
                    <Box
                        sx={{
                            width: '20%',
                            overflowY: 'auto',
                            background: '#dfdfdf',
                            borderRadius: 2,
                            boxShadow: 3,
                            p: 2,

                        }}
                    >
                        <Typography gutterBottom align="center" fontWeight="300" letterSpacing='3px'>
                            TRANSFORM
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            {aspectRatios.map((item) => (
                                <Card
                                    key={item.name}
                                    onClick={() => handleAspectRatioChange(item.ratio)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: aspectRatio === item.ratio ? 'primary.main' : 'background.paper',
                                        color: aspectRatio === item.ratio ? 'primary.contrastText' : 'text.primary',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 2,
                                            bgcolor: 'grey',
                                            color: 'white'
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography fontWeight="medium">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {item.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </Box>

                    <Stack direction="column" sx={{ flexGrow: 1 }}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                width: '75vw',
                                height: '70vh',
                                p: 5,
                                pb: 0,
                                m: 0,
                            }}
                        >
                            <Cropper
                                ref={cropperRef}
                                src={croppedImage || imageSrc}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                                aspectRatio={aspectRatio}
                                guides
                                background={false}
                            />
                        </Box>

                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Box>
                                <IconButton onClick={toggleLock}>
                                    {isLocked ? <LockIcon /> : <LockOpenIcon />}
                                </IconButton>
                                <IconButton onClick={() => handleRotate(-90)}>
                                    <RotateLeftIcon />
                                </IconButton>
                                <IconButton onClick={() => handleRotate(90)}>
                                    <RotateRightIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFlip('X')}>
                                    <FlipIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFlip('Y')}>
                                    <FlipIcon sx={{ transform: 'rotate(90deg)' }} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={onClose} sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleCropComplete}>
                                Crop
                            </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ImageCropModal;
