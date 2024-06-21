import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography, InputAdornment, IconButton, Link } from "@mui/material";
import theme from "./theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";


const Signup: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <Container
            component="main"
            maxWidth={false}
            disableGutters
            sx={{
                background: 'linear-gradient(90deg, #43528C, #203170)',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                position: 'fixed',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Stack
                sx={{
                    m: 5,
                    border: '2px solid white',
                    borderRadius: 2,
                    width: '85%',
                    height: '85%',
                    flexDirection: 'row',
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItem: 'center'
                    }}
                >
                    <img src="LoginImage.jpg" alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />
                </Box>
                <Stack
                    spacing={6}
                    sx={{
                        width: '50%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '4px',
                        paddingTop: '6rem'

                    }}
                >

                    <Box>
                        <Typography variant="h4" color='whitesmoke'>
                            Sign up
                        </Typography>
                    </Box>

                    <ThemeProvider theme={theme}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2, width: '70%' }}
                            />

                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility} edge="end" style={{ color: 'white' }}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2, width: '70%' }}
                            />

                            <TextField
                                label="Confirm password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility} edge="end" style={{ color: 'white' }}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3, width: '70%' }}
                            />


                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, width: '70%' }}
                            >
                                Next
                            </Button>

                            <Box sx={{ width: '70%', mt: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'white'
                                    }}
                                >
                                    Don't have an account?

                                    <Link
                                        href="/login"
                                        variant="body2"
                                        sx={{
                                            marginLeft: 1,
                                            color: 'greenyellow',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>

                        </Box>
                    </ThemeProvider>
                </Stack>

            </Stack>
        </Container>

    );
};

export default Signup;