import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import { ErrorBoundary } from "react-error-boundary";
import CreateSnippetForm from "./components/CreateSnippetForm";
import ReceiveSnippetForm from "./components/ReceiveSnippetForm";
import { useNavigate } from "react-router-dom";

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
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const navigate = useNavigate();
  const handleReceiveCopyClick = () => {
    setShowReceiveForm(true);
    navigate("/receive");
  };

  const handleCreateCopyClick = () => {
    setShowReceiveForm(false);
    navigate("/");
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RecoilRoot>
        <div className="min-h-screen bg-gray-100">
          {/* ... (your header component) */}

          <main className="container mx-auto px-4 py-8 flex justify-center gap-4">
            {!showReceiveForm && <CreateSnippetForm />}
            {showReceiveForm && <ReceiveSnippetForm />}
          </main>

          <div className="container mx-auto px-4 pb-8 flex justify-center gap-4">
            {!showReceiveForm ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReceiveCopyClick}
              >
                Receive Copy
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCreateCopyClick}
              >
                Create Copy
              </button>
            )}
          </div>
        </div>
      </RecoilRoot>
    </ErrorBoundary>
  );
}
export default App;



