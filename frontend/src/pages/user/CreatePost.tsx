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
import InstagramPreview from './InstagramPreview';
import { useEditPostMutation, useGetCharacterLimitsQuery } from '../../api/ApiSlice';
import { useCreatePostMutation } from '../../api/ApiSlice';
import HashtagGenerator from '../../components/HashtagGenerator';
import ImageCropModal from '../../components/imageCropModal';
import EditIcon from '@mui/icons-material/Edit';
import SocialPlatformUploader from '../../components/LoadingAnimation/uploadLoading';
import SchedulePicker from '../../components/SchedulePicker';
import { useShedulePostMutation } from '../../api/ApiSlice';
import { hi } from 'date-fns/locale';



const CreatePost: React.FC = ({ event, onClose }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedToggle, setSelectedToggle] = useState<string | null>('Initial content');
    const [isFocused, setIsFocused] = useState<boolean>(false);
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
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [characterLimit, setCharacterLimit] = useState(0);
    const [initialContent, setInitialContent] = useState('');
    const [text, setText] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
    });
    const { data: characterLimits, isLoading } = useGetCharacterLimitsQuery();
    const [createPost] = useCreatePostMutation();
    const [shedulePost] = useShedulePostMutation();
    const [showHashtagGenerator, setShowHashtagGenerator] = useState(false);
    const [cropImageType, setCropImageType] = useState<'local' | 'library'>('local');
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [postSuccessModal, setPostSuccessModal] = useState(false);
    const [uploading, setUpLoading] = useState(false);
    const [schedulePickerOpen, setSchedulePickerOpen] = useState(false);
    const [scheduledTime, setScheduledTime] = useState<string | null>(null);
    const eventImage = event?.extendedProps?.imageUrl;
    const isEditing = Boolean(event);
    const [editPost] = useEditPostMutation();


    useEffect(() => {
        if (event) {
            setSelectedOptions(event.extendedProps.platform ? [event.extendedProps.platform] : []);
        }
    }, [event]);

    useEffect(() => {
        if (event) {
            const eventContent = event.extendedProps.content || event.title || '';
            setInitialContent(eventContent);
            setText(prevText => ({
                ...prevText,
                [event.extendedProps.platform]: eventContent,
            }));
            setSelectedToggle(event.extendedProps.platform);

            if (eventImage) {
                setSelectedLibraryImage({ src: eventImage, alt: 'Event image' });
            }
        }
    }, [event, eventImage]);


    useEffect(() => {
        const currentText = text[selectedToggle] || '';
        const urls = currentText.match(/https?:\/\/[^\s]+/g);
        if (urls) {
            setShortenedLinks(urls);
        } else {
            setShortenedLinks([]);
        }
    }, [text, selectedToggle]);


    useEffect(() => {
        if (characterLimits && selectedToggle !== 'Initial content') {
            setCharacterLimit(characterLimits[selectedToggle]);
        }
    }, [characterLimits, selectedToggle]);

    const handleEdit = async () => {
        if (!event) {
            setSnackbarMessage("No event selected for editing!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const platform = event.extendedProps.platform;
        const newContent = text[platform];
        const originalContent = event.title;
        const jobId = event.extendedProps.jobId;

        if (!newContent || newContent.trim() === '') {
            setSnackbarMessage("Content cannot be empty!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (platform === 'instagram' && !selectedLocalImage && !selectedLibraryImage && !event.extendedProps.imageUrl) {
            setSnackbarMessage("Instagram posts require an image!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setUpLoading(true);

        const formData = new FormData();
        let contentChanged = false;
        let imageChanged = false;
        let imageDeleted = false;

        // Check if content has changed
        if (newContent !== originalContent) {
            formData.append('content', JSON.stringify({ [platform]: newContent }));
            contentChanged = true;
        }

        // Handle image changes
        if (selectedLocalImage) {
            formData.append('image', selectedLocalImage);
            formData.append('imageType', 'local');
            imageChanged = true;
        } else if (selectedLibraryImage && selectedLibraryImage.src !== event.extendedProps.imageUrl) {
            const file = await urlToFile(selectedLibraryImage.src, 'library-image.jpg', 'image/jpeg');
            formData.append('image', file);
            formData.append('imageType', 'library');
            imageChanged = true;
        } else if (!selectedLocalImage && !selectedLibraryImage && event.extendedProps.imageUrl) {
            formData.append('imageDeleted', 'true');
            imageDeleted = true;
        }

        if (!contentChanged && !imageChanged && !imageDeleted) {
            setSnackbarMessage('No changes detected.');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setUpLoading(false);
            return;
        }

        // Append platform and jobId to formData
        formData.append('platform', platform);
        formData.append('jobId', jobId);

        try {
            const editRequest = {
                jobId,
                formData,
                platforms: [platform],
            };

            console.log('Edit request:', editRequest);

            await editPost(editRequest).unwrap();

            setSnackbarMessage('Post updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onClose();
        } catch (error) {
            console.error('Failed to update post:', error);
            setSnackbarMessage('Failed to update post.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setUpLoading(false);
        }
    };



    const toggleHashtagGenerator = () => {
        setShowHashtagGenerator(!showHashtagGenerator);
    };

    const closeHashtagGenerator = () => {
        setShowHashtagGenerator(false);
    };


    const handleSchedule = (dateTime: string) => {
        setScheduledTime(dateTime);
    };

    const handleCropComplete = async (croppedImageData: string) => {
        try {
            if (cropImageType === 'local' || cropImageType === 'library') {
                const response = await fetch(croppedImageData);
                const blob = await response.blob();

                const file = new File([blob], "cropped_image.png", { type: blob.type });

                if (cropImageType === 'local') {
                    setSelectedLocalImage(file);
                } else if (cropImageType === 'library') {
                    setSelectedLibraryImage({ ...selectedLibraryImage, src: URL.createObjectURL(file) });
                }
            }
        } catch (error) {
            console.error('Error during image processing:', error);
        } finally {
            setIsCropModalOpen(false);
        }
    };

    const urlToFile = async (url, filename, mimeType) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    };

    const handleSubmit = async () => {

        if (!Object.values(text).some((content) => content.trim() !== '')) {
            setSnackbarMessage("Content cannot be empty!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (selectedOptions.includes('instagram') && !selectedLocalImage && !selectedLibraryImage) {
            setSnackbarMessage("Instagram posts require an image!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (scheduledTime) {
            const scheduledDate = new Date(scheduledTime);
            const now = new Date();

            if (scheduledDate <= now) {
                setSnackbarMessage("Scheduled time must be in the future!");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
        }

        setUpLoading(true);

        const filteredContent = Object.keys(text)
            .filter((key) => selectedOptions.includes(key))
            .reduce((obj, key) => {
                obj[key] = text[key];
                return obj;
            }, {});

        console.log('Filtered', filteredContent);

        const formData = new FormData();
        formData.append('content', JSON.stringify(filteredContent));

        if (selectedLocalImage) {
            formData.append('image', selectedLocalImage);
        } else if (selectedLibraryImage) {
            const file = await urlToFile(selectedLibraryImage.src, 'library-image.jpg', 'image/jpeg');
            formData.append('image', file);
        }

        try {
            if (scheduledTime) {
                formData.append('scheduledTime', scheduledTime);
                await shedulePost(formData).unwrap();
            } else {
                await createPost(formData).unwrap();
            }
            setPostSuccessModal(true);
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };


    const handleHashtagSelect = (hashtag) => {
        const newText = selectedToggle === 'Initial content' ? initialContent : text[selectedToggle] || '';
        const hashtagsText = `#${hashtag} `;
        const updatedText = newText.slice(0, cursorPosition) + hashtagsText + newText.slice(cursorPosition);
        setCursorPosition(cursorPosition + hashtagsText.length);

        if (selectedToggle === 'Initial content') {
            setInitialContent(updatedText);
            setText({
                facebook: updatedText,
                twitter: updatedText,
                linkedin: updatedText,
                instagram: updatedText,
            });
        } else {
            setText(prevState => ({
                ...prevState,
                [selectedToggle]: updatedText,
            }));
        }
    };


    const handleTextChange = (e) => {
        const newText = e.target.value;
        setCursorPosition(e.target.selectionStart);

        if (selectedToggle === 'Initial content') {
            setInitialContent(newText);
            setText({
                facebook: newText,
                twitter: newText,
                linkedin: newText,
                instagram: newText,
            });
        } else {
            setText(prevState => ({
                ...prevState,
                [selectedToggle]: newText,
            }));
        }
    };

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

    const handleFileInputChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedLocalImage(file);
            setSelectedLibraryImage(null);
        }
    };


    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
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
        document.getElementById('fileInput').click();
    };

    const userSocialAccounts = Object.entries(userInfo?.socialAccounts || {}).map(([provider, { profileName, profilePicture, userPages }]) => ({
        provider,
        profileName,
        profilePicture,
        userPages,
    }));


    const smallProviderIcons: { [key: string]: React.ReactNode } = {
        facebook: <FacebookRoundedIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
        instagram: <InstagramIcon sx={{ color: '#EE1973', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
        linkedin: <LinkedInIcon sx={{ color: '#1877F2', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
        twitter: <XIcon sx={{ color: '#000000', fontSize: '12px', background: 'white', borderRadius: '20px' }} />,
    };

    const handleEmojiClick = (emojiObject) => {
        if (!emojiObject || !emojiObject.emoji || typeof emojiObject.emoji !== 'string') {
            console.error("Invalid emoji object:", emojiObject);
            return;
        }

        const emoji = emojiObject.emoji;
        const updatedText = { ...text };
        let newText;

        if (selectedToggle === 'Initial content') {
            const initialNewText = initialContent.slice(0, cursorPosition) + emoji + initialContent.slice(cursorPosition);
            setInitialContent(initialNewText);
            newText = initialNewText;
            updatedText.facebook = initialNewText;
            updatedText.twitter = initialNewText;
            updatedText.linkedin = initialNewText;
            updatedText.instagram = initialNewText;
        } else {
            const selectedText = updatedText[selectedToggle] || '';
            newText = selectedText.slice(0, cursorPosition) + emoji + selectedText.slice(cursorPosition);
            updatedText[selectedToggle] = newText;
        }

        setText(updatedText);
        setCursorPosition(cursorPosition + emoji.length);
    };

    const handleCursorPosition = (e) => {
        setCursorPosition(e.target.selectionStart || 0);
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
                {isEditing ? 'Edit Post' : 'New Post'}
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

                                            if (option) {
                                                let profileName = option.profileName;
                                                let profilePicture = option.profilePicture;

                                                if (option.provider === 'facebook' && option.userPages?.length) {
                                                    profileName = option.userPages[0].pageName;
                                                    profilePicture = option.userPages[0].pageImage;
                                                }

                                                return (
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
                                                            <Avatar alt={profileName} src={profilePicture} sx={{ width: 24, height: 24 }} />
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
                                                        {profileName}
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
                                                );
                                            }
                                            return null;
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
                            {userSocialAccounts.map((option) => {
                                let profileName = option.profileName;
                                let profilePicture = option.profilePicture;

                                if (option.provider === 'facebook' && option.userPages?.length) {
                                    profileName = option.userPages[0].pageName;
                                    profilePicture = option.userPages[0].pageImage;
                                }

                                return (
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
                                                <Avatar src={profilePicture} alt={profileName} sx={{ width: 35, height: 35, borderRadius: '20px' }} />
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
                                                <Typography>{profileName}</Typography>
                                                <Typography sx={{ fontSize: 'xx-small', lineHeight: 1 }}>
                                                    {option.provider}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </MenuItem>
                                );
                            })}
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
                                onChange={(event, newToggle) => {
                                    if (newToggle !== null) {
                                        setSelectedToggle(newToggle);
                                    }
                                }}
                                aria-label="Platform"
                            >
                                <ToggleButton
                                    disabled={selectedToggle === 'Initial content'}
                                    value="Initial content"
                                >
                                    Initial Content
                                </ToggleButton>
                                {userSocialAccounts
                                    .filter(account => selectedOptions.includes(account.provider))
                                    .map(account => (
                                        <ToggleButton
                                            key={account.provider}
                                            disabled={selectedToggle === account.provider}
                                            value={account.provider}
                                        >
                                            {account.provider === 'facebook' && <FacebookRoundedIcon />}
                                            {account.provider === 'twitter' && <XIcon />}
                                            {account.provider === 'linkedin' && <LinkedInIcon />}
                                            {account.provider === 'instagram' && <InstagramIcon />}
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
                                value={selectedToggle === 'Initial content' ? initialContent : text[selectedToggle] || ''}
                                onChange={handleTextChange}
                                onClick={handleCursorPosition}
                                onKeyUp={handleCursorPosition}
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

                            <Box>
                                <Box display='flex' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} justifyContent='center' alignItems='center'>
                                        {selectedToggle !== 'Initial content' && (
                                            <Typography sx={{ color: text[selectedToggle].length >= characterLimit ? 'red' : 'grey', fontSize: '14px', fontWeight: '100' }}>
                                                {text[selectedToggle].length} / {characterLimit}
                                            </Typography>
                                        )}
                                        <Box
                                            sx={{
                                                width: '1.4rem', height: '1.4rem', backgroundColor: '#203170', borderRadius: '12px',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <RefreshIcon />
                                        </Box>
                                    </Stack>

                                    {shortenedLinks.length > 0 && (
                                        <Stack direction="row" spacing={1} justifyContent='center' alignItems='center'>
                                            <Link onClick={handleShortenLinks} gap={1} sx={{
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                fontSize: '14px', cursor: 'pointer', textDecoration: 'none',
                                                color: '#000'
                                            }}> {shortenedLinks.length}.<HttpIcon />Shortened with bit.ly</Link>
                                        </Stack>
                                    )}

                                    <Stack direction="row" spacing={1} alignItems='center' marginBottom='.5rem'>
                                        <EmojiEmotionsOutlinedIcon
                                            sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey', cursor: 'pointer' }}
                                            onClick={toggleEmojiPicker}
                                        />
                                        <TagOutlinedIcon
                                            sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey', cursor: 'pointer' }}
                                            onClick={toggleHashtagGenerator}
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
                                                <>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                            transition: 'background-color 0.5s ease',
                                                        }}
                                                    />
                                                    <CloseIcon
                                                        onClick={handleRemoveLocalImage}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '-10px',
                                                            right: '-10px',
                                                            cursor: 'pointer',
                                                            background: '#479bff',
                                                            borderRadius: '1rem',
                                                            color: 'white',
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <EditIcon
                                                        onClick={() => {
                                                            setCropImageSrc(URL.createObjectURL(selectedLocalImage));
                                                            setCropImageType('local');
                                                            setIsCropModalOpen(true);
                                                        }}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '10%',
                                                            fontSize: '2rem',
                                                            right: ' 34%',
                                                            cursor: 'pointer',
                                                            background: '#444444',
                                                            borderRadius: '1rem',
                                                            color: 'white',
                                                            padding: '4px',
                                                            zIndex: 1,

                                                        }}
                                                    />
                                                </>
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
                                                src={selectedLocalImage ? URL.createObjectURL(selectedLocalImage) : eventImage}
                                                alt={selectedLibraryImage?.alt || 'Event Image'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {isLibraryImageHover && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                            transition: 'background-color 0.5s ease',
                                                        }}
                                                    />
                                                    <CloseIcon
                                                        onClick={handleRemoveLibraryImage}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '-10px',
                                                            right: '-10px',
                                                            cursor: 'pointer',
                                                            background: '#479bff',
                                                            borderRadius: '1rem',
                                                            color: 'white',
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <EditIcon
                                                        onClick={() => {
                                                            setCropImageSrc(selectedLibraryImage?.src || eventImage);
                                                            setCropImageType('library');
                                                            setIsCropModalOpen(true);
                                                        }}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '10%',
                                                            fontSize: '2rem',
                                                            right: ' 34%',
                                                            cursor: 'pointer',
                                                            background: '#444444',
                                                            borderRadius: '1rem',
                                                            color: 'white',
                                                            padding: '4px',
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                    ) : (
                                        <AutoStoriesOutlinedIcon sx={{ fontSize: '4rem', width: '4rem', height: '4rem' }} />
                                    )}
                                </Box>

                                <ImageCropModal
                                    isOpen={isCropModalOpen}
                                    onClose={() => setIsCropModalOpen(false)}
                                    imageSrc={cropImageSrc}
                                    onCropComplete={handleCropComplete}
                                />



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



                <Box
                    component="form"
                    gap={1}
                    overflow='scroll'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: { xs: '100%', md: '37%' },
                        backgroundColor: '#d8d8d8',
                        height: { xs: 'auto', md: '100%' },
                        padding: { xs: '1rem', md: '1rem' },
                    }}
                >
                    {showEmojiPicker && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '75%',
                                top: '40%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                                boxShadow: '0px 4px 8px rgba(2, 0.6, 0.5, 0.5)',
                                borderRadius: '8px',
                            }}
                        >
                            <Picker
                                width={300}
                                onEmojiClick={handleEmojiClick}
                            />
                        </Box>
                    )}

                    {showHashtagGenerator ? (
                        <HashtagGenerator onClose={closeHashtagGenerator} onHashtagSelect={handleHashtagSelect} />
                    ) : (
                        <>
                            {selectedToggle === 'Initial content' && (
                                <>
                                    <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem' }}>
                                        <Skeleton variant="rectangular" animation='wave' sx={{ borderRadius: '3px', width: '1rem', height: '1rem' }} />
                                        <Skeleton animation='wave' width='4rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                    </Stack>

                                    <Stack gap='3px' sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', p: 1 }}>
                                        <Stack direction='row' gap={1} sx={{ alignItems: 'center' }}>
                                            <Skeleton variant='rectangular' animation='wave' sx={{ borderRadius: '5px', width: '2rem', height: '2rem' }}>
                                                <Avatar />
                                            </Skeleton>
                                            <Typography>
                                                <Skeleton animation='wave' width='6rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                                            </Typography>
                                        </Stack>

                                        <Box sx={{ width: '100%', overflow: 'hidden' }}>
                                            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 'small' }}>
                                                {initialContent}
                                            </Typography>
                                        </Box>

                                        <Stack>
                                            {selectedLibraryImage && (
                                                <img
                                                    src={selectedLibraryImage.src}
                                                    alt={selectedLibraryImage.alt}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            )}
                                            {selectedLocalImage && (
                                                <img
                                                    src={URL.createObjectURL(selectedLocalImage)}
                                                    alt="Uploaded"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            )}
                                        </Stack>

                                        <Stack direction='row' gap={1} sx={{ alignItems: 'center', mt: '1rem' }}>
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
                                    text={text.facebook}
                                    account={userSocialAccounts.find(account => account.provider === 'facebook')}
                                    selectedLocalImage={selectedLocalImage}
                                    selectedLibraryImage={selectedLibraryImage}
                                    shortenedLinks={shortenedLinks}
                                />
                            )}
                            {selectedToggle === 'linkedin' && (
                                <LinkedInPreview
                                    text={text.linkedin}
                                    account={userSocialAccounts.find(account => account.provider === 'linkedin')}
                                    selectedLocalImage={selectedLocalImage}
                                    selectedLibraryImage={selectedLibraryImage}
                                    shortenedLinks={shortenedLinks}
                                />
                            )}
                            {selectedToggle === 'twitter' && (
                                <XPreview
                                    text={text.twitter}
                                    account={userSocialAccounts.find(account => account.provider === 'twitter')}
                                    selectedLocalImage={selectedLocalImage}
                                    selectedLibraryImage={selectedLibraryImage}
                                    shortenedLinks={shortenedLinks}
                                />
                            )}
                            {selectedToggle === 'instagram' && (
                                <InstagramPreview
                                    text={text.instagram}
                                    account={userSocialAccounts.find(account => account.provider === 'instagram')}
                                    selectedLocalImage={selectedLocalImage}
                                    selectedLibraryImage={selectedLibraryImage}
                                    shortenedLinks={shortenedLinks}
                                />
                            )}

                            <Typography sx={{ fontSize: 'small', textAlign: 'center', fontWeight: '100', color: 'gray', mx: '2rem', mt: 1 }}>
                                Social networks regularly make updates to formatting, so your post may appear slightly different when published.
                            </Typography>
                        </>
                    )}
                </Box>


            </Stack >
            <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />
            <Stack direction='row' display='flex' gap={2} justifyContent='end' sx={{ alignItems: 'center', padding: '13px' }}>
                {isEditing ? (
                    <>
                        <Link
                            sx={{ textDecoration: 'none', cursor: 'pointer', fontWeight: '600', color: '#203170' }}
                            onClick={onClose}
                        >
                            <Box sx={{ p: '8px', borderRadius: '4px', color: '#203170' }}>
                                Cancel
                            </Box>
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
                                    backgroundColor: '#e5a500',
                                },
                            }}
                            onClick={handleEdit}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Link
                            sx={{ textDecoration: 'none', cursor: 'pointer', fontWeight: '600', color: '#203170' }}
                            onClick={() => setSchedulePickerOpen(true)}
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
                                    backgroundColor: '#e5a500',
                                },
                            }}
                            onClick={handleSubmit}
                        >
                            Post now
                        </Button>
                        <SocialPlatformUploader
                            open={uploading}
                            handleClose={() => {
                                setUpLoading(false);
                                setPostSuccessModal(false);
                                window.location.reload();
                            }}
                            selectedPlatforms={selectedOptions}
                            scheduledTime={scheduledTime}
                        />
                    </>

                )}
            </Stack>


            <SchedulePicker
                open={schedulePickerOpen}
                onClose={() => setSchedulePickerOpen(false)}
                onSchedule={handleSchedule}
            />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box >
    );
};

export default CreatePost;
