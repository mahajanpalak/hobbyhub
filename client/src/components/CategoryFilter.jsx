import React from 'react';
import { Palette, Flame, Mountain, Brush, Utensils, Music, Scissors, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Pottery', icon: Flame },
  { name: 'Dance', icon: Palette },
  { name: 'Trekking', icon: Mountain },
  { name: 'Painting', icon: Brush },
  { name: 'Cooking', icon: Utensils },
  { name: 'Music', icon: Music },
  { name: 'Crafts', icon: Scissors }
];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="container" style={{ margin: '24px auto 32px auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none'
      }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.9rem',
                border: isSelected ? '2px solid var(--color-cyan)' : '1px solid var(--border-light)',
                backgroundColor: isSelected ? 'var(--color-cream)' : '#FFFFFF',
                color: isSelected ? 'var(--color-terracotta)' : 'var(--text-muted)',
                boxShadow: isSelected ? '0 4px 14px rgba(126, 45, 0, 0.08)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} color={isSelected ? 'var(--color-terracotta)' : 'var(--color-taupe)'} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
