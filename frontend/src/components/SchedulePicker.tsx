import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, InputAdornment } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format } from 'date-fns';

const SchedulePicker = ({ open, onClose, onSchedule }: { open: boolean, onClose: () => void, onSchedule: (dateTime: string) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

    const handleSchedule = () => {
        if (selectedDate && selectedTime) {
            const dateTime = new Date(selectedDate);
            dateTime.setHours(selectedTime.getHours());
            dateTime.setMinutes(selectedTime.getMinutes());

            const formattedDateTime = format(dateTime, "EEE MMM d yyyy, h:mm a");
            onSchedule(formattedDateTime);
        }
        onClose();
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time: Date) => {
        setSelectedTime(time);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            BackdropProps={{
                style: { backgroundColor: 'transparent' },
            }}
            PaperProps={{
                sx: { top: '18%', left: '30%', width: '300px', height: '294px' },
            }}
        >
            <DialogTitle sx={{ p: '8px 1rem' }}>Schedule Post</DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select Date"
                        customInput={
                            <TextField
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f9f9f9',
                                    },
                                    '& input': {
                                        fontSize: '16px',
                                        padding: '9px 14px'
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarMonthIcon sx={{ color: '#273091' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        }
                    />
                    <DatePicker
                        selected={selectedTime}
                        onChange={handleTimeChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Select Time"
                        className="time-picker-input"
                        customInput={
                            <TextField
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f9f9f9',
                                    },
                                    '& input': {
                                        fontSize: '16px',
                                        padding: '9px 14px'
                                    }
                                }}
                            />
                        }
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSchedule} variant="contained" color="primary"
                    sx={{
                        border: '1px solid #203170',
                        width: '100%',
                        padding: '1px',
                        color: '#203170',
                        background: 'antiquewhite',
                        fontWeight: 'bold',
                        '&:hover': {
                            background: '#f0dabc',
                        },
                    }} >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SchedulePicker;
