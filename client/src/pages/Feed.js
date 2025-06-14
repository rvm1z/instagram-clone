import React, { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to see the feed');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load posts');
          setLoading(false);
          return;
        }

        setPosts(data.posts || []);
        setLoading(false);
      } catch (err) {
        setError('Server error');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!posts.length) return <p>No posts to show.</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Feed</h2>
      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: '1px solid #ccc',
            marginBottom: 20,
            padding: 10,
            borderRadius: 6,
          }}
        >
          <p><strong>{post.user.name}</strong></p>
          <img
            src={post.imageUrl}
            alt={post.caption}
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
}
