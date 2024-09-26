import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginForm: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="login-form">
      <h2>Welcome to Clipboard</h2>
      <p>Please log in to access your clipboard</p>
      <button onClick={() => loginWithRedirect()} className="login-button">
        Log In / Sign Up
      </button>
    </div>
  );
};

export default LoginForm;