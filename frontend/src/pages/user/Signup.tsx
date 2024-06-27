import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography, InputAdornment, IconButton, Link, CircularProgress, Snackbar, SnackbarContent } from "@mui/material";
import theme from "./Theme";
import { CheckCircleOutline, ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSignUpMutation } from "../../api/ApiSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema } from "../../utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [signup] = useSignUpMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
    const navigate = useNavigate()
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);


    useEffect(() => {
        if (userInfo) {
            navigate('/connect')
        }
    }, [navigate, userInfo])

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: yupResolver(signupSchema)
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        setIsLoading(true);

        setTimeout(async () => {
            try {
                await signup({ email: data.email, password: data.password }).unwrap();
                setShowToast(true);
                setToastSeverity('success');
                setToastMessage('Signup successful!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } catch (error) {
                console.error('Signup failed:', error);
                setShowToast(true);
                setToastSeverity('error');
                if (isFetchBaseQueryError(error)) {
                    setToastMessage(getErrorMessage(error));
                } else {
                    setToastMessage('An error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        }, 2000);
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

    const handleToastClose = () => {
        setShowToast(false);
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
                                    backgroundColor: errors.email ? 'transparent' : 'rgba(217, 217, 217, 0.28)',
                                }}
                                {...register('email')}
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
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
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
                                sx={{
                                    mb: 3,
                                    width: '70%',
                                    backgroundColor: errors.confirmPassword ? 'transparent' : 'rgba(217, 217, 217, 0.28)',
                                }}
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, textTransform: 'none', fontSize: 'large' }}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} sx={{ color: 'whitesmoke' }} /> : 'Sign up'}
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

            <Snackbar
                open={showToast}
                autoHideDuration={6000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: 'white',
                        color: toastSeverity === 'success' ? '#43a047' : '#f44336',
                    }}
                    message={
                        <Box display="flex" alignItems="center">
                            {toastSeverity === 'success' ? (
                                <CheckCircleOutline sx={{ mr: 2 }} fontSize="large" />
                            ) : (
                                <ErrorOutline sx={{ mr: 2 }} fontSize="large" />
                            )}
                            <Typography variant="body1">
                                {toastMessage}
                            </Typography>
                        </Box>
                    }
                />
            </Snackbar>
        </Container>
    );
};

export default Signup;