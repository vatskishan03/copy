import { useState } from 'react';

export const useClipboard = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  return { copiedText, copyToClipboard };
};