import React from 'react';
import {
  Input,
  Button,
  Form,
  Card,
  Typography,
  message
} from 'antd';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const signUpSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
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
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpData) => {
    signup(data.email, data.username, data.password, navigate);
    message.success('Sign-up successful');
    setValue('email', '');
    setValue('username', '');
    setValue('password', '');
    setValue('confirmPassword', '');
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Create Your Account
        </Title>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Enter your email"
                  prefix={<MailOutlined />}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Choose a username"
                  prefix={<UserOutlined />}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="Enter a password"
                  prefix={<LockOutlined />}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="Re-enter your password"
                  prefix={<LockOutlined />}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Sign Up
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Already have an account? <Link to="/login">Login</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    width: 450,
    padding: '2.5rem 2rem',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
};

export default SignUpForm;