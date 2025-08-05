import { useState } from 'react';
import { useLocation } from 'wouter';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

export default function Auth() {
  const [location] = useLocation();
  const [mode, setMode] = useState<AuthMode>(() => {
    // Check if we're on reset password page
    if (location.includes('reset-password')) {
      return 'reset-password';
    }
    // Check URL params for mode
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const urlMode = urlParams.get('mode') as AuthMode;
    return urlMode || 'login';
  });

  const handleSwitchToLogin = () => setMode('login');
  const handleSwitchToSignup = () => setMode('signup');
  const handleSwitchToForgotPassword = () => setMode('forgot-password');

  // If we're on reset password page, show reset form
  if (mode === 'reset-password') {
    return <ResetPasswordForm />;
  }

  // Render the appropriate form based on mode
  switch (mode) {
    case 'signup':
      return <SignupForm onSwitchToLogin={handleSwitchToLogin} />;
    case 'forgot-password':
      return <ForgotPasswordForm onSwitchToLogin={handleSwitchToLogin} />;
    case 'login':
    default:
      return (
        <LoginForm
          onSwitchToSignup={handleSwitchToSignup}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      );
  }
} 