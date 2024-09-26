import React, { useState } from 'react';

interface ShareFormProps {
  onShare: (email: string, permission: 'read' | 'edit') => void;
}

const ShareForm: React.FC<ShareFormProps> = ({ onShare }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'read' | 'edit'>('read');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare(email, permission);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <div className="form-group">
        <label htmlFor="email">Share with (email):</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="share-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="permission">Permission:</label>
        <select
          id="permission"
          value={permission}
          onChange={(e) => setPermission(e.target.value as 'read' | 'edit')}
          className="share-select"
        >
          <option value="read">Read</option>
          <option value="edit">Edit</option>
        </select>
      </div>
      <button type="submit" className="submit-button">Share</button>
    </form>
  );
};

export default ShareForm;