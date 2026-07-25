import React from 'react';
import { Star, Clock, MapPin, Users } from 'lucide-react';

export default function ExperienceCard({ experience, onClick }) {
  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Image Thumbnail & Category Badge */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={experience.image}
          alt={experience.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          <span className="badge badge-cyan" style={{ backdropFilter: 'blur(4px)', fontWeight: 700 }}>
            {experience.category}
          </span>
        </div>

        {/* Rating Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-main)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Star size={14} fill="#FFB800" color="#FFB800" />
          <span>{experience.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({experience.reviewsCount})</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <img
            src={experience.host?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={experience.host?.name}
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Hosted by {experience.host?.name || 'Local Artisan'}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--color-terracotta)',
          marginBottom: '10px',
          lineHeight: 1.3
        }}>
          {experience.title}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="var(--color-taupe)" />
            {experience.city || experience.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="var(--color-taupe)" />
            {experience.duration}
          </span>
        </div>

        {/* Footer Price & Action */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>From</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
              ₹{experience.price?.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}> / person</span>
          </div>

          <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
