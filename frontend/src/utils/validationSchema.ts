import * as yup from 'yup';

export const signupSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(3, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});


