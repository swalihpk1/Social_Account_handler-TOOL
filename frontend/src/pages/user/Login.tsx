import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography, InputAdornment, IconButton, Link, CircularProgress } from "@mui/material";
import theme from "./Theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/ApiSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setCredentials } from "../../features/auth/CredSlice";
import { UserInfo, LoginFormData, AuthResponse } from "../../types/Types";



const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormData>();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const dispatch = useDispatch()


    useEffect(() => {
        if (userInfo) {
            navigate('/connect')
        }
    }, [navigate, userInfo])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await login({ email: data.email, password: data.password }).unwrap() as AuthResponse;
            console.log("Login successful, user:", response);

            const user: UserInfo = {
                email: data.email,
            };

            dispatch(setCredentials(user));
            navigate('/connect');
        } catch (error) {
            console.error('Login failed:', error);
            if (isFetchBaseQueryError(error)) {
                const errorMessage = getErrorMessage(error);
                if (errorMessage.toLowerCase().includes('email')) {
                    setError('email', { type: 'server', message: errorMessage });
                }
                if (errorMessage.toLowerCase().includes('password')) {
                    setError('password', { type: 'server', message: errorMessage });
                }
                if (!errorMessage.toLowerCase().includes('email') && !errorMessage.toLowerCase().includes('password')) {
                    setError('email', { type: 'server', message: 'Invalid login credentials' });
                    setError('password', { type: 'server', message: 'Invalid login credentials' });
                }
            } else {
                setError('email', { type: 'server', message: 'An unexpected error occurred' });
                setError('password', { type: 'server', message: 'An unexpected error occurred' });
            }
        } finally {
            setIsLoading(false);
        }
    };


    const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
        return error && typeof error === 'object' && 'data' in error;
    };

    const getErrorMessage = (error: FetchBaseQueryError): string => {
        if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
            return (error.data as { message: string }).message;
        }
        return 'An error occurred';
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
                            component='form'
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mb: 2,
                                    width: '70%',
                                    backgroundColor: errors.password ? 'transparent' : 'rgba(217, 217, 217, 0.28)',
                                }}
                                {...register('email', { required: 'Email is required' })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
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
                                sx={{
                                    mb: 2,
                                    width: '70%',
                                    backgroundColor: errors.password ? 'transparent' : 'rgba(217, 217, 217, 0.28)',
                                }}
                                {...register('password', { required: 'Password is required' })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
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
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} sx={{ color: 'whitesmoke' }} /> : 'Sign up'}
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
