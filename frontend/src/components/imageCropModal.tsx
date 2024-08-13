import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Typography } from '@mui/material';

const ImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
    const [cropper, setCropper] = useState();

    const handleCropComplete = () => {
        if (typeof cropper !== "undefined") {
            onCropComplete(cropper.getCroppedCanvas().toDataURL());
        }
    };

    return (

        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="image-crop-modal"
            aria-describedby="modal-to-crop-image"
        >

            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Cropper
                    src={imageSrc}
                    style={{ height: 400, width: '100%' }}
                    initialAspectRatio={1}
                    guides={false}
                    onInitialized={(instance) => setCropper(instance)}
                />
                //     <Button onClick={handleCropComplete}>Crop</Button>
                <Button onClick={onClose}>Cancel</Button>
            </Box>
        </Modal >
    );
};

export default ImageCropModal;