import React, { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useClipboard } from "../hooks/useClipboard";
import Button from "./ui/Button";
import { Copy, Share2, Plus, Download, RefreshCw, Users } from 'lucide-react';

interface CollaboratorInfo {
  id: string;
  name: string;
  color: string;
}

export default function ClipboardHub() {
  const [content, setContent] = useState("");
  const [token, setToken] = useState("");
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);
  const [userId] = useState(`U${Math.floor(Math.random() * 100)}`);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false); 
  const { copyToClipboard } = useClipboard();
  
  const { provider, connected } = useWebSocket(
    'ws://localhost:3001',
    token || 'default-room'
  );

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
        setToken(data.token);
        await copyToClipboard(data.token);
        alert("Token copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to create clip:", error);
      alert("Failed to create clip");
    } finally {
      setIsCreating(false);
    }
  };


  const joinClip = async () => {
    if (!token) {
      alert("Please enter a token");
      return;
    }

    try {
      setIsJoining(true);
      const response = await fetch(`http://localhost:3001/api/snippets/${token}`);
      const data = await response.json();

      if (data.content) {
        setContent(data.content);
        alert("Joined successfully!");
      } else {
        alert("Invalid token or clip not found");
      }
    } catch (error) {
      console.error("Failed to join clip:", error);
      alert("Failed to join clip");
    } finally {
      setIsJoining(false);
    }
  };

  const shareDocument = async () => {
    if (!token) return;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ClipSync Pro Token',
          text: `Join my ClipSync Pro session with token: ${token}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard if share was cancelled or failed
        await copyToClipboard(token);
        alert('Token copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyToClipboard(token);
      alert('Token copied to clipboard!');
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
        <div className="mt-4 flex justify-center">
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
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
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

        {/* Show share options only when token exists */}
        {token && (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
            <div className="mb-3 font-medium text-amber-900 dark:text-amber-200">
              Share Token
            </div>
            <Button 
              onClick={shareDocument} 
              variant="secondary" 
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Token
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}