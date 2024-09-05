import { useState, useMemo, useCallback } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button } from '@mui/material';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);

const initialEvents = [
    {
        id: 1,
        title: 'Team Meeting',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mikebirdy-170811.jpg&fm=jpg',
        socialMedia: 'twitter',
    },
    {
        id: 2,
        title: 'Doctor Appointment',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        imageUrl: 'https://via.placeholder.com/50',
        socialMedia: 'facebook',
    },
];

const socialMediaIcons = {
    twitter: '🐦',
    facebook: '📘',
};

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const StyledCalendarWrapper = styled.div`
  flex-grow: 1;

  .rbc-event {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: auto !important;
    min-height: 60px;
    padding: 5px;
    white-space: normal;
    overflow: hidden;
  }

  .rbc-event-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .rbc-time-slot {
    min-height: 30px; /* Default height for empty slots */
  }

  .rbc-time-slot.has-event {
    min-height: 120px; /* Increased height for slots with events */
  }

  .rbc-time-content {
    overflow-y: auto;
  }

  .rbc-time-view {
    flex: 1;
  }
`;

const CustomEvent = ({ event }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {event.imageUrl && (
                <img
                    src={event.imageUrl}
                    alt="Event"
                    style={{ width: '100%', height: 'auto', maxHeight: '80px', objectFit: 'cover', marginBottom: '8px' }}
                />
            )}
            <span>{event.title}</span>
            <span style={{ fontSize: '20px' }}>{socialMediaIcons[event.socialMedia]}</span>
        </div>
    );
};

const FullPageCalendar = () => {
    const [themeMode, setThemeMode] = useState('light');
    const [events, setEvents] = useState(initialEvents);

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

    const onEventDrop = useCallback(
        ({ event, start, end }) => {
            const updatedEvents = events.map((existingEvent) => {
                if (existingEvent.id === event.id) {
                    return { ...existingEvent, start, end };
                }
                return existingEvent;
            });
            setEvents(updatedEvents);
        },
        [events]
    );

    const dayPropGetter = (date) => {
        const isToday = dayjs().isSame(date, 'day');
        return {
            style: {
                backgroundColor: isToday ? 'white' : '#efefef',
            },
        };
    };

    const slotPropGetter = useCallback(
        (date) => {
            const hasEvent = events.some(event =>
                dayjs(event.start).isSame(date, 'hour') ||
                (dayjs(event.start).isBefore(date) && dayjs(event.end).isAfter(date))
            );
            return {
                className: hasEvent ? 'has-event' : '',
            };
        },
        [events]
    );

    return (
        <MUIThemeProvider theme={muiTheme}>
            <CssBaseline />
            <StyledWrapper>
                <StyledTopBar>
                    <h1>Schedule Event Planner</h1>
                    <Button variant="contained" onClick={toggleTheme}>
                        Toggle {themeMode === 'light' ? 'Dark' : 'Light'} Mode
                    </Button>
                </StyledTopBar>

                <StyledCalendarWrapper>
                    <Box sx={{ height: '100%', width: '100%' }}>
                        <DndProvider backend={HTML5Backend}>
                            <DnDCalendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%', width: '100%' }}
                                views={['month', 'week', 'day', 'agenda']}
                                defaultView="week"
                                onEventDrop={onEventDrop}
                                resizable
                                components={{
                                    event: CustomEvent,
                                }}
                                dayPropGetter={dayPropGetter}
                                slotPropGetter={slotPropGetter}
                                step={60}
                                timeslots={1}
                            />
                        </DndProvider>
                    </Box>
                </StyledCalendarWrapper>
            </StyledWrapper>
        </MUIThemeProvider>
    );
};

export default FullPageCalendar;