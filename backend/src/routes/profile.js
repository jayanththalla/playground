import express from 'express';
import Profile from '../models/Profile.js';
import { writeRateLimit } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /api/profile - Get profile data
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profile - Create profile (rate limited)
router.post('/', writeRateLimit, async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists. Use PUT to update.' });
    }
    
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile - Update profile (rate limited)
router.put('/', writeRateLimit, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/profile - Delete profile (rate limited)
router.delete('/', writeRateLimit, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;