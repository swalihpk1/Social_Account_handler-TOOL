import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreateIcon from '@mui/icons-material/Create';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const sidebarOptions = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { name: 'Planner', icon: <CalendarTodayIcon />, path: '/planner' },
        { name: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
        { name: 'Create Post', icon: <CreateIcon />, path: '/create' },
    ];

    const filteredOptions = sidebarOptions.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (path: string) => {
        navigate(path);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                label="Search options"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <List>
                {filteredOptions.map((option, index) => (
                    <ListItem 
                        key={index} 
                        button 
                        onClick={() => handleOptionClick(option.path)}
                        sx={{ 
                            '&:hover': { 
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemIcon>{option.icon}</ListItemIcon>
                        <ListItemText primary={option.name} />
                    </ListItem>
                ))}
            </List>
            {searchTerm && filteredOptions.length === 0 && (
                <Typography>No options found</Typography>
            )}
        </Box>
    );
};

export default Search;