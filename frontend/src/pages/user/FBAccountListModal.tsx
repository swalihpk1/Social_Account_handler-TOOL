import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox } from '@mui/material';

const FBAccountListModal = ({ open, onClose, pages, onConfirm }) => {
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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Facebook Pages</DialogTitle>
            <DialogContent>
                <List>
                    {pages.map((page, index) => (
                        <ListItem key={index} button onClick={() => handleToggle(page)}>
                            <ListItemAvatar>
                                <Avatar src={page.pageImage} />
                            </ListItemAvatar>
                            <ListItemText primary={page.pageName} />
                            <Checkbox
                                edge="end"
                                checked={selectedPages.indexOf(page) !== -1}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FBAccountListModal;
