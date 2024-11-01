import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    Button,
    Typography,
} from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from './Snackbar';
import { AddSocialModalProps } from '../types/Types';
import { updatePages, updateUser } from '../features/auth/CredSlice';
import { useNavigate } from 'react-router-dom';
import FBAccountListModal from './FBAccountListModal';


const socialPlatforms = [
    { name: 'Facebook', icon: FacebookRoundedIcon, color: '#1877F2', provider: 'facebook' },
    { name: 'Instagram', icon: InstagramIcon, color: '#EE1973', provider: 'instagram' },
    { name: 'LinkedIn', icon: LinkedInIcon, color: '#1877F2', provider: 'linkedin' },
    { name: 'Twitter X', icon: XIcon, color: '#000000', provider: 'twitter' },
];

const AddSocialModal: React.FC<AddSocialModalProps> = ({ open, handleClose }) => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const navigate = useNavigate();
    const [openFbPagesModal, setOpenFbPagesModal] = useState(false);
    const [userPages, setUserPages] = useState([]);
    const [fbUserData, setFbUserData] = useState(null);
    const [snackbarProps, setSnackbarProps] = useState({
        open: false,
        message: '',
        severity: 'info' as 'success' | 'error' | 'info' | 'warning',
    });
    const dispatch = useDispatch()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get('user');

        if (userParam) {
            try {
                const User = JSON.parse(decodeURIComponent(userParam));

                if (User.userProfile) {
                    setFbUserData(User.userProfile);
                    setUserPages(User.userPages || []);
                    setOpenFbPagesModal(true);
                } else {
                    dispatch(updateUser({
                        provider: User.provider,
                        profileName: User.profileName,
                        profilePicture: User.profilePicture
                    }));
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error parsing user data', error);
            }
        } else {
            console.error('Data parameter is missing in URL');
        }
    }, [dispatch, navigate]);

    const handleModalClose = () => {
        setOpenFbPagesModal(false);
        navigate('/dashboard');
    };

    const handleModalConfirm = (selectedPages) => {
        if (fbUserData) {
            const pagesData = selectedPages.map(page => ({
                pageName: page.pageName,
                pageImage: page.pageImage,
            }));

            dispatch(updatePages({
                provider: fbUserData.provider,
                userPages: pagesData
            }));

            localStorage.setItem('userPages', JSON.stringify(pagesData));

            setOpenFbPagesModal(false);
            navigate('/dashboard');
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarProps(prev => ({ ...prev, open: false }));
    };

    const handleSocialLogin = (provider: string) => {
        if (userInfo?.socialAccounts && userInfo.socialAccounts[provider]) {
            setSnackbarProps({
                open: true,
                message: 'Already connected',
                severity: 'info',
            });
        } else {
            window.location.href = `https://backend.frostbay.online/connect/${provider}?redirectUri=${encodeURIComponent('/dashboard')}`;
        }
    };




    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
                    Connect Social Platforms
                </Typography>
            </DialogTitle>

            <DialogContent>
                <List>
                    {socialPlatforms.map(({ name, icon: Icon, color, provider }) => (
                        <ListItem
                            key={provider}
                            sx={{ marginBottom: '12px', backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<Icon sx={{ fontSize: 30, color: color }} />}
                                onClick={() => handleSocialLogin(provider)}
                                sx={{
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    backgroundColor: '#f7f9fc',
                                    color: '#333',
                                    ':hover': {
                                        backgroundColor: '#e7eaf0',
                                    }
                                }}
                            >
                                {name}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            <FBAccountListModal
                open={openFbPagesModal}
                onClose={handleModalClose}
                pages={userPages}
                onConfirm={handleModalConfirm}
                fbUser={fbUserData}
            />

            <Snackbar
                open={snackbarProps.open}
                message={snackbarProps.message}
                severity={snackbarProps.severity}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Dialog>
    );
};

export default AddSocialModal;
