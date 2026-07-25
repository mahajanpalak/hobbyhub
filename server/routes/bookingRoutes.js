import express from 'express';
import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';

const router = express.Router();

// GET user bookings (optionally filter by email)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.userEmail = email;
    }
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  try {
    const {
      experienceId,
      userName,
      userEmail,
      userPhone,
      date,
      time,
      guests
    } = req.body;

    if (!experienceId || !userName || !userEmail || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const guestCount = Number(guests) || 1;
    const totalPrice = experience.price * guestCount;

    const newBooking = new Booking({
      experienceId,
      experienceTitle: experience.title,
      experienceImage: experience.image,
      userName,
      userEmail,
      userPhone: userPhone || '',
      date,
      time,
      guests: guestCount,
      totalPrice,
      status: 'Confirmed'
    });

    const savedBooking = await newBooking.save();

    // Deduct available seats for slot if matching
    const slotIndex = experience.upcomingSlots.findIndex(
      s => s.date === date && s.time === time
    );
    if (slotIndex !== -1) {
      experience.upcomingSlots[slotIndex].availableSeats = Math.max(
        0,
        experience.upcomingSlots[slotIndex].availableSeats - guestCount
      );
      await experience.save();
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// PATCH cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
});

export default router;
