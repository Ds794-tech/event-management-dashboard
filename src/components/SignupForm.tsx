import React from 'react';
import { Input, Button, Form, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define validation schema using Yup
const signUpSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    username: yup.string().required('Username is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

interface SignUpData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const SignUpForm: React.FC = () => {
    const { signup } = useAuth();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<SignUpData>({
        resolver: yupResolver(signUpSchema),
    });

    const navigate = useNavigate()

    const onSubmit = (data: SignUpData) => {
        signup(data.email, data.username,data.password);
        message.success('Sign-up successful');
        navigate('/login');
        setValue('email', '');
        setValue('username', '');
        setValue('password', '');
        setValue('confirmPassword', '');
    };

    return (
        <Form onFinish={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: '0 auto' }}>
            <Form.Item
                label="Email"
                validateStatus={errors.email ? 'error' : 'success'}
                help={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Username"
                validateStatus={errors.username ? 'error' : 'success'}
                help={errors.username?.message}
            >
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                validateStatus={errors.password ? 'error' : 'success'}
                help={errors.password?.message}
            >
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <Input.Password {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                validateStatus={errors.confirmPassword ? 'error' : 'success'}
                help={errors.confirmPassword?.message}
            >
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => <Input.Password {...field} />}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Sign Up
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignUpForm;
