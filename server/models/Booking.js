import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  experienceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experience', 
    required: true 
  },
  experienceTitle: { type: String, required: true },
  experienceImage: { type: String },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Completed', 'Cancelled'], 
    default: 'Confirmed' 
  },
  bookingReference: { 
    type: String, 
    default: () => 'HH-' + Math.random().toString(36).substr(2, 7).toUpperCase() 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
