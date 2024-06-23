import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography, InputAdornment, IconButton } from "@mui/material";
import theme from "./Theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useSignUpMutation } from "../../api/ApiSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema } from "../../utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [signup, { isLoading, isSuccess, isError, error }] = useSignUpMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: yupResolver(signupSchema)
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        try {
            console.log(data);
            await signup({ email: data.email, password: data.password }).unwrap();
        } catch (error) {
            console.log(error);
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
                                sx={{ mb: 2, width: '70%' }}
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
                                sx={{ mb: 2, width: '70%' }}
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
                                sx={{ mb: 3, width: '70%' }}
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, width: '70%' }}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing up...' : 'Sign up'}
                            </Button>
                            {isError && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {isFetchBaseQueryError(error) ? getErrorMessage(error) : 'An error occurred'}
                                </Typography>
                            )}
                            {isSuccess && (
                                <Typography color="primary" sx={{ mt: 2 }}>
                                    Signup successful!
                                </Typography>
                            )}
                        </Box>
                    </ThemeProvider>
                </Stack>
            </Stack>
        </Container>
    );
};

export default Signup;