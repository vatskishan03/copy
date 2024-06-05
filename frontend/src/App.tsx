import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import CreateSnippetForm from './components/CreateSnippetForm';
import ReceiveSnippetForm from './components/ReceiveSnippetForm';
import AppRoutes from './routes'; 
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void; }) {
  return (
    <div role="alert" className='flex items-center justify-center h-screen'>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline">{error.message}</span>
        <button onClick={resetErrorBoundary} className='absolute top-0 bottom-0 right-0 px-4 py-3'>Try again</button>
      </div>
    </div>
  );
}
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RecoilRoot>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white py-4 shadow">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center">
                Text Sharing App
              </h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <AppRoutes />
          </main>
        </div>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
