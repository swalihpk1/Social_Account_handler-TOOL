import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CssBaseline, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Button, IconButton, Select, MenuItem, FormControl, Divider, DialogContentText, Alert, TextField } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFetchPostsQuery, useReschedulePostMutation, useDeleteShedulePostMutation } from '../../api/ApiSlice';
import XIcon from '@mui/icons-material/X';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FacebookPreview from './FacebookPreview';
import LinkedInPreview from './LinkedInPreview';
import XPreview from './XPreview';
import InstagramPreview from './InstagramPreview';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Snackbar, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreatePost from './CreatePost';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  // Using AdapterDateFns
import { Global } from '@emotion/react';
import { plannerStyles } from './Styles';
import { SocialPreviewProps } from '../../types/Types';

const Planner = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarApi, setCalendarApi] = useState(null);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [rescheduleInfo, setRescheduleInfo] = useState(null);
    const [draggingEvent, setDraggingEvent] = useState(null);
    const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const calendarRef = useRef(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [platformFilter, setPlatformFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data } = useFetchPostsQuery(undefined);
    const [reschedulePost] = useReschedulePostMutation();
    const [deleteSchedulePost] = useDeleteShedulePostMutation();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);

    const userSocialAccounts = Object.entries(userInfo?.socialAccounts || {}).map(([provider, { profileName, profilePicture, userPages }]) => ({
        provider,
        profileName,
        profilePicture,
        userPages,
    }));

    useEffect(() => {
        if (data) {
            const formattedEvents = data.flatMap((post) => {
                const isScheduled = post.status === 'scheduled';

                const createEvent = (platform, content, timestamp) => ({
                    id: `${post._id}-${platform}`,
                    title: content || 'No content available',
                    start: new Date(timestamp),
                    extendedProps: {
                        imageUrl: post.image,
                        platform: platform,
                        userId: post.userId,
                        status: post.status,
                        ...(isScheduled ? { jobId: post.jobId } : { response: post.platforms.find(p => p.platform === platform)?.response }),
                    },
                });

                if (isScheduled) {
                    return post.platforms.map(platform =>
                        createEvent(platform, post.content[platform], post.scheduledTime)
                    );
                } else {
                    return post.platforms.map(platformObj =>
                        createEvent(platformObj.platform, post.content[platformObj.platform], post.timestamp)
                    );
                }
            });

            console.log("Formatted Events", formattedEvents);

            // Filter events based on the selected platform and status
            const filteredEvents = formattedEvents.filter(event => {
                const platformMatch = !platformFilter || event.extendedProps.platform === platformFilter;
                const statusMatch = !statusFilter || event.extendedProps.status === statusFilter;
                return platformMatch && statusMatch;
            });

            setEvents(filteredEvents);
        }
    }, [data, platformFilter, statusFilter]);

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarApi(calendarRef.current.getApi());
        }
    }, []);

    useEffect(() => {
        if (events) {
            setEvents(events);
        }
    }, [events]);


    useEffect(() => {
        if (calendarApi) {
            setTimeout(() => {
                calendarApi.updateSize();
            }, 650);
        }
    }, [openPreviewDrawer, calendarApi]);

    const handleEdit = () => {
        setOpenEditModal(true);
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
    };

    const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const updateEventsAfterChange = (updatedEvent, action) => {
        console.log("Updating events:", updatedEvent, action);

        setEvents((prevEvents) => {
            if (action === 'edit') {
                const updatedEvents = prevEvents.map(event =>
                    event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
                );

                if (selectedEvent && selectedEvent.id === updatedEvent.id) {
                    setSelectedEvent({ ...selectedEvent, ...updatedEvent });
                }

                return updatedEvents;
            } else if (action === 'delete') {
                return prevEvents.filter(event => event.extendedProps.jobId !== updatedEvent.jobId);
            }
            return prevEvents;
        });
    };


    const handleDelete = async (jobId: string) => {
        try {
            await deleteSchedulePost({ jobId }).unwrap();
            updateEventsAfterChange({ jobId }, 'delete');
            showSnackbar('Post deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting post:', error);
            showSnackbar('Failed to delete post.', 'error');
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleEventClick = (eventInfo) => {
        setSelectedEvent(eventInfo.event);
        setOpenPreviewDrawer(true);
    };

    const handleClosePreviewDrawer = () => {
        setOpenPreviewDrawer(false);
        setSelectedEvent(null);
    };


    const handleEventDragStart = (info) => {
        if (info.event.extendedProps.status === 'posted') {
            return;
        }
        setDraggingEvent(info.event);
    };

    const handleEventDrop = (info) => {

        if (info.event.extendedProps.status === 'posted') {
            info.revert();
            return;
        }

        const jobId = info.event.extendedProps.jobId;
        const reScheduleTime = info.event.start;

        setRescheduleInfo({ jobId, reScheduleTime, originalEvent: draggingEvent });
        setOpenConfirmModal(true);
    };


    const handleConfirmReschedule = () => {
        if (rescheduleInfo) {
            const { jobId, reScheduleTime } = rescheduleInfo;

            reschedulePost({ jobId, reScheduleTime: reScheduleTime.toISOString() })
                .unwrap()
                .then(() => {
                    console.log('Post rescheduled successfully');
                })
                .catch((error) => {
                    console.error('Error rescheduling post:', error);
                    if (calendarApi) {
                        const event = calendarApi.getEventById(rescheduleInfo.originalEvent.id);
                        event.setStart(rescheduleInfo.originalEvent.start);
                    }
                });
        }

        setOpenConfirmModal(false);
        setRescheduleInfo(null);
    };

    const handleCancelReschedule = () => {
        if (calendarApi && rescheduleInfo) {
            const event = calendarApi.getEventById(rescheduleInfo.originalEvent.id);
            event.setStart(rescheduleInfo.originalEvent.start);
        }
        setOpenConfirmModal(false);
        setRescheduleInfo(null);
    };


    const onViewChange = (view) => {
        setCurrentView(view);
        if (calendarApi) {
            calendarApi.changeView(view);
        }
    };

    const handleViewChange = (view) => {
        onViewChange(view);
    };

    const handlePrev = () => {
        if (calendarApi) {
            calendarApi.prev();
            setSelectedDate(calendarApi.getDate());
        }
    };


    const handleNext = () => {
        if (calendarApi) {
            calendarApi.next();
            setSelectedDate(calendarApi.getDate());
        }
    };

    const handleMonthChange = (newMonth) => {
        const newDate = new Date(selectedDate.getFullYear(), newMonth, 1);
        setSelectedDate(newDate);

        if (calendarApi) {
            calendarApi.gotoDate(newDate);
        }
    };

    const handleYearChange = (newYear) => {
        const newDate = new Date(newYear, selectedDate.getMonth(), 1);
        setSelectedDate(newDate);

        if (calendarApi) {
            calendarApi.gotoDate(newDate);
        }
    };

    const onDateChange = (date) => {
        setSelectedDate(date);
        if (calendarApi) {
            calendarApi.gotoDate(date);
            switch (currentView) {
                case 'dayGridMonth':
                    calendarApi.changeView('dayGridMonth', date);
                    break;
                case 'timeGridWeek':
                    calendarApi.changeView('timeGridWeek', date);
                    break;
                case 'timeGridDay':
                    calendarApi.changeView('timeGridDay', date);
                    break;
            }
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderEventPreview = () => {
        if (!selectedEvent) return null;

        console.log('selectedEvent', selectedEvent);

        const account = userSocialAccounts.find(acc => acc.provider === selectedEvent.extendedProps.platform);
        const eventData: SocialPreviewProps = {
            text: selectedEvent.title,
            account: account || {
                provider: selectedEvent.extendedProps.platform,
                profileName: 'User Name',
                profilePicture: ''
            },
            selectedLocalImage: null,
            selectedLibraryImage: selectedEvent.extendedProps.imageUrl
                ? { src: selectedEvent.extendedProps.imageUrl, alt: 'Event Image' }
                : null,
            shortenedLinks: {},
        };

        switch (selectedEvent.extendedProps.platform) {
            case 'facebook':
                return <FacebookPreview {...eventData} />;
            case 'linkedin':
                return <LinkedInPreview {...eventData} />;
            case 'twitter':
                return <XPreview {...eventData} />;
            case 'instagram':
                return <InstagramPreview {...eventData} />;
            default:
                return null;
        }
    };

    const renderEventContent = (eventInfo) => {
        const { event, view } = eventInfo;
        const platform = event.extendedProps.platform;

        const getPlatformIcon = (platform) => {
            switch (platform) {
                case 'facebook':
                    return <FacebookRoundedIcon sx={{ fontSize: '1rem', color: '#1877F2' }} />;
                case 'twitter':
                    return <XIcon sx={{ fontSize: '1rem', color: 'black' }} />;
                case 'instagram':
                    return <InstagramIcon sx={{ fontSize: '1rem', color: '#E4405F' }} />;
                case 'linkedin':
                    return <LinkedInIcon sx={{ fontSize: '1rem', color: '#0A66C2' }} />;
                default:
                    return null;
            }
        };


        const truncateText = (text, maxLength) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };

        if (view.type === 'dayGridMonth') {
            return (
                <Box
                    className="month-view-event"
                    display="flex"
                    flexDirection="column"
                    sx={{
                        padding: '4px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        width: '100%',
                        margin: '3px 10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Stack
                        direction="column"
                        spacing={0.5}
                        sx={{ width: '100%' }}
                    >

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            {getPlatformIcon(platform)}
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1 }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Typography>
                        </Stack>

                        <Typography variant="caption" sx={{
                            fontSize: '0.7rem', lineHeight: 1, borderRadius: '1rem', padding: '2px 4px',
                            margin: event.extendedProps.status === 'posted' ? '1px 4rem !important' : '1px 3rem !important', bgcolor: event.extendedProps.status === 'posted' ? '#00c60073' : '#ffa50069'
                        }}>
                            {event.extendedProps.status}
                        </Typography>
                    </Stack>

                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '3rem',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginTop: '2px',
                            }}
                        />
                    )}

                    <Typography className="event-title" sx={{ fontSize: '0.6rem', lineHeight: 1.2, marginTop: '2px' }}>
                        {truncateText(event.title, 20)}
                    </Typography>
                    <Typography className="event-time" sx={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'text.secondary', lineHeight: 1 }}>
                        {formatTime(event.start)}
                    </Typography>
                </Box>

            );
        } else if (view.type === 'timeGridWeek') {
            return (
                <Box
                    className="week-view-event"
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    bgcolor="#fff"
                    borderRadius="8px"
                    overflow="hidden"
                    sx={{ boxShadow: '-7px 0px 2px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)' }}
                >
                    <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1} sx={{ width: '100%', pl: '2px' }}>
                        {getPlatformIcon(platform)}
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Typography>
                    </Stack>


                    <Typography variant="caption" sx={{
                        fontSize: '0.7rem', lineHeight: 1, borderRadius: '1rem', padding: '2px 4px',
                        margin: event.extendedProps.status === 'posted' ? '1px 4rem !important' : '1px 3rem !important', bgcolor: event.extendedProps.status === 'posted' ? '#00c60073' : '#ffa50069'
                    }}>
                        {event.extendedProps.status}
                    </Typography>

                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '3rem',
                                objectFit: 'cover',
                                borderRadius: '7px',
                                marginTop: '2px',
                                px: '4px'
                            }}
                        />
                    )}
                    <Box className="event-details" p='2px'>
                        <Typography
                            className="event-title"
                            color='black'
                            fontSize="0.6rem"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {event.title}
                        </Typography>

                        <Typography className="event-time" fontSize="12px" fontWeight='bold' color="text.secondary">
                            {formatTime(event.start)}
                        </Typography>
                    </Box>
                </Box>
            );
        } else if (view.type === 'timeGridDay') {
            return (
                <Box
                    className="day-view-event"
                    display="flex"
                    flexDirection="row"
                    height="90%"
                    width="100%"
                    bgcolor="background.paper"
                    borderRadius="8px"
                    overflow="hidden"
                    margin="7px"
                    boxShadow={1}
                >
                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '30%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        sx={{
                            width: event.extendedProps.imageUrl ? '70%' : '100%',
                            p: 1
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {getPlatformIcon(platform)}
                            <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Typography>
                        </Stack>

                        <Box>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1, color: 'black', bgcolor: '#ffa50069', borderRadius: '1rem', padding: '2px 4px' }}>
                                {event.extendedProps.status}
                            </Typography>
                        </Box>


                        <Typography
                            className="event-title"
                            color="black"
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'medium',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {event.title}
                        </Typography>
                        <Typography className="event-time" fontSize="0.9rem" fontWeight="bold" color="text.secondary">
                            {formatTime(event.start)}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    };

    const CustomToolbar = ({
        currentView, onViewChange, onPrev, onNext, onMonthChange, onYearChange, selectedDate, isPreviewOpen, onDateChange
    }) => {
        const yearRange = [2023, 2024, 2025];
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(0, i).toLocaleString('default', { month: 'long' })
        );

        const selectStyle = {
            minWidth: isPreviewOpen ? 80 : 120,
            maxWidth: isPreviewOpen ? 130 : 170,
            fontSize: isPreviewOpen ? '0.8rem' : '1rem',
        };

        const isMonthView = currentView === 'dayGridMonth';
        const isWeekView = currentView === 'timeGridWeek';
        const isDayView = currentView === 'timeGridDay';


        const formatDateRange = (date, view) => {
            if (view === 'timeGridWeek') {
                const start = new Date(date);
                start.setDate(start.getDate() - start.getDay());
                const end = new Date(start);
                end.setDate(end.getDate() + 6);
                return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            } else if (view === 'timeGridDay') {
                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            } else {
                return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            }
        };

        return (
            <Box sx={{ backgroundColor: '#fff' }}>
                <Box sx={{ borderBottom: '1px solid #e0e0e0', padding: 1 }}>
                    <Typography variant="h6" fontWeight="bold" fontSize={isPreviewOpen ? '1.1rem' : '1.25rem'}>
                        Planner
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '1rem 3rem' }}>
                    {/* Platform filter */}
                    <FormControl sx={{ minWidth: 120 }}>
                        <Select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{
                                background: '#ccdfff',
                                borderRadius: '2rem',
                                color: '#203170',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            }}
                        >
                            <MenuItem value="">All accounts</MenuItem>
                            <MenuItem value="facebook">Facebook</MenuItem>
                            <MenuItem value="instagram">Instagram</MenuItem>
                            <MenuItem value="twitter">TwitterX</MenuItem>
                            <MenuItem value="linkedin">LinkedIn</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider orientation="vertical" flexItem />

                    {isMonthView ? (
                        <>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={selectedDate.getMonth()}
                                    onChange={(e) => onMonthChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        background: '#ccdfff',
                                        borderRadius: '2rem',
                                        color: '#203170',
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    }}
                                >
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 100 }}>
                                <Select
                                    value={selectedDate.getFullYear()}
                                    onChange={(e) => onYearChange(e.target.value)}
                                    size="small"
                                    sx={{
                                        background: '#ccdfff',
                                        borderRadius: '2rem',
                                        color: '#203170',
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    }}
                                >
                                    {yearRange.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    ) : (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={selectedDate}
                                onChange={onDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                background: '#ccdfff',
                                                borderRadius: '2rem',
                                                color: '#203170',
                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    )}

                    <Divider orientation="vertical" flexItem />

                    <Box sx={{ display: 'flex', gap: isPreviewOpen ? 0.5 : 1 }}>
                        <IconButton onClick={onPrev} size="small">
                            <ArrowBackIosNewIcon fontSize={isPreviewOpen ? 'small' : 'medium'} />
                        </IconButton>
                        <Box sx={{ textAlign: 'center', minWidth: isPreviewOpen ? 120 : 150 }}>
                            <Typography variant="h6" fontWeight="bold" fontSize={isPreviewOpen ? '0.9rem' : '1rem'}>
                                {formatDateRange(selectedDate, currentView)}
                            </Typography>
                        </Box>
                        <IconButton onClick={onNext} size="small">
                            <ArrowForwardIosIcon fontSize={isPreviewOpen ? 'small' : 'medium'} />
                        </IconButton>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    <Box sx={{ display: 'flex', gap: 1, background: '#CCDFFF' }}>
                        <IconButton
                            onClick={() => onViewChange('dayGridMonth')}
                            size="small"
                            sx={{
                                backgroundColor: isMonthView ? '#203170' : 'transparent',
                                color: isMonthView ? '#fff' : 'inherit',
                                borderRadius: '0',
                                '&:hover': { backgroundColor: '#2031703d' },
                            }}
                        >
                            <CalendarViewMonthIcon fontSize={isPreviewOpen ? 'small' : 'medium'} />
                        </IconButton>

                        <IconButton
                            onClick={() => onViewChange('timeGridWeek')}
                            size="small"
                            sx={{
                                backgroundColor: isWeekView ? '#203170' : 'transparent',
                                color: isWeekView ? '#fff' : 'inherit',
                                borderRadius: '0',
                                '&:hover': { backgroundColor: '#2031703d' },
                            }}
                        >
                            <CalendarViewWeekIcon fontSize={isPreviewOpen ? 'small' : 'medium'} />
                        </IconButton>

                        <IconButton
                            onClick={() => onViewChange('timeGridDay')}
                            size="small"
                            sx={{
                                backgroundColor: isDayView ? '#203170' : 'transparent',
                                color: isDayView ? '#fff' : 'inherit',
                                borderRadius: '0',
                                '&:hover': { backgroundColor: '#2031703d' },
                            }}
                        >
                            <CalendarViewDayIcon fontSize={isPreviewOpen ? 'small' : 'medium'} />
                        </IconButton>

                    </Box>

                    <FormControl sx={selectStyle}>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{
                                background: '#ccdfff',
                                borderRadius: '2rem',
                                color: '#203170',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            }}
                        >
                            <MenuItem value="">All status</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="posted">Posted</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        );
    };



    const renderDayHeader = (info) => {
        if (info.view.type === 'timeGridWeek') {
            return (
                <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                    <Typography sx={{ fontSize: '40px', fontWeight: 'light' }}>
                        {info.date.getDate()}
                    </Typography>
                    <Typography sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        fontSize: '12px',
                    }}>
                        {info.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            fontSize: '12px',
                            backgroundColor: 'antiquewhite',
                            border: '1px solid gray',
                            color: 'black',
                            padding: '0px 4px',
                            borderRadius: '4px',
                        }}
                    >
                        0
                    </Typography>
                </Box>
            );
        }
        return info.text;
    };

    const handleDatesSet = (dateInfo) => {
        setSelectedDate(dateInfo.start);
    };

    return (
        <>
            <Global styles={plannerStyles} />
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                height: '100vh',
                width: '94.5vw',
                position: 'fixed',
                overflow: 'hidden',
                backgroundColor: 'background.paper'
            }}>
                <Box sx={{
                    flexGrow: 1,
                    width: '94.5vw',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <CustomToolbar
                        currentView={currentView}
                        onViewChange={handleViewChange}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                        selectedDate={selectedDate}
                        isPreviewOpen={openPreviewDrawer}
                        onDateChange={onDateChange}
                    />
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView={currentView}
                            editable
                            initialDate={selectedDate}
                            events={events}
                            eventClick={handleEventClick}
                            eventDragStart={handleEventDragStart}
                            eventDrop={handleEventDrop}
                            headerToolbar={false}
                            eventContent={renderEventContent}
                            dayHeaderContent={renderDayHeader}
                            eventOverlap={true}
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                            height="100%"
                            slotLabelFormat={{
                                hour: 'numeric',
                                minute: '2-digit',
                                meridiem: 'short',
                            }}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: 'short',
                            }}
                            views={{
                                timeGridDay: {
                                    allDaySlot: false,
                                    slotDuration: '01:00:00',
                                    snapDuration: '00:05:00',
                                    slotEventOverlap: true,
                                    slotEventGap: false,
                                },
                                timeGridWeek: {
                                    allDaySlot: false,
                                    slotDuration: '01:00:00',
                                    snapDuration: '00:05:00',
                                    slotEventOverlap: true,
                                },
                            }}
                            ref={calendarRef}
                            datesSet={handleDatesSet}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    width: openPreviewDrawer ? '600px' : '0px',
                    transition: 'width .7s ease, opacity 0.3s ease',
                    opacity: openPreviewDrawer ? 1 : 0,
                    borderLeft: openPreviewDrawer ? '1px solid #e0e0e0' : 'none',
                    backgroundColor: 'background.default',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {openPreviewDrawer && (
                        <>
                            <Box sx={{ borderBottom: '1px solid #e0e0e0', background: 'antiquewhite', flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" bgcolor='#cec6d9'>
                                    <Box sx={{ borderBottom: '1px solid #e0e0e0', padding: 1 }}>
                                        <Stack direction='row' gap={1} sx={{ alignItems: 'center', p: '0px' }}>
                                            <IconButton sx={{ background: 'white', borderRadius: '10px', padding: '3px' }}>
                                                {selectedEvent && selectedEvent.extendedProps.status === 'posted' ? (
                                                    <PublishedWithChangesIcon />
                                                ) : (
                                                    <CalendarTodayIcon />
                                                )}
                                            </IconButton>
                                            <Typography variant='h6'>
                                                {selectedEvent && selectedEvent.extendedProps.status === 'posted' ? 'Posted' : 'Scheduled'}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <IconButton onClick={handleClosePreviewDrawer}>
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>

                                {selectedEvent && selectedEvent.extendedProps.status === 'posted' && (
                                    <Stack direction='row' gap={2} sx={{ p: '2rem 2rem 0rem' }}>
                                    </Stack>
                                )}

                                {selectedEvent && selectedEvent.extendedProps.status !== 'posted' && (
                                    <Stack direction='row' gap={2} sx={{ p: '2rem 2rem 0rem' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleEdit}
                                            sx={{
                                                background: '#C3CBD8',
                                                borderRadius: '2rem',
                                                color: '#203170',
                                                textTransform: 'none',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    background: '#A9B2C0',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleDelete(selectedEvent.extendedProps.jobId)}
                                            sx={{
                                                background: '#C3CBD8',
                                                borderRadius: '2rem',
                                                color: '#203170',
                                                textTransform: 'none',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    background: '#A9B2C0',
                                                    boxShadow: 'none',
                                                },
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                )}

                                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                                    {renderEventPreview()}
                                </Box>

                                <Box p='0 2rem'>
                                    <Typography fontWeight='bold'>Details</Typography>
                                    <Typography fontSize='12px'>
                                        {selectedEvent && selectedEvent.extendedProps.status === 'posted' ? 'Posted Time:' : 'Scheduled Time:'}
                                    </Typography>
                                    <Typography fontSize='12px'>
                                        {selectedEvent && selectedEvent.start ? formatTime(new Date(selectedEvent.start)) : 'No time available'}
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>

            </Box>

            <Dialog
                open={openConfirmModal}
                onClose={handleCancelReschedule}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: 3,
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: 1,
                    background: '#43528C'
                }}>
                    <CalendarTodayIcon />
                    <Typography variant="h6">Reschedule Post</Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <DialogContentText>
                        Are you sure you want to reschedule this post?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCancelReschedule}
                        color="inherit"
                        variant="outlined"
                        sx={{ borderRadius: 28 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReschedule}
                        color="primary"
                        variant="contained"
                        autoFocus
                        sx={{ borderRadius: 28 }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ backgroundColor: 'white', color: snackbarSeverity === 'success' ? 'green' : 'red' }}
                    icon={false}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {snackbarSeverity === 'success' ? <CheckCircleIcon sx={{ mr: 1 }} /> : <ReportGmailerrorredIcon sx={{ mr: 1 }} />}
                        {snackbarMessage}
                    </span>
                </Alert>
            </Snackbar>

            <Dialog
                open={openEditModal}
                onClose={handleCloseModal}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    style: {
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 0,
                    },
                }}
            >
                <DialogContent
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 0,
                    }}
                >
                    <CreatePost
                        event={selectedEvent}
                        onClose={handleCloseModal}
                        triggerSnackbar={showSnackbar}
                        updateEvents={updateEventsAfterChange}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Planner;