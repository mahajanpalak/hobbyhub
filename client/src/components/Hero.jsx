import React from 'react';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Hero({ searchTerm, setSearchTerm, cityFilter, setCityFilter, onSearch }) {
  return (
    <section style={{
      padding: '48px 0 32px 0',
      background: 'linear-gradient(180deg, rgba(255, 233, 207, 0.4) 0%, rgba(251, 248, 243, 0) 100%)'
    }}>
      <div className="container">
        <div style={{ maxWidth: '780px', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-cream)',
            color: 'var(--color-terracotta)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            border: '1px solid rgba(126, 45, 0, 0.15)'
          }}>
            <Sparkles size={14} />
            <span>Discover Passion, Craft & Community</span>
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            color: 'var(--color-terracotta)',
            letterSpacing: '-0.025em',
            marginBottom: '12px',
            lineHeight: 1.15
          }}>
            Welcome. What experience will you discover today?
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            fontWeight: 400,
            maxWidth: '620px'
          }}>
            Instead of booking staying rooms, book hands-on pottery workshops, salsa classes, outdoor trekking groups, and cooking masterclasses led by passionate local hosts.
          </p>
        </div>

        {/* Search Bar Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-md)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Keyword Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRight: '1px solid var(--border-light)' }}>
            <Search size={20} color="var(--color-taupe)" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-main)',
                background: 'transparent'
              }}
            />
          </div>

          {/* Location Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
            <MapPin size={20} color="var(--color-taupe)" />
            <input
              type="text"
              placeholder="City or location..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-main)',
                background: 'transparent'
              }}
            />
          </div>

          {/* Search Button */}
          <button 
            className="btn btn-primary"
            onClick={onSearch}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700
            }}
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </section>
  );
}
