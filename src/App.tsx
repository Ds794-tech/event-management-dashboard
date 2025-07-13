import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignupForm';
import { ProtectedRoute,PublicRoute } from './authentication/ProtectedRoute';
import Error404 from './components/Error404';
import DefaultLayout from './layout';

const App = () => {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginForm /> </PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUpForm /> </PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><DefaultLayout /> </ProtectedRoute>} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
};

export default App;
