import { Box, Fade, Modal, TextField, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

const SearchModal: React.FC<{ open: boolean; onClose: () => void; sidebarOptions: Array<{ name: string; icon: JSX.Element; action: () => void }> }> = ({ open, onClose, sidebarOptions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        if (open) {
            setSearchQuery('');
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 50);
        }
    }, [open]);

    const filteredOptions = sidebarOptions.filter(option =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOptionClick = (action: () => void) => {
        action(); // Perform the option's action
        onClose(); // Close the modal
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '6rem',
                        left: '3rem',
                        width: '80%',
                        maxWidth: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 1,
                        borderRadius: 1,
                        mt: 2,
                        ml: 2,
                    }}
                >
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        variant="standard"
                        sx={{
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' },
                            '& .MuiInputBase-input': { fontSize: '1.1rem' },
                        }}
                    />

                    {searchQuery && filteredOptions.length > 0 && (
                        <List>
                            {filteredOptions.map((option, index) => (
                                <ListItem button key={index} onClick={() => handleOptionClick(option.action)}>
                                    <ListItemIcon sx={{ minWidth: 40, color: '#3771C8' }}>
                                        {option.icon}
                                    </ListItemIcon>
                                    <ListItemText sx={{ color: '#004fb4' }} primary={option.name} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
};

export default SearchModal;
