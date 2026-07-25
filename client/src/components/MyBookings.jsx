import React from 'react';
import { Calendar, Ticket, XCircle, CheckCircle, LogIn } from 'lucide-react';

export default function MyBookings({ bookings, user, onOpenAuthModal, onCancelBooking }) {
  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream)',
          color: 'var(--color-terracotta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <LogIn size={36} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
          Log In to View Your Bookings
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px auto' }}>
          Please log in or sign up to manage your upcoming workshops, tickets, and reservations.
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => onOpenAuthModal('Please log in to view your bookings.')}
          style={{ padding: '12px 28px' }}
        >
          <LogIn size={18} />
          <span>Log In / Sign Up</span>
        </button>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-cream)',
          color: 'var(--color-terracotta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <Ticket size={36} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
          No Bookings Found Yet
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px auto' }}>
          Explore unique pottery, dance, trekking, painting, and cooking experiences to start building unforgettable memories.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
        My Booked Experiences ({bookings.length})
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
        View and manage your upcoming masterclasses and local group adventures.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {bookings.map((booking) => {
          const isCancelled = booking.status === 'Cancelled';

          return (
            <div key={booking._id || booking.bookingReference} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={booking.experienceImage || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop&q=80'}
                  alt={booking.experienceTitle}
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span className={`badge ${isCancelled ? 'badge-taupe' : 'badge-cyan'}`}>
                      {isCancelled ? (
                        <><XCircle size={12} /> Cancelled</>
                      ) : (
                        <><CheckCircle size={12} /> Confirmed</>
                      )}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                      {booking.bookingReference}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', color: 'var(--color-terracotta)', lineHeight: 1.3 }}>
                    {booking.experienceTitle}
                  </h3>
                </div>
              </div>

              <div style={{
                backgroundColor: '#FAF8F5',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.86rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                  <Calendar size={14} color="var(--color-taupe)" />
                  <strong>Date & Time:</strong> {booking.date} at {booking.time}
                </div>
                <div><strong>Guest(s):</strong> {booking.guests} Person(s)</div>
                <div><strong>Booked for:</strong> {booking.userName} ({booking.userEmail})</div>
                <div><strong>Total Amount:</strong> <span style={{ fontWeight: 800, color: 'var(--color-terracotta)' }}>₹{booking.totalPrice?.toLocaleString()}</span></div>
              </div>

              {!isCancelled && (
                <button
                  className="btn btn-outline"
                  onClick={() => onCancelBooking(booking._id)}
                  style={{ width: '100%', fontSize: '0.82rem', borderColor: 'var(--color-taupe)', color: 'var(--text-muted)' }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
