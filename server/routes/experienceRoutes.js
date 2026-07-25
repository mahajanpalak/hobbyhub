import express from 'express';
import Experience from '../models/Experience.js';
import Review from '../models/Review.js';

const router = express.Router();

// GET all experiences with optional filtering by category, search term, price
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, city } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const experiences = await Experience.find(query).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences', details: error.message });
  }
});

// GET single experience by ID (including reviews)
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    const reviews = await Review.find({ experienceId: req.params.id }).sort({ createdAt: -1 });
    res.json({ experience, reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience details', details: error.message });
  }
});

// POST create new experience (Host experience)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      location,
      city,
      duration,
      groupSize,
      hostName,
      hostBio,
      image,
      included,
      upcomingSlots
    } = req.body;

    if (!title || !description || !category || !price || !location) {
      return res.status(400).json({ error: 'Missing required experience fields' });
    }

    const defaultSlots = upcomingSlots || [
      { date: 'Tomorrow', time: '10:00 AM', availableSeats: 8 },
      { date: 'This Saturday', time: '02:00 PM', availableSeats: 6 },
      { date: 'Next Sunday', time: '11:00 AM', availableSeats: 10 }
    ];

    const newExperience = new Experience({
      title,
      description,
      category,
      price: Number(price),
      location,
      city: city || location.split(',')[0] || 'Local Studio',
      duration: duration || '2 Hours',
      groupSize: groupSize || 'Up to 10 guests',
      host: {
        name: hostName || 'Community Artisan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        bio: hostBio || 'Experienced instructor and enthusiast.',
        rating: 5.0,
        reviewsCount: 1
      },
      image: image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
      images: [
        image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80'
      ],
      rating: 5.0,
      reviewsCount: 1,
      included: included || ['All materials provided', 'Safety equipment', 'Take-home item'],
      upcomingSlots: defaultSlots
    });

    const saved = await newExperience.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create experience', details: error.message });
  }
});

// POST add a review to an experience
router.post('/:id/reviews', async (req, res) => {
  try {
    const { author, rating, comment } = req.body;
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const review = new Review({
      experienceId: req.params.id,
      author: author || 'Anonymous Explorer',
      rating: Number(rating) || 5,
      comment: comment || 'Awesome experience!'
    });

    await review.save();

    // Update experience rating & count
    const allReviews = await Review.find({ experienceId: req.params.id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    experience.rating = Number(avgRating.toFixed(1));
    experience.reviewsCount = allReviews.length;
    await experience.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review', details: error.message });
  }
});

export default router;
