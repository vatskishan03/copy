// frontend/src/components/ReceiveSnippetForm.tsx
import React, { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import { snippetState, errorState } from '../state/atoms';
import { getSnippet } from '../api/snippetService';
import { useNavigate } from 'react-router-dom';
import TextEditor from './TextEditor'; // Import your text editor component

function ReceiveSnippetForm() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snippet, setSnippet] = useRecoilState(snippetState);
  const [, setError] = useRecoilState(errorState);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fetchedSnippet = await getSnippet(token);
      setSnippet(fetchedSnippet);
    } catch (error: any) {
      setError(error.response.data.error || 'An error occurred.');
      navigate('/');  // Redirect back to the home page on error
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">
            Enter token:
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Retrieving...' : 'Receive'}
        </button>
      </form>

      {/* Conditionally render the text editor */}
      {snippet && (
        <div className="mt-8">
          <TextEditor
            initialContent={snippet.content}}
            canEdit={snippet.canEdit} 
            snippetId={snippet.id}
            />
        </div>
      )}
    </div>
  );
}

export default ReceiveSnippetForm;
