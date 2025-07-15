import React from 'react';
import { Input, Button, Form, message, Card, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    login(data.email, data.password);
    message.success('Login successful');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome Back
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
                  placeholder="Enter your email"
                  prefix={<MailOutlined />}
                  size="large"
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
                  placeholder="Enter your password"
                  prefix={<LockOutlined />}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Don’t have an account? <Link to="/signup">Signup</Link>
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
    width: 400,
    padding: '2.5rem 2rem',
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
};

export default LoginForm;
