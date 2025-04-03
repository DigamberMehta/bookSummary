import mongoose from 'mongoose';

const userBookProgressSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  pagesRead: { type: Number, default: 0 },  // Total pages read in this book
  lastReadPage: { type: Number, default: 0 },  // Bookmark feature
  completed: { type: Boolean, default: false }, // Has the user finished the book?
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  booksRead: [userBookProgressSchema], // Track progress for each book
  totalPagesRead: { type: Number, default: 0 }, // Overall pages read
  favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // List of favorite books
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  knowledgeScores: {
    type: Map,
    of: new mongoose.Schema({
      score: { type: Number, default: 0 },
      subcategories: {
        type: Map,
        of: { type: Number, default: 0 },
      },
    }),
    default: {},
  },
});

// Create and export model
export default mongoose.model('User', userSchema);