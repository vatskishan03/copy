import React, { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useClipboard } from "../hooks/useClipboard";
import Button from "./ui/Button";
import { Copy, Check } from 'lucide-react';

interface CollaboratorInfo {
  id: string;
  name: string;
  color: string;
}

export default function ClipboardHub() {
  const [content, setContent] = useState("");
  const [inputToken, setInputToken] = useState(""); // Separate state for input token
  const [createdToken, setCreatedToken] = useState(""); // State for created token
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);
  const [userId] = useState(`U${Math.floor(Math.random() * 100)}`);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { copyToClipboard } = useClipboard();
  
  const { connected } = useWebSocket(
    'ws://localhost:3001',
    inputToken || 'default-room'
  );

  // Handle copy token
  const handleCopyToken = async () => {
    if (createdToken) {
      const success = await copyToClipboard(createdToken);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  // Create new clip
  const createClip = async () => {
    try {
      setIsCreating(true);
      const response = await fetch("http://localhost:3001/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.token) {
        setCreatedToken(data.token);
      }
    } catch (error) {
      console.error("Failed to create clip:", error);
      alert("Failed to create clip");
    } finally {
      setIsCreating(false);
    }
  };

  // Join clip function
  const joinClip = async () => {
    if (!inputToken) {
      alert('Please enter a token');
      return;
    }

    try {
      setIsJoining(true);
      const response = await fetch(`http://localhost:3001/api/snippets/${inputToken}`);
      const data = await response.json();

      if (response.ok && data.content) {
        setContent(data.content);
      } else {
        alert('Invalid token or snippet not found');
      }
    } catch (error) {
      console.error('Failed to join clip:', error);
      alert('Failed to join clip');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Main Editor Area */}
      <div className="md:col-span-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here"
          className="w-full min-h-[400px] p-6 text-lg resize-none bg-white dark:bg-gray-800 border rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Token Display and Create Button Area */}
        <div className="mt-4 flex flex-col items-center space-y-4">
          {createdToken && (
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border">
              <span className="font-medium text-amber-900 dark:text-amber-200">
                Token: <strong>{createdToken}</strong>
              </span>
              <Button
                onClick={handleCopyToken}
                variant="ghost"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {isCopied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                <span className="sr-only">Copy token</span>
              </Button>
              {isCopied && (
                <span className="text-sm text-green-500">Copied!</span>
              )}
            </div>
          )}
          <Button 
            onClick={createClip} 
            variant="primary" 
            className="px-8"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        {/* Token Input */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <div className="mb-3 font-medium text-amber-900 dark:text-amber-200">
            Enter Token
          </div>
          <div className="flex gap-2">
            <input
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter token"
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button 
              onClick={joinClip} 
              variant="primary"
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Receive'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}