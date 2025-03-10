import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Create a new book with initial pages
router.post('/api/books', async (req, res) => {
  try {
    const book = await Book.create({
      pages: req.body.pages,
    });
    res.json({ success: true, bookId: book._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update page summary (audio removed)
router.patch('/api/books/:bookId/page/:pageNumber', async (req, res) => {
  try {
    const update = {};
    // Only allow summary updates
    if (req.body.summary) update['pages.$.summary'] = req.body.summary;

    const book = await Book.findOneAndUpdate(
      { _id: req.params.bookId, 'pages.pageNumber': parseInt(req.params.pageNumber) },
      { $set: update },
      { new: true }
    );

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch book by ID
router.get('/api/books/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Update book metadata (title/covers)
router.patch('/api/books/:bookId', async (req, res) => {
  try {
    const { title, coverPage, endCoverPage } = req.body;
    const updates = {};
    
    if (title !== undefined) updates.title = title;
    if (coverPage !== undefined) updates.coverPage = coverPage;
    if (endCoverPage !== undefined) updates.endCoverPage = endCoverPage;

    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { $set: updates },
      { new: true }
    );

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;



