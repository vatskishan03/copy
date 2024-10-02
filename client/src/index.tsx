import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Auth0Provider
  domain="dev-seclquk4swbhaptg.us.auth0.com"
  clientId="ODKDPczFF1wJKqCShjHpqfGeuU931d36"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "YOUR_API_AUDIENCE",
    scope: "openid profile email"
  }}
>
  <App />
</Auth0Provider>

);