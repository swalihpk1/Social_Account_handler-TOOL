import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';
import { Instagram } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import BookmarkBorderTwoToneIcon from '@mui/icons-material/BookmarkBorderTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import React from 'react';
import { SocialPreviewProps } from '../../types/Types';
import ReplaceLinksAndHashtags from '../../components/ReplaceLinkAndHashtags';

const InstagramPreview: React.FC<SocialPreviewProps> = ({ text, account, selectedLocalImage, selectedLibraryImage, shortenedLinks }) => {
    return (
        <>
            <Stack direction='row' gap='.5rem' sx={{ mt: '2rem', mx: '1.5rem', mb: '.5rem', alignItems: 'center' }}>
                <Instagram sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#E1306C' }} />
                <Typography variant="h6" component="h3">Instagram</Typography>
            </Stack>

            <Stack sx={{ background: 'white', mx: '1.5rem', borderRadius: '6px', pt: 1 }}>
                <Stack direction='row' sx={{ px: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction='row' gap={1} sx={{ alignItems: 'center' }}>
                        <Avatar alt={account.profileName} src={account.profilePicture} sx={{ width: 33, height: 33 }} />
                        <Stack>
                            <Typography sx={{ fontSize: { xs: 'small', sm: 'medium' } }}>{account.profileName}</Typography>
                        </Stack>
                    </Stack>
                    <MoreVertTwoToneIcon sx={{ color: 'grey', fontSize: { xs: '15px', sm: '20px' } }} />
                </Stack>
                <Stack sx={{ pt: 1 }}>
                    {selectedLibraryImage && (
                        <img
                            src={selectedLibraryImage.src}
                            alt={selectedLibraryImage.alt}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    )}

                    {selectedLocalImage && (
                        <img
                            src={URL.createObjectURL(selectedLocalImage)}
                            alt="Uploaded"
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    )}
                </Stack>

                {(selectedLibraryImage || selectedLocalImage) && (
                    <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px' }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faHeart} style={{ fontSize: '1.5rem', color: 'grey' }} />
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                style={{ width: '20px', height: '20px', fill: 'grey' }}
                            >
                                <path d="M61.44,0a61.46,61.46,0,0,1,54.91,89l6.44,25.74a5.83,5.83,0,0,1-7.25,7L91.62,115A61.43,61.43,0,1,1,61.44,0ZM96.63,26.25a49.78,49.78,0,1,0-9,77.52A5.83,5.83,0,0,1,92.4,103L109,107.77l-4.5-18a5.86,5.86,0,0,1,.51-4.34,49.06,49.06,0,0,0,4.62-11.58,50,50,0,0,0-13-47.62Z" />
                            </svg>
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                style={{ width: '20px', height: '20px', fill: 'grey' }}
                            >
                                <path d="M96.14,12.47l-76.71-1.1,28.3,27.85L96.14,12.47ZM53.27,49l9.88,39.17L102.1,22,53.27,49ZM117,1.6a5.59,5.59,0,0,1,4.9,8.75L66.06,105.21a5.6,5.6,0,0,1-10.44-1.15L41.74,49,1.67,9.57A5.59,5.59,0,0,1,5.65,0L117,1.6Z" />
                            </svg>
                        </Stack>
                        <BookmarkBorderTwoToneIcon style={{ fontSize: '1.5rem', color: 'grey' }} />
                    </Stack>
                )}

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
                        <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', fontSize: { sm: 'small' } }}>
                            {ReplaceLinksAndHashtags(text, shortenedLinks)}
                        </Typography>
                    </Box>
                )}
                {(!selectedLibraryImage && !selectedLocalImage) && (
                    <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px' }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faHeart} style={{ fontSize: '1.5rem', color: 'grey' }} />
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                style={{ width: '20px', height: '20px', fill: 'grey' }}
                            >
                                <path d="M61.44,0a61.46,61.46,0,0,1,54.91,89l6.44,25.74a5.83,5.83,0,0,1-7.25,7L91.62,115A61.43,61.43,0,1,1,61.44,0ZM96.63,26.25a49.78,49.78,0,1,0-9,77.52A5.83,5.83,0,0,1,92.4,103L109,107.77l-4.5-18a5.86,5.86,0,0,1,.51-4.34,49.06,49.06,0,0,0,4.62-11.58,50,50,0,0,0-13-47.62Z" />
                            </svg>
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                style={{ width: '20px', height: '20px', fill: 'grey' }}
                            >
                                <path d="M96.14,12.47l-76.71-1.1,28.3,27.85L96.14,12.47ZM53.27,49l9.88,39.17L102.1,22,53.27,49ZM117,1.6a5.59,5.59,0,0,1,4.9,8.75L66.06,105.21a5.6,5.6,0,0,1-10.44-1.15L41.74,49,1.67,9.57A5.59,5.59,0,0,1,5.65,0L117,1.6Z" />
                            </svg>
                        </Stack>
                        <BookmarkBorderTwoToneIcon style={{ fontSize: '1.5rem', color: 'grey' }} />
                    </Stack>
                )}


            </Stack >
        </>
    );
};

export default InstagramPreview;
