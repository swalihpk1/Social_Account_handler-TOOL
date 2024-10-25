import { createTheme } from "@mui/material";

const TextFieldsTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                        },
                        '&.Mui-focused .MuiInputBase-input': {
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(217, 217, 217, 0.28)',
                    border: '1px solid white',
                    borderRadius: '2px',
                    height: '50px',
                    width: '70%',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: 'black'
                    },
                },
            },
        },
    },
});

export default TextFieldsTheme;
