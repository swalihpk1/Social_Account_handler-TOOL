import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { SocialPreviewProps } from '../../types/Types';
import ReplaceLinksAndHashtags from '../../components/ReplaceLinkAndHashtags';
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import { faCommentDots as faRegularCommentDots } from '@fortawesome/free-regular-svg-icons';

const LinkedInPreview: React.FC<SocialPreviewProps> = ({ text, account, selectedLocalImage, selectedLibraryImage, shortenedLinks }) => {
    return (
        <>
            <Stack direction='row' gap='.5rem' sx={{ mt: { xs: '1rem', sm: '2rem' }, mx: '1.5rem', mb: '.5rem', alignItems: 'center' }}>
                <LinkedIn sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#004fb5' }} />
                <Typography variant="h6" component="h3">LinkedIn</Typography>
            </Stack>

            <Stack sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', pt: 1 }}>
                <Stack direction='row' sx={{ px: 1, display: 'flex', justifyContent: 'space-between' }}>

                    <Stack direction='row'>
                        <Stack direction='row' gap={0.5} sx={{ alignItems: 'center' }}>
                            <Avatar alt={account.profileName} src={account.profilePicture} sx={{ width: 33, height: 33 }} />
                            <Stack>
                                <Typography sx={{ fontSize: 'small' }}>
                                    {account.profileName} <span style={{ color: 'grey' }}>&bull;  1st</span>
                                </Typography>
                                <Typography fontSize='xx-small' color='grey' sx={{ display: 'flex', alignItems: 'center' }}>
                                    just now &bull; <PublicTwoToneIcon sx={{ fontSize: '.7rem', marginLeft: '0.2rem' }} />
                                </Typography>
                            </Stack>
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
                        <Box component="img"
                            src={selectedLibraryImage.src}
                            alt={selectedLibraryImage.alt}
                            sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    )}

                    {selectedLocalImage && (
                        <Box component="img"
                            src={URL.createObjectURL(selectedLocalImage)}
                            alt="Uploaded"
                            sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    )}
                </Stack>

                <Divider />
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRegularThumbsUp} style={{ fontSize: '1rem', color: 'grey', transform: 'scaleX(-1)' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary">Like</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRegularCommentDots} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary" sx={{ marginLeft: '0' }}>Comment</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRetweet} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary" sx={{ marginLeft: '0' }}>Repost</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faShare} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary">Share</Typography>
                    </Stack>
                </Stack>
            </Stack >
        </>
    );
};

export default LinkedInPreview;
