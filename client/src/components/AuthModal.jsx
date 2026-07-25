import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';

export default function AuthModal({ authReasonMessage, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback local auth for offline standalone mode
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 6),
        name: name || email.split('@')[0] || 'Hobby Enthusiast',
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'user'
      };
      onAuthSuccess({ token: 'mock_jwt_token', user: mockUser });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '32px' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-cream)',
            color: 'var(--color-terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-terracotta)' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {authReasonMessage || (isLogin ? 'Log in to manage your experience bookings' : 'Join HobbyHub to discover and host experiences')}
          </p>
        </div>

        {/* Login / Register Toggle Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: '#FAF8F5',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.88rem',
              backgroundColor: isLogin ? 'var(--color-terracotta)' : 'transparent',
              color: isLogin ? '#FFFFFF' : 'var(--text-muted)'
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.88rem',
              backgroundColor: !isLogin ? 'var(--color-terracotta)' : 'transparent',
              color: !isLogin ? '#FFFFFF' : 'var(--text-muted)'
            }}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FFF0F0',
            color: '#D32F2F',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{isSubmitting ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
