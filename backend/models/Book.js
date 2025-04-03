// models/Book.js
import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageNumber: { type: Number, required: true },
  text: { type: String, required: true },
  summary: String,
  audio: String, // Base64 string for audio
});

const bookSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Book" }, // Initially empty string
  coverPage: { type: String, default: "https://miblart.com/wp-content/uploads/2020/08/ZXAfJR0M-663x1024-1.jpg" }, // Default cover image
  endCoverPage: { type: String, default: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80" }, // Default end cover image
  pages: [pageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: String }, // Added category field
  subcategory: { type: String }, // Added subcategory field
});

export default mongoose.model('Book', bookSchema);