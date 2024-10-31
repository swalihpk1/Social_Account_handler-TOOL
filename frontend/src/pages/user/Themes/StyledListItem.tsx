import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledListItemProps } from '../../../types/Types';

const StyledListItem: React.FC<StyledListItemProps & { selected?: boolean }> = ({
    icon,
    text,
    open,
    to,
    iconStyles,
    size,
    onClick,
    selected, // new prop
}) => {
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
                justifyContent: 'center',
                gap: 2,
                paddingLeft: 2,
                backgroundColor: selected ? '#5A6FB2' : 'inherit',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                '&:hover': {
                    backgroundColor: '#5A6FB2',
                    transform: 'translateX(6px)',
                    '& .MuiListItemIcon-root': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 20px rgba(90, 111, 178, 0.6)',
                    },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '3px',
                    backgroundColor: selected ? '#FFD700' : 'transparent',
                    transition: 'all 0.3s ease-in-out',
                },
                ...sizeStyles,
            }}
        >
            <ListItemIcon
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: selected ? '#ccac00' : '#203170',
                    minWidth: "30px",
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: selected
                        ? '0 0 20px rgba(255, 215, 0, 0.5)'
                        : '0 0 10px rgba(32, 49, 112, 0.3)',
                    ...iconSizeStyles,
                    ...iconStyles,
                }}
            >
                {React.cloneElement(icon, {
                    sx: {
                        fontSize: 30,
                        color: selected ? '#203170' : 'white',
                        transition: 'all 0.3s ease-in-out',
                    }
                })}
            </ListItemIcon>
            {open && (
                <ListItemText
                    primary={text}
                    sx={{
                        color: 'white',
                        '& .MuiListItemText-primary': {
                            transition: 'all 0.3s ease-in-out',
                            fontWeight: selected ? 600 : 400,
                        }
                    }}
                />
            )}
        </ListItem>
    );
};

export default StyledListItem;
