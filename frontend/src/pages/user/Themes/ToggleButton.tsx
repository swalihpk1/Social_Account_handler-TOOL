// ToggleButtonTheme.ts
import { createTheme } from '@mui/material/styles';

const ToggleButtonTheme = createTheme({
    components: {
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    padding: '.5rem',
                    letterSpacing:.5,
                    '&.Mui-selected': {
                        backgroundColor: '#203170',
                        color: 'white',
                        transition: '0.3s',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#28409b',
                        },
                    },
                },
            },
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    height: '2rem',
                    backgroundColor: '#cfcfcf',
                },
            },
        },
    },
});

export default ToggleButtonTheme;
