import { Snackbar as MuiSnackbar, Alert, Slide, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

interface SnackbarPosition {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
}

const iconMap = {
    success: CheckCircleOutlineIcon,
    error: ErrorOutlineIcon,
    info: InfoOutlinedIcon,
    warning: WarningAmberIcon,
};

const Snackbar = ({
    open,
    message,
    severity,
    onClose,
    position = { vertical: 'bottom', horizontal: 'right' } as SnackbarPosition
}) => {
    const Icon = iconMap[severity];

    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={position}
            TransitionComponent={Slide}
        >
            <Alert
                elevation={6}
                variant="filled"
                severity={severity}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 10px -5px rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    '& .MuiAlert-icon': {
                        fontSize: '24px',
                    },
                }}
                iconMapping={{
                    success: <Icon fontSize="inherit" />,
                    error: <Icon fontSize="inherit" />,
                    info: <Icon fontSize="inherit" />,
                    warning: <Icon fontSize="inherit" />,
                }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </MuiSnackbar>
    );
};

export default Snackbar;