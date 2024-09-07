import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const initialEvents = [
    {
        id: '1',
        title: 'Team Meeting',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        extendedProps: {
            imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mikebirdy-170811.jpg&fm=jpg',
        },
    },
    {
        id: '2',
        title: 'Doctor',
        start: new Date(new Date().setHours(new Date().getHours() + 1)),
        end: new Date(new Date().setHours(new Date().getHours() + 2)),
        extendedProps: {
            imageUrl: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
        },
    },
    {
        id: '3',
        title: 'Client',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        extendedProps: {
            imageUrl: '',
        },
    },
];


const FullPageCalendar = () => {
    const [themeMode, setThemeMode] = useState('light');
    const [events, setEvents] = useState(initialEvents);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentView, setCurrentView] = useState('timeGridWeek');

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                },
            }),
        [themeMode]
    );

    const handleEventClick = ({ event }) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleCloseDialog = () => {
        setShowEventDetails(false);
    };

    const handleEventDrop = (info) => {
        const updatedEvents = events.map((event) => {
            if (event.id === info.event.id) {
                return {
                    ...event,
                    start: info.event.start,
                    end: info.event.end,
                };
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    const renderEventContent = (eventInfo) => {
        const { event, view } = eventInfo;

        if (view.type === 'dayGridMonth') {
            const eventsInSameSlot = eventInfo.view.calendar.getEvents().filter(
                e => e.startStr === event.startStr && e.endStr === event.endStr
            );
            return (
                <Box
                    className="month-view-event"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        padding: '4px',
                        backgroundColor: '#ffff',
                        borderRadius: '8px',
                        width: '100%',
                        margin: '3px 10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#FF6347' }}>
                        {eventsInSameSlot.length} Events
                    </Typography>

                    <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1} sx={{ width: '100%' }}>
                        <FacebookRoundedIcon sx={{ fontSize: '1rem', color: '#1877F2' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Swax_x
                        </Typography>
                    </Stack>

                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '3.5rem',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginTop: '4px',
                            }}
                        />
                    )}

                    <Typography className="event-title" fontSize="0.6rem">
                        {event.title}
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
                    bgcolor="#ffff"
                    borderRadius="8px"
                    overflow="hidden"
                    sx={{ boxShadow: '-7px 0px 2px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)' }}
                >
                    <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1} sx={{ width: '100%', pl: '2px' }}>
                        <FacebookRoundedIcon sx={{ fontSize: '1rem', color: '#1877F2' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}>
                            Swax_x
                        </Typography>
                    </Stack>
                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                minHeight: '60px',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                    <Box className="event-details" p='2px'>
                        <Typography className="event-title" color='black' fontSize="0.6rem">
                            {event.title}
                        </Typography>
                        <Typography className="event-time" fontSize="0.8em" color="text.secondary">
                            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>

                    </Box>
                </Box>
            );
        } else if (view.type === 'timeGridDay') {
            return (
                <Box
                    className="week-view-event"
                    display="flex"
                    flexDirection="column"
                    height="90%"
                    width='200px'
                    bgcolor="background.paper"
                    borderRadius="8px"
                    overflow="hidden"
                    margin='7px'
                    boxShadow={1}
                >
                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '60px',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                    <Box className="event-details" p={1}>
                        <Typography className="event-title" color='black' mb={0.5}>
                            {event.title}
                        </Typography>
                        <Typography className="event-time" fontSize="0.8em" color="text.secondary">
                            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <MUIThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box sx={{ padding: '16px', height: '100vh',background:'#ffff' }}>
                <Button variant="contained" onClick={toggleTheme} sx={{ marginBottom: 2 }}>
                    Toggle {themeMode === 'light' ? 'Dark' : 'Light'} Mode
                </Button>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    editable
                    events={events}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    eventContent={renderEventContent}
                    eventOverlap={true}  // Ensure events can overlap if necessary
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    height="auto"
                    contentHeight="auto"
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
                            snapDuration: '01:00:00',
                            slotEventOverlap: true,  // Allow overlap
                            slotEventGap: false, // Disable gaps
                        },
                        timeGridWeek: {
                            allDaySlot: false,
                            slotDuration: '01:00:00',
                            snapDuration: '00:00:00',
                            slotEventOverlap: true,
                        },
                    }}
                />

                <Dialog open={showEventDetails} onClose={handleCloseDialog}>
                    <DialogTitle>Event Details</DialogTitle>
                    <DialogContent>
                        {selectedEvent && (
                            <>
                                <h2>{selectedEvent.title}</h2>
                                <p>Start: {selectedEvent.start.toLocaleString()}</p>
                                <p>End: {selectedEvent.end.toLocaleString()}</p>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <style jsx global>{`
                .fc-timegrid-slot {
                    height: 120px !important;
                }
                .fc-event {
                    border: none !important;
                    background: transparent !important;
                }

                .fc-daygrid-day-events {
                    max-height: 8rem;
                    overflow-y: auto;
                }
                .fc-direction-ltr .fc-timegrid-col-events {
                    margin: 0px; /* No gaps between events */
                    width: 100%; /* Adjust based on available space */
                    
                 }
                    

            `}</style>
        </MUIThemeProvider>
    );
};

export default FullPageCalendar;
