import React, { useState, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useClipboard } from "../hooks/useClipboard";
import Button from "./ui/Button";
import { Copy, Check, Users } from 'lucide-react';

export default function ClipboardHub() {
  const [content, setContent] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const [roomToken, setRoomToken] = useState<string>(""); 
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isCopiedToken, setIsCopiedToken] = useState(false);
  const [isCopiedContent, setIsCopiedContent] = useState(false);
  const { copyToClipboard } = useClipboard();

  const onContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

 
  const { connected, collaborators, updateContent } = useWebSocket(
    'ws://localhost:3001',
    roomToken,
    onContentUpdate
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (isEditing) {
      updateContent(newContent);
    }
  };

  // Copy the created token
  const handleCopyToken = async () => {
    if (createdToken) {
      const success = await copyToClipboard(createdToken);
      if (success) {
        setIsCopiedToken(true);
        setTimeout(() => setIsCopiedToken(false), 700);
      }
    }
  };

  // Copy the entire collaborative content
  const handleCopyContent = async () => {
    if (content) {
      const success = await copyToClipboard(content);
      if (success) {
        setIsCopiedContent(true);
        setTimeout(() => setIsCopiedContent(false), 700);
      }
    }
  };

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
        setIsEditing(true);
        setRoomToken(inputToken);  
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
      
      {!isEditing && (
        <div className="md:col-span-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text here"
            className="w-full min-h-[400px] p-6 text-lg resize-none bg-white dark:bg-gray-800 border rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
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
                  {isCopiedToken ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-amber-900 dark:text-amber-200" />
                  )}
                  <span className="sr-only">Copy token</span>
                </Button>
                {isCopiedToken && (
                  <span className="text-sm text-green-500">Copied!</span>
                )}
              </div>
            )}
            <Button 
              onClick={createClip} 
              variant="primary" 
              className="px-8"
              disabled={isCreating || !content}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      )}

      {/* Collaborative Editor */}
      {isEditing && (
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-amber-900 dark:text-amber-200">
                Collaborative Editor
              </h2>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-amber-900 dark:text-amber-200" />
                <span className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>{collaborators.length} connected</strong>
                </span>
                <Button
                  onClick={handleCopyContent}
                  variant="ghost"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  {isCopiedContent ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-amber-900 dark:text-amber-200" />
                  )}
                  <span className="sr-only">Copy document content</span>
                </Button>
                {isCopiedContent && (
                  <span className="text-sm text-green-500">Copied!</span>
                )}
              </div>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full min-h-[400px] p-6 text-lg resize-none bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <div className="mt-4 flex justify-end">
            <Button 
                onClick={() => window.location.reload()}
                variant="primary"
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                Create again
            </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <div className="mb-3 font-medium text-amber-900 dark:text-amber-200">
            Join Collaboration
          </div>
          <div className="flex flex-col gap-2">
            <input
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter token"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button 
              onClick={joinClip} 
              variant="primary"
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? 'Receiving' : 'Receive'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}