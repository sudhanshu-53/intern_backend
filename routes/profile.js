// FILE: routes/profile.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = JSON.parse(user.profile_data || '{}');
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      hasCompletedOnboarding: profileData.hasCompletedOnboarding || false,
      ...profileData
    };

    res.json(profile);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
router.put('/', authenticateToken, (req, res) => {
  try {
    const profileData = {
      ...req.body,
      hasCompletedOnboarding: true // Set to true whenever profile is updated
    };

    const updateStmt = db.prepare('UPDATE users SET profile_data = ? WHERE id = ?');
    updateStmt.run(JSON.stringify(profileData), req.user.userId);

    // Fetch updated profile
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      ...profileData
    };

    res.json(updatedProfile);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
