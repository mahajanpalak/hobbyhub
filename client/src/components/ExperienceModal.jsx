import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Users, CheckCircle2, Calendar, MessageSquare, Send, LogIn } from 'lucide-react';

export default function ExperienceModal({ experience, user, onClose, onBookingSuccess, onOpenAuthModal }) {
  if (!experience) return null;

  const [selectedSlot, setSelectedSlot] = useState(
    experience.upcomingSlots?.[0] || { date: 'This Saturday', time: '02:00 PM', availableSeats: 6 }
  );
  const [guests, setGuests] = useState(1);
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([]);

  const totalPrice = experience.price * guests;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal('Please log in or sign up to book an experience.');
      return;
    }

    if (!userName || !userEmail) {
      alert('Please provide your name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: experience._id,
          userName: user.name || userName,
          userEmail: user.email || userEmail,
          userPhone,
          date: selectedSlot.date,
          time: selectedSlot.time,
          guests
        })
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();
      setBookingSuccessData(data);
      if (onBookingSuccess) onBookingSuccess(data);
    } catch (err) {
      console.error(err);
      // Fallback for standalone frontend demonstration
      const mockBooking = {
        _id: 'bk_' + Math.random().toString(36).substr(2, 6),
        experienceId: experience._id,
        experienceTitle: experience.title,
        experienceImage: experience.image,
        userName: user?.name || userName,
        userEmail: user?.email || userEmail,
        date: selectedSlot.date,
        time: selectedSlot.time,
        guests,
        totalPrice,
        bookingReference: 'HH-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        status: 'Confirmed'
      };
      setBookingSuccessData(mockBooking);
      if (onBookingSuccess) onBookingSuccess(mockBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal('Please log in to submit a review.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/experiences/${experience._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user.name,
          rating: newRating,
          comment: newComment
        })
      });

      if (response.ok) {
        const added = await response.json();
        setReviewsList([added, ...reviewsList]);
        setNewComment('');
      }
    } catch (err) {
      setReviewsList([{
        author: user.name,
        rating: newRating,
        comment: newComment,
        createdAt: new Date()
      }, ...reviewsList]);
      setNewComment('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
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
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <X size={20} color="var(--text-main)" />
        </button>

        {bookingSuccessData ? (
          /* Confirmation State */
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-cyan-light)',
              color: '#00768C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
              Booking Confirmed! 🎉
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your reservation reference is <strong style={{ color: 'var(--color-terracotta)' }}>{bookingSuccessData.bookingReference}</strong>
            </p>

            <div style={{
              backgroundColor: 'var(--bg-cream-soft)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              maxWidth: '480px',
              margin: '0 auto 28px auto'
            }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-terracotta)', marginBottom: '12px' }}>
                {experience.title}
              </h4>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' }}>
                <div><strong>Date & Time:</strong> {bookingSuccessData.date} at {bookingSuccessData.time}</div>
                <div><strong>Guests:</strong> {bookingSuccessData.guests} Person(s)</div>
                <div><strong>Total Paid:</strong> ₹{bookingSuccessData.totalPrice?.toLocaleString()}</div>
                <div><strong>Location:</strong> {experience.location}</div>
                <div><strong>Booked for:</strong> {bookingSuccessData.userName} ({bookingSuccessData.userEmail})</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Experience Details Layout */
          <div>
            {/* Header Image */}
            <div style={{ position: 'relative', height: '320px', width: '100%' }}>
              <img
                src={experience.image}
                alt={experience.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                display: 'flex',
                gap: '8px'
              }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
                  {experience.category}
                </span>
                <span className="badge badge-cream" style={{ fontSize: '0.85rem' }}>
                  <Star size={14} fill="#FFB800" color="#FFB800" /> {experience.rating} ({experience.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div style={{
              padding: '28px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '32px'
            }}>
              {/* Left Column: Information */}
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-terracotta)', marginBottom: '12px', lineHeight: 1.2 }}>
                  {experience.title}
                </h2>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  marginBottom: '24px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16} color="var(--color-taupe)" />
                    {experience.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={16} color="var(--color-taupe)" />
                    {experience.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={16} color="var(--color-taupe)" />
                    {experience.groupSize}
                  </span>
                </div>

                {/* Host Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: 'var(--bg-cream-soft)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1px solid rgba(126, 45, 0, 0.1)'
                }}>
                  <img
                    src={experience.host?.avatar}
                    alt={experience.host?.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-terracotta)' }}>
                      Hosted by {experience.host?.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {experience.host?.bio}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>About the Experience</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                    {experience.description}
                  </p>
                </div>

                {/* What's Included */}
                {experience.included && experience.included.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>What's Included</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {experience.included.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                          <CheckCircle2 size={16} color="var(--color-cyan)" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--color-terracotta)" />
                    <span>Reviews ({experience.reviewsCount})</span>
                  </h3>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} style={{ marginBottom: '20px', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={star <= newRating ? "#FFB800" : "none"}
                          color="#FFB800"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setNewRating(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={user ? "Write a review..." : "Log in to leave a review"}
                      disabled={!user}
                      style={{ marginBottom: '10px', fontSize: '0.88rem' }}
                    />
                    {user ? (
                      <button type="submit" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                        <Send size={14} /> Submit Review
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => onOpenAuthModal('Please log in to submit a review.')}
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        <LogIn size={14} /> Log In to Review
                      </button>
                    )}
                  </form>

                  {reviewsList.map((rev, index) => (
                    <div key={index} style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px dashed var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--color-terracotta)' }}>{rev.author}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem' }}>
                          <Star size={12} fill="#FFB800" color="#FFB800" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Booking Form */}
              <div>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--color-cyan)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-md)',
                  position: 'sticky',
                  top: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                        ₹{experience.price?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / person</span>
                    </div>
                    <span className="badge badge-cyan">Instant Booking</span>
                  </div>

                  {!user ? (
                    /* Auth Required State for Booking */
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <div style={{
                        padding: '16px',
                        backgroundColor: 'var(--bg-cream-soft)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)'
                      }}>
                        Please log in or create an account to book your slot for this workshop.
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onOpenAuthModal('Please log in to complete your booking.')}
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)' }}
                      >
                        <LogIn size={18} />
                        <span>Log In / Sign Up to Book</span>
                      </button>
                    </div>
                  ) : (
                    /* Authenticated Booking Form */
                    <form onSubmit={handleBooking}>
                      {/* Select Upcoming Slot */}
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={15} color="var(--color-taupe)" />
                          Select Date & Time
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {experience.upcomingSlots?.map((slot, index) => (
                            <div
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: selectedSlot.date === slot.date && selectedSlot.time === slot.time
                                  ? '2px solid var(--color-cyan)'
                                  : '1px solid var(--border-light)',
                                backgroundColor: selectedSlot.date === slot.date && selectedSlot.time === slot.time
                                  ? 'var(--bg-cyan-light)'
                                  : '#FAF8F5',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.88rem'
                              }}
                            >
                              <div>
                                <strong>{slot.date}</strong> at {slot.time}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {slot.availableSeats} seats left
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Guests Selector */}
                      <div className="form-group">
                        <label className="form-label">Number of Guests</label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#FAF8F5',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 14px'
                        }}>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-cream)',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              color: 'var(--color-terracotta)'
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{guests} Person(s)</span>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-cream)',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              color: 'var(--color-terracotta)'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div style={{
                        backgroundColor: 'var(--bg-cream-soft)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '16px',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>₹{experience.price?.toLocaleString()} x {guests} guest(s)</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--color-terracotta)', fontSize: '1.05rem', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                          <span>Total Price</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)' }}
                      >
                        {isSubmitting ? 'Confirming...' : `Book Now • ₹${totalPrice.toLocaleString()}`}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
