import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledListItemProps } from '../../../types/Types';

const StyledListItem: React.FC<StyledListItemProps> = ({ icon, text, open, to, iconStyles, size, onClick }) => {
    const sizeStyles = size === 'small'
        ? { fontSize: '0.8rem', height: '50px' }
        : size === 'large'
            ? { fontSize: '1.2rem', height: '60px' }
            : {};

    const iconSizeStyles = size === 'small'
        ? { width: '30px', height: '30px' }
        : size === 'large'
            ? { width: '50px', height: '50px' }
            : { width: '40px', height: '40px' };

    return (
        <ListItem
            button
            component={Link}
            to={to}
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center the content
                gap: 2,
                paddingLeft: 2,
                ...sizeStyles, // Apply size styles to ListItem
            }}
        >
            <ListItemIcon
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // Center the icon
                    borderRadius: '50%',
                    backgroundColor: '#203170',
                    minWidth: "30px",
                    ...iconSizeStyles,
                    ...iconStyles,
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 30, color: 'white' } })}
            </ListItemIcon>
            {open && (
                <ListItemText
                    primary={text}
                    sx={{ color: 'white' }}
                />
            )}
        </ListItem>
    );
};

export default StyledListItem;
