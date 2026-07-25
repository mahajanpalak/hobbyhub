import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import ExperienceCard from './components/ExperienceCard.jsx';
import ExperienceModal from './components/ExperienceModal.jsx';
import HostModal from './components/HostModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import MyBookings from './components/MyBookings.jsx';

import { mockExperiences } from './data/mockExperiences.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'bookings'
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hobbyhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hobbyhub_token') || '');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReasonMessage, setAuthReasonMessage] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modals & Data
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  const openAuthModalWithMessage = (msg = '') => {
    setAuthReasonMessage(msg);
    setIsAuthModalOpen(true);
  };

  // Fetch experiences from API or fallback
  const fetchExperiences = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (selectedCategory && selectedCategory !== 'All') {
        queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (searchTerm) {
        queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
      }
      if (cityFilter) {
        queryParams.push(`city=${encodeURIComponent(cityFilter)}`);
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await fetch(`/api/experiences${queryString}`);

      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.log('Using local fallback data for experiences');
      let filtered = [...mockExperiences];
      if (selectedCategory && selectedCategory !== 'All') {
        filtered = filtered.filter(e => e.category === selectedCategory);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(e => 
          e.title.toLowerCase().includes(term) || 
          e.description.toLowerCase().includes(term) ||
          e.category.toLowerCase().includes(term)
        );
      }
      if (cityFilter) {
        const city = cityFilter.toLowerCase();
        filtered = filtered.filter(e => 
          e.city.toLowerCase().includes(city) || 
          e.location.toLowerCase().includes(city)
        );
      }
      setExperiences(filtered);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.log('Bookings state using local memory');
    }
  };

  useEffect(() => {
    fetchExperiences();
    fetchBookings();
  }, [selectedCategory]);

  const handleSearch = () => {
    fetchExperiences();
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('hobbyhub_token', data.token);
    localStorage.setItem('hobbyhub_user', JSON.stringify(data.user));
    setAuthReasonMessage('');
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('hobbyhub_token');
    localStorage.removeItem('hobbyhub_user');
  };

  const handleBookingSuccess = (newBooking) => {
    setBookings([newBooking, ...bookings]);
  };

  const handleExperienceCreated = (newExperience) => {
    setExperiences([newExperience, ...experiences]);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
    setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHostModal={() => setIsHostModalOpen(true)}
        onOpenAuthModal={openAuthModalWithMessage}
        user={user}
        onLogout={handleLogout}
        bookingsCount={bookings.filter(b => b.status !== 'Cancelled').length}
      />

      {/* Main Content View */}
      {activeTab === 'explore' ? (
        <main style={{ flex: 1, paddingBottom: '60px' }}>
          {/* Hero Banner with search */}
          <Hero
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            onSearch={handleSearch}
          />

          {/* Category Pills Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Experience Cards Grid */}
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--color-terracotta)' }}>
                {selectedCategory === 'All' ? 'Featured Experiences' : `${selectedCategory} Workshops`}
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing {experiences.length} experience(s)
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading handpicked experiences...
              </div>
            ) : experiences.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                  No experiences found
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Try resetting your category filter or search keywords.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchTerm('');
                    setCityFilter('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '28px'
              }}>
                {experiences.map((experience, idx) => (
                  <ExperienceCard
                    key={experience._id || idx}
                    experience={experience}
                    onClick={() => setSelectedExperience(experience)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      ) : (
        /* My Bookings View */
        <main style={{ flex: 1, paddingBottom: '60px' }}>
          <MyBookings
            bookings={bookings}
            user={user}
            onOpenAuthModal={openAuthModalWithMessage}
            onCancelBooking={handleCancelBooking}
          />
        </main>
      )}

      {/* Experience Details & Booking Modal */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          user={user}
          onClose={() => setSelectedExperience(null)}
          onBookingSuccess={handleBookingSuccess}
          onOpenAuthModal={openAuthModalWithMessage}
        />
      )}

      {/* Host Experience Modal */}
      {isHostModalOpen && (
        <HostModal
          user={user}
          onClose={() => setIsHostModalOpen(false)}
          onExperienceCreated={handleExperienceCreated}
        />
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          authReasonMessage={authReasonMessage}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        padding: '24px 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>© {new Date().getFullYear()} HobbyHub • Book Experiences, Not Homes</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Pottery</span>
            <span>•</span>
            <span>Dance</span>
            <span>•</span>
            <span>Trekking</span>
            <span>•</span>
            <span>Painting</span>
            <span>•</span>
            <span>Cooking</span>
          </div>
          <div>Crafted with care</div>
        </div>
      </footer>
    </div>
  );
}
