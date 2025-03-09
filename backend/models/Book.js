// models/Book.js
import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageNumber: { type: Number, required: true },
  text: { type: String, required: true },
  summary: String,
  audio: String, // Base64 string for audio
});

const bookSchema = new mongoose.Schema({
  pages: [pageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Book', bookSchema);