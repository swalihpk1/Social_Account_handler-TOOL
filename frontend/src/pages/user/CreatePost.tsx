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



const CreatePost: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedToggle, setSelectedToggle] = useState<string | null>('Initial content');
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);

    useEffect(() => {
        console.log("Component Mounted");
        console.log("sadfasdfasd");
        console.log("asdfasdf", userInfo);
    }, []);

    const userSocialAccounts = Object.entries(userInfo?.socialAccounts || {}).map(([provider, { profileName, profilePicture }]) => ({
        provider,
        name: profileName,
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
                    width: { xs: '100%', md: '65%' }
                }}>
                    <Stack>
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
                                                        backgroundColor: '#e0f7fa',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                                        <Avatar alt={option.name} src={option.profilePicture} sx={{ width: 24, height: 24 }} />
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
                                                    {option.name}
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
                                            <Avatar src={option.profilePicture} alt={option.name} sx={{ width: 35, height: 35, borderRadius: '20px' }} />
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
                                        <Typography>{option.name}</Typography>
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
                                <ToggleButton disabled={selectedToggle === 'Initial content'} value="Initial content">
                                    Initial Content
                                </ToggleButton>
                                {userSocialAccounts.map((account) => (
                                    <ToggleButton key={account.provider} disabled={selectedToggle === account.provider} value={account.provider}>
                                        {normalProviderIcons[account.provider]}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                        </ThemeProvider>
                        <Box
                            sx={{
                                border: isFocused ? '1px solid black' : '1px solid #c5c5c5',
                                height: { xs: 'auto', md: '93.5%' },
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
                                
                                onChange={(e) => setText(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        padding: 0,
                                        border: 'none',
                                        letterSpacing:'.5px',
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
                                <Box display='flex' sx={{ justifyContent: 'space-between' }} >
                                    <Typography sx={{ color: 'grey' }} >0</Typography>
                                    <Stack direction="row" spacing={1} marginBottom='.5rem'>
                                        <EmojiEmotionsOutlinedIcon
                                            sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey', cursor: 'pointer' }}
                                            onClick={toggleEmojiPicker}
                                        />
                                        <TagOutlinedIcon sx={{ background: 'lightgrey', borderRadius: '15px', padding: '2px', color: 'grey' }} />
                                    </Stack>

                                </Box>
                                <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />

                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: '1rem',
                                marginTop: '1rem',
                                width: '40%',
                                color: '#cecece'
                            }}>
                                <Box sx={{
                                    border: '2px dashed #cecece',
                                    width: { xs: '100%', sm: '50%' },
                                    height: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <AddPhotoAlternateIcon sx={{ fontSize: '4rem', width: '4rem', height: '4rem' }} />
                                </Box>
                                <Box sx={{
                                    border: '2px dashed #cecece',
                                    width: { xs: '100%', sm: '50%' },
                                    height: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <AutoStoriesOutlinedIcon sx={{ fontSize: '4rem', width: '4rem', height: '4rem' }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box component="form" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: { xs: '100%', md: '35%' },
                    backgroundColor: '#d8d8d8',
                    height: { xs: 'auto', md: '100%' },
                    padding: { xs: '1rem', md: 0 }
                }}>

                    {showEmojiPicker &&
                        <Box position='absolute' left='67%' top='29%' transform='translate(-50%, -50%)'>
                            <Picker
                                skinTonePickerLocation='false'
                                width='300'
                                onEmojiClick={handleEmojiClick}
                            />
                        </Box>
                    }

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
        </Box>
    );
};

export default CreatePost;
