import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const FBAccountListModal = ({ open, onClose, pages, onConfirm, fbUser }) => {
    const [selectedPages, setSelectedPages] = useState([]);

    const handleToggle = (page) => {
        const currentIndex = selectedPages.indexOf(page);
        const newSelectedPages = [...selectedPages];

        if (currentIndex === -1) {
            newSelectedPages.push(page);
        } else {
            newSelectedPages.splice(currentIndex, 1);
        }

        setSelectedPages(newSelectedPages);
    };

    const handleConfirm = () => {
        onConfirm(selectedPages);
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    minHeight: '30vh',
                    width: '50vw',
                    maxWidth: '40vw',
                    borderRadius: '12px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    padding: '1rem',
                    background: 'linear-gradient(45deg, #4267B2 30%, #5890FF 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(66, 103, 178, .3)',
                }}
            >
                {fbUser ? (
                    <Box>
                        <Box display="flex" alignItems="center">
                            <Avatar
                                src={fbUser.profilePicture}
                                sx={{
                                    mr: 2,
                                    width: 56,
                                    height: 56,
                                    border: '3px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                            />
                            <Box>
                                <Typography variant="h5" fontWeight="bold" mt={3}>
                                    {fbUser.profileName}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                                    Choose your pages to publish contents
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h6" fontWeight="bold">
                        No Facebook User Data
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent sx={{ padding: '1.5rem' }}>
                <Typography variant='body1' gutterBottom sx={{ color: '#4267B2', fontWeight: 'bold', mt: 2 }}>
                    Facebook Pages
                </Typography>
                <List sx={{ bgcolor: '#f0f2f5', borderRadius: '8px', padding: '8px' }}>
                    {pages.map((page, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                mb: 1,
                                bgcolor: 'white',
                                borderRadius: '8px',
                                '&:last-child': { mb: 0 },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar src={page.pageImage} sx={{ width: 48, height: 48 }} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={page.pageName}
                                sx={{ '& .MuiTypography-root': { fontWeight: 'medium' } }}
                            />
                            {selectedPages.indexOf(page) === -1 ? (
                                <Button
                                    onClick={() => handleToggle(page)}
                                    sx={{
                                        textTransform: 'none',
                                        color: '#4267B2',
                                        '&:hover': { bgcolor: 'rgba(66, 103, 178, 0.08)' },
                                    }}
                                >
                                    <AddCircleOutlineIcon sx={{ mr: 1 }} /> Add
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleToggle(page)}
                                    sx={{
                                        textTransform: 'none',
                                        color: '#65676b',
                                        '&:hover': { bgcolor: 'rgba(101, 103, 107, 0.08)' },
                                    }}
                                >
                                    <CancelIcon sx={{ mr: 1 }} /> Remove
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ padding: '1rem 24px' }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#65676b',
                        '&:hover': { bgcolor: 'rgba(101, 103, 107, 0.08)' },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={selectedPages.length === 0} 
                    sx={{
                        bgcolor: '#4267B2',
                        '&:hover': { bgcolor: '#365899' },
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FBAccountListModal;
