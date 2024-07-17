
import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { SocialPreviewProps } from '../../types/Types';
import ReplaceLinksAndHashtags from '../../components/ReplaceLinkAndHashtags';

const FacebookPreview: React.FC<SocialPreviewProps> = ({ text, account, selectedLocalImage, selectedLibraryImage, shortenedLinks }) => {
    return (
        <>
            <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem', alignItems: 'center' }}>
                <FacebookRoundedIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#1877F2' }} />
                <Typography variant="h6" component="h3">Facebook</Typography>
            </Stack>

            <Stack sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', pt: 1 }}>
                <Stack direction='row' sx={{ px: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction='row' gap={.5} sx={{ alignItems: 'center' }} >
                        <Avatar alt={account.profileName} src={account.profilePicture} sx={{ width: 33, height: 33 }} />
                        <Stack>
                            <Typography sx={{ fontSize: 'small' }}>{account.profileName}</Typography>
                            <Typography fontSize='xx-small' lineHeight='.5' color='grey'>Just now</Typography>
                        </Stack>
                    </Stack>
                    <Typography>...</Typography>
                </Stack>

                {!text ? (
                    <Box sx={{ px: 1 }}>
                        <Typography>
                            <Skeleton animation='wave' sx={{ borderRadius: '7px', height: '1rem' }} />
                        </Typography>
                        <Typography>
                            <Skeleton animation='wave' width='6rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', overflow: 'hidden', px: 1, mb: '2px' }}>
                            <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', fontSize: 'small' }}>
                            {ReplaceLinksAndHashtags(text, shortenedLinks)}
                        </Typography>
                    </Box>
                )}
                <Stack>
                    {selectedLibraryImage && (
                        <img
                            src={selectedLibraryImage.src}
                            alt={selectedLibraryImage.alt}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}

                    {selectedLocalImage && (
                        <img
                            src={URL.createObjectURL(selectedLocalImage)}
                            alt="Uploaded"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                </Stack>

                <Divider />
                <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-evenly', padding: '10px 0' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRegularThumbsUp} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" color="textSecondary">Like</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faMessage} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '0' }}>Comment</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faShare} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" color="textSecondary">Share</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};

export default FacebookPreview;
