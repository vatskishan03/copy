import React, { useState, useEffect } from 'react';

interface ClipboardFormProps {
  initialContent?: string;
  onSubmit: (content: string) => void;
}

const ClipboardForm: React.FC<ClipboardFormProps> = ({ initialContent = '', onSubmit }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a key from user's session or a secured key
    const encryptionKey = await getEncryptionKey(); 
    const encryptedContent = await encryptContent(content, encryptionKey);
    
    // Store the key securely in localStorage or auth state
    onSubmit(encryptedContent);
  };

  return (
    <form onSubmit={handleSubmit} className="clipboard-form">
      <div className="form-group">
        <label htmlFor="clipboardContent">Clipboard Content:</label>
        <textarea
          id="clipboardContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="clipboard-textarea"
        />
      </div>
      <button type="submit" className="submit-button">Save</button>
    </form>
  );
};

export default ClipboardForm;