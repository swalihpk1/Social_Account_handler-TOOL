import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface StyledListItemProps {
    icon: React.ReactElement;
    text: string;
    open: boolean;
    to: string;
    iconStyles?: React.CSSProperties;
}

const StyledListItem: React.FC<StyledListItemProps> = ({ icon, text, open, to, iconStyles }) => (
    <ListItem
        button
        component={Link}
        to={to}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 2,
            paddingLeft: 2,
        }}
    >
        <ListItemIcon
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#203170',
                minWidth: "30px",
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

export default StyledListItem;
