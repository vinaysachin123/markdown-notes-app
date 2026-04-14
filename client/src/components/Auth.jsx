import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(username, password);
      if (!res.success) setError(res.error);
    } else {
      const res = await register(username, password);
      if (res.success) {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--accent-color)', 
            width: '50px', 
            height: '50px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <FileText color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {isLogin ? 'Manage your markdown notes efficiently' : 'Start taking better notes today'}
          </p>
        </div>

        {error && (
          <div className={`alert ${error.includes('successful') ? 'success' : 'error'}`}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              color: 'var(--accent-color)', 
              fontWeight: '600', 
              padding: '0' 
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }
        .alert.error {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
        }
        .alert.success {
          background: #f0fdf4;
          color: #22c55e;
          border: 1px solid #dcfce7;
        }
      `}</style>
    </div>
  );
}
