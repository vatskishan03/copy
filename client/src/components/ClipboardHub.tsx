import React, { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useClipboard } from "../hooks/useClipboard";
import  Button  from "./ui/Button";
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
  const [isSaving, setIsSaving] = useState(false);
  const { copyToClipboard } = useClipboard();
  
  const { provider, connected } = useWebSocket(
    'ws://localhost:3001',
    token || 'default-room'
  );

  // Create new clip
  const createClip = async () => {
    try {
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  // Join existing clip
  const joinClip = async () => {
    if (!token) {
      alert("Please enter a token");
      return;
    }

    try {
      setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const shareDocument = () => {
    if (!token) return;

    if (navigator.share) {
      navigator.share({
        title: "ClipSync Pro Document",
        text: `Join me on ClipSync Pro! Use token: ${token}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(token);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Main Editor Area */}
      <div className="md:col-span-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing here..."
          className="w-full min-h-[400px] p-6 text-lg resize-none bg-white dark:bg-gray-800 border rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        {/* Token Input */}
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <div className="mb-3 font-medium">Enter Token</div>
          <div className="flex gap-2">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="Enter token"
              className="flex-1 p-2 border rounded"
            />
            <Button onClick={joinClip} variant="primary">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={createClip} variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
          <Button onClick={shareDocument} variant="secondary">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Status */}
        {isSaving && (
          <p className="text-sm text-center text-gray-500 animate-pulse">
            Saving changes...
          </p>
        )}
      </div>
    </div>
  );
}