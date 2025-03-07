import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import  authenticateUser  from '../middlewares/authenticateUser.js';
import User from '../models/user.model.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);

router.get('/profile', authenticateUser, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');  // Exclude sensitive fields like password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;