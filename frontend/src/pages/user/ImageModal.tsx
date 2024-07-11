import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Button } from '@mui/material';
import SearchIcon from '../../components/icons/SearchIcon';

const API_KEY = 'gGhCpc4Oii68YIPLkPajRFjpOKzAM5uNjqntbgmnmX84K27bXq3XSkVR';

const ImageModal: React.FC<any> = ({ onSelectImage }) => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchImages('random');
    }, []);

    const fetchImages = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://api.pexels.com/v1/search', {
                headers: {
                    Authorization: API_KEY
                },
                params: {
                    query: searchQuery,
                    per_page: 15
                }
            });
            setImages(response.data.photos);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (event: any) => {
        setQuery(event.target.value);
    };

    const handleSearchSubmit = (event: any) => {
        event.preventDefault();
        fetchImages(query);
    };

    return (
        <Box sx={{ position: 'relative' }}>

            <form onSubmit={handleSearchSubmit}>
                <Box display='flex' gap={1} sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }} >
                    <TextField
                        variant="outlined"
                        placeholder="Search for images"
                        value={query}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '.5rem',
                            borderRadius: '5rem'
                        }}
                        type='submit'
                        onSubmit={handleSearchSubmit}
                    >
                        <SearchIcon />
                    </Button>

                </Box>
            </form>
            {/* <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    alignItems: 'center',
                    top: '-30px',
                    background: ' #9b9b9b',
                    right: '-37px',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#adadad'
                    }
                }}
            >
                <CloseIcon />
            </IconButton> */}

            <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3, lg: 4 }, columnGap: '4px' }}>
                {isLoading ? (
                    <Box sx={{ textAlign: 'center' }}>Loading...</Box>
                ) : (
                    images.map((image: any) => (
                        <Box
                            key={image.id}
                            sx={{
                                breakInside: 'avoid',
                                marginBottom: '4px'
                            }}
                            onClick={() => onSelectImage(image)}
                        >
                            <img
                                src={image.src.medium}
                                alt={image.alt}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </Box>
                    ))
                )}
            </Box>

        </Box>
    );
};

export default ImageModal;
