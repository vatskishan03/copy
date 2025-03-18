import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClipboardArea from './components/ClipboardArea';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import TextEditor from './components/TextEditor';
import QRCodeGenerator from './components/QRCodeGenerator';
import RecentEntries from './components/RecentEntries';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <div className="space-y-8">
                  <h1 className="text-3xl font-bold">Welcome to Clipboard</h1>
                  <RecentEntries />
                  <TextEditor />
                </div>
              ) : (
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold mb-6">Clipboard Share</h1>
                  <p className="text-lg mb-8">Securely share clipboard content across devices</p>
                  <button 
                    onClick={() => loginWithRedirect()}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
                  >
                    Log In to Get Started
                  </button>
                </div>
              )
            } />
            
            <Route path="/clipboard" element={
              <ProtectedRoute>
                <ClipboardArea />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="max-w-md mx-auto">
                  <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
                  {user && (
                    <div>
                      <img src={user.picture} alt={user.name} className="rounded-full w-24 h-24 mb-4" />
                      <h2 className="text-xl">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;