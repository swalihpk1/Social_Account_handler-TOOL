import { useState, useEffect, useRef } from 'react';
import { Stack, TextField, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchHashtagsQuery } from '../api/ApiSlice';
import SearchLoading from './LoadingAnimation/SearchLoading';

const HashtagGenerator = ({ onClose, onHashtagSelect }) => {
    const [keyword, setKeyword] = useState('');
    const { data, error, isLoading } = useFetchHashtagsQuery(keyword, {
        skip: keyword === '',
    }) as { data: string[] | undefined, error: any, isLoading: boolean };

    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleHashtagChange = (hashtag: string) => {
        onHashtagSelect(hashtag);
    };

    return (
        <Stack
            ref={containerRef}
            gap="3px"
            sx={{
                background: 'white',
                p: 2,
                borderRadius: 1,
                boxShadow: '0px 4px 8px rgba(0.3, 0.6, 0.5, 0.2)',
                position: 'relative',
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'gray',
                }}
            >
                <CloseIcon />
            </IconButton>

            <Typography variant='overline' color='#203170' textAlign='center' paddingBottom='.5rem'>
                Generate hashtags
            </Typography>

            <TextField
                placeholder="Enter keyword"
                variant="filled"
                color="primary"
                sx={{ flex: 1 }}
                value={keyword}
                fullWidth
                onChange={(e) => setKeyword(e.target.value)}
            />

            <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                {isLoading && (
                    <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
                        <SearchLoading height={50} width={50} />
                    </Stack>
                )}
                {error && <Typography>Error: {error.message}</Typography>}
                {keyword && !isLoading && !error && (!data || data.length === 0) && (
                    <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
                        <img src="/nodata.gif" alt="No data" style={{ width: '230px', height: '160px' }} />
                    </Stack>
                )}
                {data && data.map((hashtag: string) => (
                    <FormControlLabel
                        key={hashtag}
                        control={<Checkbox
                            sx={{ color: '#233170', '&.Mui-checked': { color: '#233170' } }}
                            onChange={() => handleHashtagChange(hashtag)}
                        />}
                        label={<Typography color='#575757'>#{hashtag}</Typography>}
                    />
                ))}
            </Stack>
        </Stack>
    );
};

export default HashtagGenerator;
