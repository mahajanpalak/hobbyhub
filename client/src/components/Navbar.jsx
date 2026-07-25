import React from 'react';
import { Sparkles, Calendar, PlusCircle, Compass, LogIn, UserCheck, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenHostModal, onOpenAuthModal, user, onLogout, bookingsCount }) {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-cyan) 0%, #0099B8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#032530',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 215, 255, 0.3)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', color: 'var(--color-terracotta)', lineHeight: 1 }}>
              HobbyHub
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-taupe)', fontWeight: 500, letterSpacing: '0.04em' }}>
              BOOK EXPERIENCES, NOT HOMES
            </span>
          </div>
        </div>

        {/* Navigation Links & User Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn ${activeTab === 'explore' ? 'btn-cream' : 'btn-ghost'}`}
            onClick={() => setActiveTab('explore')}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 600,
              backgroundColor: activeTab === 'explore' ? 'var(--color-cream)' : 'transparent',
              color: activeTab === 'explore' ? 'var(--color-terracotta)' : 'var(--text-muted)'
            }}
          >
            <Compass size={18} />
            <span>Explore</span>
          </button>

          <button
            className={`btn ${activeTab === 'bookings' ? 'btn-cream' : 'btn-ghost'}`}
            onClick={() => setActiveTab('bookings')}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 600,
              backgroundColor: activeTab === 'bookings' ? 'var(--color-cream)' : 'transparent',
              color: activeTab === 'bookings' ? 'var(--color-terracotta)' : 'var(--text-muted)',
              position: 'relative'
            }}
          >
            <Calendar size={18} />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-cyan)',
                color: '#032530',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '999px',
                marginLeft: '4px'
              }}>
                {bookingsCount}
              </span>
            )}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => user ? onOpenHostModal() : onOpenAuthModal('Please log in to host an experience.')}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontSize: '0.9rem'
            }}
          >
            <PlusCircle size={18} />
            <span>Host Experience</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-cream-soft)',
                border: '1px solid var(--border-light)',
                padding: '4px 12px 4px 6px',
                borderRadius: 'var(--radius-full)'
              }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                  {user.name}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={onLogout}
                title="Log Out"
                style={{ padding: '8px', borderRadius: '50%' }}
              >
                <LogOut size={18} color="var(--text-muted)" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline"
              onClick={onOpenAuthModal}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '8px 18px',
                fontSize: '0.88rem',
                marginLeft: '6px'
              }}
            >
              <LogIn size={16} />
              <span>Log In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
