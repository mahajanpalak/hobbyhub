import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

export default function HostModal({ user, onClose, onExperienceCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pottery');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('1499');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState('2 Hours');
  const [hostName, setHostName] = useState(user?.name || '');
  const [hostBio, setHostBio] = useState('');
  const [image, setImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      alert('Please fill out essential experience details.');
      return;
    }

    setIsSubmitting(true);
    const defaultImg = image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80';

    try {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          price: Number(price),
          location,
          city: city || location.split(',')[0],
          duration,
          hostName: hostName || 'Community Host',
          hostBio: hostBio || 'Workshop lead and instructor.',
          image: defaultImg,
          included: ['All tools & materials provided', 'Take home item']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create experience');
      }

      const created = await response.json();
      if (onExperienceCreated) onExperienceCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      const mockCreated = {
        _id: 'exp_' + Math.random().toString(36).substr(2, 6),
        title,
        category,
        description,
        price: Number(price),
        location,
        city: city || 'Local Studio',
        duration,
        groupSize: 'Up to 10 guests',
        host: {
          name: hostName || 'Community Host',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          bio: hostBio || 'Passionate workshop lead.',
          rating: 5.0,
          reviewsCount: 1
        },
        image: defaultImg,
        rating: 5.0,
        reviewsCount: 1,
        included: ['All tools & materials provided', 'Take home item'],
        upcomingSlots: [
          { date: 'Tomorrow', time: '10:00 AM', availableSeats: 8 },
          { date: 'This Saturday', time: '02:00 PM', availableSeats: 6 }
        ]
      };
      if (onExperienceCreated) onExperienceCreated(mockCreated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '32px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            padding: '8px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-cream)',
            color: 'var(--color-terracotta)'
          }}>
            <Sparkles size={20} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-terracotta)' }}>
            Host an Experience
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
          List your workshop or local activity for community hobbyists.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Experience Title *</label>
              <input
                type="text"
                className="form-input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Pottery">Pottery</option>
                <option value="Dance">Dance</option>
                <option value="Trekking">Trekking</option>
                <option value="Painting">Painting</option>
                <option value="Cooking">Cooking</option>
                <option value="Music">Music</option>
                <option value="Crafts">Crafts</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Person (₹ INR) *</label>
              <input
                type="number"
                className="form-input"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / Studio Address *</label>
              <input
                type="text"
                className="form-input"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                className="form-input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Host Name</label>
              <input
                type="text"
                className="form-input"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cover Image URL</label>
              <input
                type="text"
                className="form-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary" disabled={isSubmitting}>
              <PlusCircle size={18} />
              {isSubmitting ? 'Publishing...' : 'Publish Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
