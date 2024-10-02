import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <div>
      <h1>Snippet Share</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
          {/* Your main app content */}
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
};

export default App;