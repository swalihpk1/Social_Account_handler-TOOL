
import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faRepeat as faSolidRepeat } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FacebookPreviewProps } from '../../types/Types';
import ReplaceLinksAndHashtags from '../../components/ReplaceLinkAndHashtags';
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import { faCommentDots as faRegularCommentDots } from '@fortawesome/free-regular-svg-icons';

const LinkedInPreview: React.FC<FacebookPreviewProps> = ({ text, facebookAccount, selectedLocalImage, selectedLibraryImage, shortenedLinks }) => {
    return (
        <>
            <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem', alignItems: 'center' }}>
                <FacebookRoundedIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#1877F2' }} />
                <h3>Facebook</h3>
            </Stack>

            <Stack sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', pt: 1 }}>
                <Stack direction='row' sx={{ px: 1, display: 'flex', justifyContent: 'space-between' }}>

                    <Stack direction='row'>
                        <Stack direction='row' gap={0.5} sx={{ alignItems: 'center' }}>
                            <Avatar alt={facebookAccount.name} src={facebookAccount.profilePicture} sx={{ width: 33, height: 33 }} />
                            <Stack>
                                <Typography sx={{ fontSize: 'small' }}>
                                    {facebookAccount.name} <span style={{ color: 'grey' }}>&bull;  1st</span>
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
                        <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 'small' }}>
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
                <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRegularThumbsUp} style={{ fontSize: '1rem', color: 'grey', transform: 'scaleX(-1)' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary">Like</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRegularCommentDots} style={{ fontSize: '1rem', color: 'grey' }} />
                        <Typography variant="body2" fontSize='x-small' color="textSecondary" sx={{ marginLeft: '0' }}>Comment</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faSolidRepeat} style={{ fontSize: '1rem', color: 'grey' }} />
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
