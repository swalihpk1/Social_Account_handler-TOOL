import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography, InputAdornment, IconButton, Link } from "@mui/material";
import theme from "./theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";


const Login: React.FC = () => {
    // const steps = ['Step 1', 'Step 2'];
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
                    spacing={9}
                    sx={{
                        width: '50%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <Box>
                        <Typography variant="h6" color='whitesmoke'>
                            Step 1 of 2
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: '#57D7FF' }} />
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: 'whitesmoke' }} />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="h4" color='whitesmoke'>
                            Welcome back to Oasic...👋🏻
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
                                sx={{ mb: 1, width: '70%' }}
                            />
                            <Box sx={{ width: '70%', mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Link
                                    href="#"
                                    variant="body2"
                                    sx={{
                                        marginLeft: 1,
                                        color: 'greenyellow',
                                        textDecoration: 'none',
                                    }}
                                >
                                    forgot password?
                                </Link>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, width: '70%' }}
                            >
                                Next
                            </Button>

                            <Box sx={{ width: '70%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'white',
                                        textAlign: 'end',
                                    }}
                                >
                                    Don't have an account?
                                    <Link
                                        href="/signup"
                                        variant="body2"
                                        sx={{
                                            marginLeft: 1,
                                            color: 'greenyellow',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Sign up
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

export default Login;