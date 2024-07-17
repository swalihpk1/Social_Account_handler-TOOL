import { Stack, Box, Skeleton, Typography, Avatar } from '@mui/material';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';
import { SocialPreviewProps } from '../../types/Types';
import ReplaceLinksAndHashtags from '../../components/ReplaceLinkAndHashtags';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import BookmarkBorderTwoToneIcon from '@mui/icons-material/BookmarkBorderTwoTone';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import X from '@mui/icons-material/X';

const XPreview: React.FC<SocialPreviewProps> = ({ text, account, selectedLocalImage, selectedLibraryImage, shortenedLinks }) => {
    return (
        <>
            <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem', alignItems: 'center' }}>
                <X sx={{ fontSize: { xs: '24px', sm: '30px' }, color: 'black' }} />
                <Typography variant="h6" component="h3">TwitterX</Typography>
            </Stack>

            <Stack sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', pt: 1 }}>
                <Stack direction='row' sx={{ px: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction='row'>
                        <Stack direction='row' gap={0.5} sx={{ alignItems: 'center' }}>
                            <Avatar alt={account.profileName} src={account.profilePicture} sx={{ width: 33, height: 33 }} />
                            <Stack>
                                <Typography sx={{ fontSize: 'small' }}>
                                    {account.profileName} <span style={{ color: 'grey', fontSize: 'x-small' }}>@username &bull; just now</span>
                                </Typography>

                            </Stack>
                        </Stack>
                    </Stack>

                    <Typography>...</Typography>
                </Stack>

                {!text ? (
                    <Box sx={{ px: 5 }}>
                        <Typography>
                            <Skeleton animation='wave' sx={{ borderRadius: '7px', height: '1rem' }} />
                        </Typography>
                        <Typography>
                            <Skeleton animation='wave' width='6rem' sx={{ borderRadius: '7px', height: '1rem' }} />
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', overflow: 'hidden', px: 5, mb: '2px' }}>
                        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', fontSize: 'small' }}>
                            {ReplaceLinksAndHashtags(text, shortenedLinks)}
                        </Typography>
                    </Box>
                )}
                <Stack sx={{ px: 5, }}>
                    {selectedLibraryImage && (
                        <Box component="img"
                            src={selectedLibraryImage.src}
                            alt={selectedLibraryImage.alt}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                        />
                    )}

                    {selectedLocalImage && (
                        <Box component="img"
                            src={URL.createObjectURL(selectedLocalImage)}
                            alt="Uploaded"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                        />
                    )}
                </Stack>


                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '10px 25px' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faComment} style={{ fontSize: '1rem', color: 'grey' }} />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faRetweet} style={{ fontSize: '1rem', color: 'grey' }} />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faHeart} style={{ fontSize: '1rem', color: 'grey' }} />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <BarChartTwoToneIcon style={{ fontSize: '1rem', color: 'grey' }} />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <BookmarkBorderTwoToneIcon style={{ fontSize: '1.3rem', color: 'grey' }} />
                        <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ fontSize: '1rem', color: 'grey' }} />
                    </Stack>
                </Stack>
            </Stack >
        </>
    );
};

export default XPreview;
