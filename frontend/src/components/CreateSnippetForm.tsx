import React, { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import { snippetState, errorState } from '../state/atoms'; // Import your Recoil atoms
import { createSnippet } from '../api/snippetService';
import { useNavigate } from 'react-router-dom';
import * as Y from 'yjs'; 

function CreateSnippetForm() {
  const [content, setContent] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [, setSnippet] = useRecoilState(snippetState); // Update snippet state in Recoil
  const [, setError] = useRecoilState(errorState);
  const navigate = useNavigate(); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const snippet = await createSnippet(content, canEdit);
      setSnippet(snippet); 
      navigate(`/receive/${snippet.token}`); 
    } catch (error: any) {
      // Handle the error here
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Enter your text:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={canEdit}
            onChange={(e) => setCanEdit(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Allow Editing</span>
        </label>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default CreateSnippetForm;
