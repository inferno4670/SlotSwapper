import React, { useState } from 'react';
import { signup } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup failed:', error);
      // Check if it's a specific error message from the server
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Signup failed: ${error.response.data.message}`);
      } else {
        alert('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center mt-3">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;