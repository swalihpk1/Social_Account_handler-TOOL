import { useState, useEffect } from 'react';
import { Stack, TextField, Typography, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { useFetchHashtagsQuery } from '../api/ApiSlice';
import SearchLoaidng from './LoadingAnimation/LoadingIcon';

const HashtagGenerator = () => {
    const [keyword, setKeyword] = useState('');
    const { data, error, isLoading } = useFetchHashtagsQuery(keyword, {
        skip: keyword === '',
    });

    useEffect(() => {

    }, [keyword]);

    return (
        <Stack gap="3px" sx={{ background: 'white', p: 2, borderRadius: 1, boxShadow: '0px 4px 8px rgba(0.3, 0.6, 0.5, 0.2)' }}>
            <Typography variant='overline' color='#203170' textAlign='center' paddingBottom='.5rem'>
                Generate hashtags
            </Typography>

            <TextField
                placeholder="Enter hashtag keyword"
                variant="filled"
                color="primary"
                sx={{ flex: 1 }}
                value={keyword}
                fullWidth
                focused
                onChange={(e) => setKeyword(e.target.value)}
            />

            <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                {isLoading && (
                    <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
                        <SearchLoaidng height={50} width={50} />
                    </Stack>
                )}
                {error && <Typography>Error: {error.message}</Typography>}
                {data && data.map((hashtag: string) => (
                    <FormControlLabel
                        key={hashtag}
                        control={<Checkbox sx={{ color: '#233170', '&.Mui-checked': { color: '#233170' } }} />}
                        label={<Typography color='#575757'>#{hashtag}</Typography>}
                    />
                ))}
            </Stack>
        </Stack>
    );
};

export default HashtagGenerator;
