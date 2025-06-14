import React, { useState } from 'react';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);

      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type here; browser sets it automatically for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create post');
        setLoading(false);
        return;
      }

      setSuccessMsg('Post created!');
      setCaption('');
      setImage(null);
      setLoading(false);
    } catch (err) {
      setError('Server error');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Create Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Caption:</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
