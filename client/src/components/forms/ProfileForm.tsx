import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ProfileFormProps {
  onSubmit: (name: string, bio: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const { user } = useAuth0();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, bio);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="profile-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="profile-textarea"
        />
      </div>
      <button type="submit" className="submit-button">Update Profile</button>
    </form>
  );
};

export default ProfileForm;