import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Pottery', 'Dance', 'Trekking', 'Painting', 'Cooking', 'Music', 'Crafts']
  },
  price: { type: Number, required: true }, // price per person in USD/INR
  location: { type: String, required: true },
  city: { type: String, required: true },
  duration: { type: String, required: true }, // e.g. "2 hours", "Full Day"
  groupSize: { type: String, default: "Up to 10 people" },
  host: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    bio: { type: String, default: "Passionate artisan & guide." },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 24 }
  },
  image: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 18 },
  included: [{ type: String }], // e.g. ["All materials", "Take home creation", "Refreshments"]
  upcomingSlots: [{
    date: { type: String, required: true },
    time: { type: String, required: true },
    availableSeats: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Experience', experienceSchema);
