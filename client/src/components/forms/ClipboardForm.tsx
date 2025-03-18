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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Directly submit plain content
    onSubmit(content);
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