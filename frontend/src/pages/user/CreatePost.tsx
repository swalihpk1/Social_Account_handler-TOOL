import React, { useState } from 'react';
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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

const options = [
    { value: 'facebook', label: 'Abc academy', img: 'facebook.png' },
    { value: 'instagram', label: 'Swax_xc__', img: 'instagram.png' },
    { value: 'twitter', label: 'Twitter', img: 'twitter.png' },
];

const CreatePost: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedOptions(event.target.value as string[]);
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '8px', boxShadow: 0.5, height: '91vh', margin: '2rem' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold', padding: '1rem', paddingLeft: '1.5rem', color: '#343434' }}>
                New Post
            </Typography>
            <Divider style={{ height: '2.5px', backgroundColor: '#e5e5e5' }} />
            <Stack sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', width: '65%' }}>
                    <Stack>
                        <Typography>
                            Publish to
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            SelectProps={{
                                multiple: true,
                                value: selectedOptions,
                                onChange: handleChange,
                                renderValue: (selected) => {
                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => {
                                                const option = options.find(option => option.value === value);
                                                return option ? (
                                                    <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Avatar alt={option.label} src={option.img} sx={{ width: 24, height: 24 }} />
                                                        {option.label}
                                                    </Box>
                                                ) : null;
                                            })}
                                        </Box>
                                    );
                                },
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxWidth: '715px',
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
                                    <ListItemText primary={`Accounts (${options.length})`} primaryTypographyProps={{ fontWeight: 'bold' }} />
                                </ListItem>
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Stack direction="row" alignItems="center" gap="0.5rem">
                                        <Checkbox checked={selectedOptions.includes(option.value)} />
                                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                            <AccountCircleIcon sx={{ color: 'grey', fontSize: '35px', background: 'white', width: '35px', height: '35px', borderRadius: '10px' }} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    right: -2,
                                                    bottom: -5,
                                                    padding: '0',
                                                }}
                                            >
                                                <FacebookRoundedIcon sx={{ fontSize: '13px', background: 'white', borderRadius: '10px' }} />
                                            </Box>
                                        </Box>
                                        <Typography>{option.label}</Typography>
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
                    <TextField
                        label="Content"
                        multiline
                        rows={4}
                        placeholder="Enter your text and links"
                        fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="contained" component="label">
                            Upload Image
                            <input type="file" hidden />
                        </Button>
                        <Button variant="contained" component="label">
                            Upload Document
                            <input type="file" hidden />
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <Button variant="outlined">Schedule for later</Button>
                        <Button variant="contained" color="primary">Post now</Button>
                    </Box>
                </Box>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: '35%', backgroundColor: '#d8d8d8' }}>
                    asd
                </Box>
            </Stack>
        </Box>
    );
};

export default CreatePost;
