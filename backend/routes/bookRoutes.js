import express from 'express';
import Book from '../models/Book.js';
import User from '../models/user.model.js'; // Import the User model
import authenticateUser from '../middlewares/authenticateUser.js'; // Import the authentication middleware

const router = express.Router();

// Create a new book with initial pages and optional category/subcategory
router.post('/api/books', async (req, res) => {
  try {
    const { pages, category, subcategory } = req.body;
    const bookData = {
      pages: pages,
    };
    if (category) {
      bookData.category = category;
    }
    if (subcategory) {
      bookData.subcategory = subcategory;
    }

    const book = await Book.create(bookData);
    res.json({ success: true, bookId: book._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add to your book routes (e.g., routes/bookRoutes.js)
router.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({}, 'title coverPage category subcategory'); // Include category and subcategory in the fields returned
    res.json({ success: true, books });
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
    const { title, coverPage, endCoverPage, category, subcategory } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (coverPage !== undefined) updates.coverPage = coverPage;
    if (endCoverPage !== undefined) updates.endCoverPage = endCoverPage;
    if (category !== undefined) updates.category = category;
    if (subcategory !== undefined) updates.subcategory = subcategory;

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

router.patch('/api/books/:bookId/start-reading', authenticateUser, async (req, res) => {
  
  try {
    const bookId = req.params.bookId;
    const userId = req.userId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const category = book.category || 'Other';
    const subcategory = book.subcategory || '';

    const categoryScore = user.knowledgeScores.get(category)?.score || 0;
    const subcategoryScore = user.knowledgeScores.get(category)?.subcategories?.get(subcategory) || 0;

    console.log(`User ID: ${userId}, Book ID: ${bookId} - Before start reading: Category Score=${categoryScore}, Subcategory Score=${subcategoryScore}`);

    user.knowledgeScores.set(category, {
      score: categoryScore + 0.5,
      subcategories: new Map(user.knowledgeScores.get(category)?.subcategories).set(subcategory, subcategoryScore + 1),
    });

    await user.save();

    const updatedCategoryScore = user.knowledgeScores.get(category)?.score;
    const updatedSubcategoryScore = user.knowledgeScores.get(category)?.subcategories?.get(subcategory);

    console.log(`User ID: ${userId}, Book ID: ${bookId} - After start reading: Category Score=${updatedCategoryScore}, Subcategory Score=${updatedSubcategoryScore}`);

    res.json({ success: true, message: 'Book reading started, user knowledge score updated.' });
  } catch (error) {
    console.error('Error starting to read book (user-specific):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to handle when a user completes reading a book
router.patch('/api/books/:bookId/complete-reading', authenticateUser, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.userId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const category = book.category || 'Other';
    const subcategory = book.subcategory || '';

    const categoryScore = user.knowledgeScores.get(category)?.score || 0;
    const subcategoryScore = user.knowledgeScores.get(category)?.subcategories?.get(subcategory) || 0;

    console.log(`User ID: ${userId}, Book ID: ${bookId} - Before complete reading: Category Score=${categoryScore}, Subcategory Score=${subcategoryScore}`);

    user.knowledgeScores.set(category, {
      score: categoryScore + 1,
      subcategories: new Map(user.knowledgeScores.get(category)?.subcategories).set(subcategory, subcategoryScore + 2),
    });

    await user.save();

    const updatedCategoryScore = user.knowledgeScores.get(category)?.score;
    const updatedSubcategoryScore = user.knowledgeScores.get(category)?.subcategories?.get(subcategory);

    console.log(`User ID: ${userId}, Book ID: ${bookId} - After complete reading: Category Score=${updatedCategoryScore}, Subcategory Score=${updatedSubcategoryScore}`);

    res.json({ success: true, message: 'Book reading completed, user knowledge score updated.' });
  } catch (error) {
    console.error('Error completing reading book (user-specific):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;