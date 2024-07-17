import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Divider,
    Stack,
    Avatar,
    Checkbox,
    Link,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    ThemeProvider,
    Modal,
    Snackbar,
    Alert,
    Skeleton,

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import ToggleButtonTheme from './Themes/ToggleButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import Picker from 'emoji-picker-react';
import ImageModal from '../../components/ImageModal';
import HttpIcon from '../../components/icons/HttpIcon';
import shortenUrl from '../../components/LinkShortner';
import RefreshIcon from '../../components/icons/RefreshIcon';
import FacebookPreview from './FacebookPreview';
import LinkedInPreview from './LinkedInPreview';
import XPreview from './XPreview';


const characterLimits = {
    facebook: 6306,
    instagram: 2200,
    twitter: 300,
    linkedin: 960,
};


const CreatePost: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedToggle, setSelectedToggle] = useState<string | null>('Initial content');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [selectedLocalImage, setSelectedLocalImage] = useState<File | null>(null);
    const [selectedLibraryImage, setSelectedLibraryImage] = useState<{ src: string, alt: string } | null>(null);
    const [isLocalImageHover, setIsLocalImageHover] = useState<boolean>(false);
    const [isLibraryImageHover, setIsLibraryImageHover] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [shortenedLinks, setShortenedLinks] = useState([]);
    const [Linkloading, setLinkloading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [TypeLoading, setTypeLoading] = useState<boolean>(false);



    useEffect(() => {
        const urls = text.match(/https?:\/\/[^\s]+/g);
        if (urls) {
            setShortenedLinks(urls);
        } else {
            setShortenedLinks([]);
        }
    }, [text]);

    useEffect(() => {
        if (text && selectedToggle !== 'Initial content') {
            setTypeLoading(true);
            const timer = setTimeout(() => {
                setTypeLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [text, selectedToggle]);



    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        if (newText.length <= characterLimit || selectedToggle === 'Initial content') {
            setText(newText);
        }
    };

    const getCharacterLimit = () => {
        return characterLimits[selectedToggle as keyof typeof characterLimits] || 0;
    };

    const characterLimit = getCharacterLimit();

    const handleShortenLinks = async () => {
        setLinkloading(true);
        const shortened = await Promise.all(shortenedLinks.map(shortenUrl));
        await new Promise((resolve) => setTimeout(resolve, 2300));
        setShortenedLinks(shortened);
        setLinkloading(false);
        setSnackbarMessage('Links successfully shortened');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    const handleOpenImageModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsModalOpen(false);
    };

    const handleLibraryImageSelect = (image: any) => {
        setSelectedLibraryImage({ src: image.src.medium, alt: image.alt });
        setSelectedLocalImage(null);
        handleCloseImageModal();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedLocalImage(file);
            setSelectedLibraryImage(null);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) {
            setSelectedLocalImage(file);
            setSelectedLibraryImage(null);
        }
    };

    const handleRemoveLocalImage = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        setSelectedLocalImage(null);
    };

    const handleRemoveLibraryImage = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        setSelectedLibraryImage(null);
    };

    const handleInputFileClick = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };


    const userSocialAccounts = Object.entries(userInfo?.socialAccounts || {}).map(([provider, { profileName, profilePicture }]) => ({
        provider,
        profileName,
        profilePicture,
    }))

    const smallProviderIcons: { [key: string]: React.ReactNode } = {
        facebook: <FacebookRoundedIcon sx={{ fontSize: '13px', background: 'white', borderRadius: '10px' }} />,
        twitter: <XIcon sx={{ fontSize: '13px', background: 'white', borderRadius: '10px' }} />,
        instagram: <InstagramIcon sx={{ fontSize: '13px', background: 'white', borderRadius: '10px' }} />,
        linkedin: <LinkedInIcon sx={{ fontSize: '13px', background: 'white', borderRadius: '10px' }} />,
    };

    const normalProviderIcons: { [key: string]: React.ReactNode } = {
        facebook: <FacebookRoundedIcon />,
        twitter: <XIcon />,
        instagram: <InstagramIcon />,
        linkedin: <LinkedInIcon />,
    };

    const handleEmojiClick = (emojiObject: any) => {
        setText((prevText) => prevText + emojiObject.emoji);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
    };

    const handleTextFieldChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedOptions(event.target.value as string[]);
    };

    const handleRemoveOption = (valueToRemove: string) => {
        setSelectedOptions((prevSelected) => prevSelected.filter((value) => value !== valueToRemove));
    };

    const handleToggle = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
        setSelectedToggle(newAlignment);
    };


    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 0.5,
            height: { xs: 'auto', md: '91vh' },
            margin: { xs: '1rem', md: '2rem' }
        }}>
            <Typography variant="h5" sx={{
                fontWeight: 'bold',
                padding: { xs: '0.5rem', md: '1rem' },
                paddingLeft: { xs: '1rem', md: '1.5rem' },
                color: '#343434'
            }}>
                New Post
            </Typography>
            <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />
            <Stack sx={{
                flexDirection: { xs: 'column', md: 'row' },
                width: '100%',
                height: { xs: 'auto', md: '74.5vh' }
            }}>
                <Box component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: { xs: '1rem', md: '1.5rem' },
                    width: { xs: '100%', md: '63%' }
                }}>
                    <Stack component='form'>
                        <Typography>Publish to</Typography>
                        <TextField
                            select
                            fullWidth
                            SelectProps={{
                                multiple: true,
                                value: selectedOptions,
                                onChange: handleTextFieldChange,
                                renderValue: (selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                        {(selected as string[]).map((value) => {
                                            const option = userSocialAccounts.find((option) => option.provider === value);
                                            return option ? (
                                                <Box
                                                    key={value}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        backgroundColor: '#ffe5b2',
                                                        padding: '1px',
                                                        borderRadius: '2rem',

                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                                        <Avatar alt={option.profileName} src={option.profilePicture} sx={{ width: 24, height: 24 }} />
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                right: -5,
                                                                bottom: -8,
                                                                padding: '0',
                                                            }}
                                                        >
                                                            {smallProviderIcons[option.provider]}
                                                        </Box>
                                                    </Box>
                                                    {option.profileName}
                                                    <IconButton
                                                        size="small"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleRemoveOption(value);
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ) : null;
                                        })}
                                    </Box>
                                ),
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxWidth: '100%',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem>
                                <ListItem sx={{ padding: 0 }}>
                                    <ListItemIcon sx={{ minWidth: '10px' }}>
                                        <AccountCircleIcon sx={{ color: '#203170' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={`Accounts (${userSocialAccounts.length})`} primaryTypographyProps={{ fontWeight: 'bold' }} />
                                </ListItem>
                            </MenuItem>
                            {userSocialAccounts.map((option) => (
                                <MenuItem key={option.provider} value={option.provider}>
                                    <Stack direction="row" alignItems="center" gap="0.5rem">
                                        <Checkbox
                                            checked={selectedOptions.includes(option.provider)}
                                            onChange={(event) => {
                                                event.stopPropagation();
                                                handleTextFieldChange({
                                                    target: {
                                                        value: selectedOptions.includes(option.provider)
                                                            ? selectedOptions.filter((v) => v !== option.provider)
                                                            : [...selectedOptions, option.provider],
                                                    },
                                                } as any);
                                            }}
                                        />
                                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                            <Avatar src={option.profilePicture} alt={option.profileName} sx={{ width: 35, height: 35, borderRadius: '20px' }} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    right: -2,
                                                    bottom: -5,
                                                    padding: '0',
                                                }}
                                            >
                                                {smallProviderIcons[option.provider]}
                                            </Box>
                                        </Box>
                                        <Stack>
                                            <Typography>{option.profileName} </Typography>
                                            <Typography sx={{ fontSize: 'xx-small', lineHeight: 1 }}>
                                                {option.provider}
                                            </Typography>
                                        </Stack>


                                    </Stack>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <Link href="#" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AddCircleIcon />
                                    <Typography color="primary">Add a social account</Typography>
                                </Link>
                            </MenuItem>
                        </TextField>
                    </Stack>

                    <Box height='100%'>
                        <ThemeProvider theme={ToggleButtonTheme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={selectedToggle}
                                exclusive
                                onChange={handleToggle}
                                aria-label="Platform"
                            >
                                <ToggleButton
                                    disabled={selectedToggle === 'Initial content'}
                                    value="Initial content"
                                >
                                    Initial Content
                                </ToggleButton>
                                {userSocialAccounts
                                    .filter((account) => selectedOptions.includes(account.provider))
                                    .map((account) => (
                                        <ToggleButton
                                            key={account.provider}
                                            disabled={selectedToggle === account.provider}
                                            value={account.provider}
                                        >
                                            {normalProviderIcons[account.provider]}
                                        </ToggleButton>
                                    ))}
                            </ToggleButtonGroup>
                        </ThemeProvider>

                        <Box
                            sx={{
                                border: isFocused ? '1px solid black' : '1px solid #c5c5c5',
                                maxHeight: { xs: 'auto', md: '93.5%' },
                                borderRadius: '5px',
                                padding: '1rem',
                                '&:focus-within': {
                                    borderColor: 'grey',
                                },
                            }}
                            onClick={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            tabIndex={0}
                        >


                            <TextField
                                multiline
                                rows={8}
                                placeholder="Enter your text and links"
                                fullWidth
                                value={text}
                                onChange={handleTextChange}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        padding: 0,
                                        border: 'none',
                                        letterSpacing: '.5px',
                                        outline: 'none',
                                        boxShadow: 'none',
                                        minHeight: '250px',
                                        alignItems: 'flex-start',
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none',
                                        minHeight: '250px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&:hover fieldset': {
                                            border: 'none',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            />

                            <Box >
                                <Box display='flex' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} justifyContent='center' alignItems='center'>

                                        {selectedToggle !== 'Initial content' && (
                                            <Typography sx={{ color: text.length >= characterLimit ? 'red' : 'grey', fontSize: '14px', fontWeight: '100' }}>
                                                {text.length} / {characterLimit}
                                            </Typography>
                                        )}
                                        <Box
                                            sx={{
                                                width: '1.4rem', height: '1.4rem', backgroundColor: '#203170', borderRadius: '12px',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <RefreshIcon loading={TypeLoading} />
                                        </Box>

                                    </Stack>

                                    {shortenedLinks.length > 0 && (
                                        <Stack direction="row" spacing={1} justifyContent='center' alignItems='center'>
                                            <Link onClick={handleShortenLinks} gap={1} sx={{
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                fontSize: '14px', cursor: 'pointer', textDecoration: 'none',
                                                color: '#000'
                                            }}> {shortenedLinks.length}.<HttpIcon loading={Linkloading} />Shortened with bit.ly</Link>
                                        </Stack>
                                    )}

                                    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                                            {snackbarMessage}
                                        </Alert>
                                    </Snackbar>

                                    <Stack direction="row" spacing={1} alignItems='center' marginBottom='.5rem'>
                                        <EmojiEmotionsOutlinedIcon
                                            sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey', cursor: 'pointer' }}
                                            onClick={toggleEmojiPicker}
                                        />
                                        <TagOutlinedIcon
                                            sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey' }}
                                        />
                                    </Stack>

                                </Box>
                                <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />

                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: '1rem',
                                    marginTop: '1rem',
                                    width: '40%',
                                    color: '#cecece'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        border: '2px dashed #cecece',
                                        width: { xs: '100%', sm: '50%' },
                                        height: '100px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: selectedLibraryImage ? 'not-allowed' : 'pointer',
                                    }}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={!selectedLibraryImage && !selectedLocalImage ? handleInputFileClick : undefined}
                                    onMouseEnter={() => setIsLocalImageHover(true)}
                                    onMouseLeave={() => setIsLocalImageHover(false)}
                                >
                                    {selectedLocalImage ? (
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={URL.createObjectURL(selectedLocalImage)}
                                                alt="Uploaded"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {isLocalImageHover && (
                                                <CloseIcon
                                                    onClick={handleRemoveLocalImage}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px',
                                                        cursor: 'pointer',
                                                        background: '#828282',
                                                        borderRadius: '1rem',
                                                        color: 'white'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        <AddPhotoAlternateIcon sx={{ fontSize: '4rem', width: '4rem', height: '4rem' }} />
                                    )}
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileInputChange}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        border: '2px dashed #cecece',
                                        width: { xs: '100%', sm: '50%' },
                                        height: '100px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: selectedLocalImage ? 'not-allowed' : 'pointer',
                                    }}
                                    onClick={!selectedLibraryImage && !selectedLocalImage ? handleOpenImageModal : undefined}
                                    onMouseEnter={() => setIsLibraryImageHover(true)}
                                    onMouseLeave={() => setIsLibraryImageHover(false)}
                                >
                                    {selectedLibraryImage ? (
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={selectedLibraryImage.src}
                                                alt={selectedLibraryImage.alt}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {isLibraryImageHover && (
                                                <CloseIcon
                                                    onClick={handleRemoveLibraryImage}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px',
                                                        cursor: 'pointer',
                                                        background: '#828282',
                                                        borderRadius: '1rem',
                                                        color: 'white'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        <AutoStoriesOutlinedIcon sx={{ fontSize: '4rem', width: '4rem', height: '4rem' }} />
                                    )}
                                </Box>

                                <Modal component="div" open={isModalOpen} onClose={handleCloseImageModal}>
                                    <Box
                                        sx={{
                                            width: '40%',
                                            height: '70%',
                                            margin: 'auto',
                                            marginTop: '10%',
                                            backgroundColor: 'white',
                                            padding: '1rem',
                                            borderRadius: '5px',
                                            overflow: 'scroll'
                                        }}
                                    >
                                        <ImageModal onSelectImage={handleLibraryImageSelect} />
                                    </Box>
                                </Modal>
                            </Box>


                        </Box>
                    </Box>
                </Box >

                <Box component="form"
                    gap={1}
                    overflow='scroll'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: { xs: '100%', md: '37%' },
                        backgroundColor: '#d8d8d8',
                        height: { xs: 'auto', md: '100%' },
                        padding: { xs: '1rem', md: '1rem' },

                    }}>
                    {showEmojiPicker &&
                        <Box position='absolute' left='67%' top='29%' transform='translate(-50%, -50%)' sx={{ zIndex: '1' }}>
                            <Picker
                                skinTonePickerLocation={'false'}
                                width='300'
                                onEmojiClick={handleEmojiClick}
                            />
                        </Box>
                    }
                    {/* {shortenedLinks.map((link, index) => (
                        <Box sx={{ mt: 2, p: 3 }}>
                            <Typography key={index} variant="body1" sx={{ mt: 1 }}>
                                {link}
                            </Typography>
                        </Box>
                    ))} */}


                    {selectedToggle === 'Initial content' && (
                        <>
                            <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem' }}>
                                <Skeleton variant="rectangular" animation='wave' sx={{ borderRadius: '3px', width: '1rem', height: '1rem' }}>
                                </Skeleton>
                                <Skeleton animation='wave' width='4rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                            </Stack>


                            <Stack gap='3px' sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', p: 1 }}>
                                <Stack direction='row' gap={1} sx={{ alignItems: 'center', }}>
                                    <Skeleton variant='rectangular' animation='wave' sx={{ borderRadius: '5px', width: '2rem', height: '2rem' }}>
                                        <Avatar />
                                    </Skeleton>
                                    <Typography>
                                        <Skeleton animation='wave' width='6rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                    </Typography>
                                </Stack>

                                {!text ? (
                                    <Box>
                                        <Typography>
                                            <Skeleton animation='wave' sx={{ borderRadius: '7px', height: '1rem' }} />
                                        </Typography>
                                        <Typography>
                                            <Skeleton animation='wave' width='6rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ width: '100%', overflow: 'hidden', }}>
                                        <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 'small' }}>
                                            {text}
                                        </Typography>
                                    </Box>
                                )}

                                <Stack direction='row' gap={1} sx={{ alignItems: 'center', mt: '1rem', }} >
                                    <Typography>
                                        <Skeleton animation='wave' width='4rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                    </Typography>
                                    <Typography>
                                        <Skeleton animation='wave' width='4rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                    </Typography>
                                    <Typography>
                                        <Skeleton animation='wave' width='4rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                    </Typography>
                                </Stack>
                            </Stack>
                        </>
                    )}
                    {selectedToggle === 'facebook' && (
                        <FacebookPreview
                            text={text}
                            account={userSocialAccounts.find(account => account.provider === 'facebook')}
                            selectedLocalImage={selectedLocalImage}
                            selectedLibraryImage={selectedLibraryImage}
                            shortenedLinks={shortenedLinks}
                        />
                    )}
                    {selectedToggle === 'linkedin' && (
                        <LinkedInPreview
                            text={text}
                            account={userSocialAccounts.find(account => account.provider === 'linkedin')}
                            selectedLocalImage={selectedLocalImage}
                            selectedLibraryImage={selectedLibraryImage}
                            shortenedLinks={shortenedLinks}
                        />
                    )}
                    {selectedToggle === 'twitter' && (

                        <XPreview
                            text={text}
                            account={userSocialAccounts.find(account => account.provider === 'twitter')}
                            selectedLocalImage={selectedLocalImage}
                            selectedLibraryImage={selectedLibraryImage}
                            shortenedLinks={shortenedLinks}
                        />
                    )}


                    <Typography sx={{ fontSize: 'small', textAlign: 'center', fontWeight: '100', color: 'gray', mx: '2rem', mt: 1 }}>Social networks regularly make updates to formatting, so your post may appear slightly different when published.</Typography>
                </Box>

            </Stack >
            <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />
            <Stack direction='row' display='flex' gap={2} justifyContent='end' sx={{ alignItems: 'center', padding: '13px' }}>
                <Link
                    sx={{
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#203170',
                    }}
                >
                    Schedule for later
                </Link>
                <Button
                    variant="contained"
                    sx={{
                        color: '#203170',
                        fontWeight: '600',
                        backgroundColor: '#EAB52F',
                        textTransform: 'none',
                        marginRight: '1rem',
                        '&:hover': {
                            backgroundColor: '#e5a500'
                        }
                    }}
                >
                    Post now
                </Button>
            </Stack>
        </Box >
    );
};

export default CreatePost;
