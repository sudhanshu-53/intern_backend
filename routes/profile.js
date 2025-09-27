// FILE: routes/profile.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_data: JSON.parse(user.profile_data || '{}')
    };

    res.json(profile);
  });
});

// Update user profile
router.put('/', authenticateToken, (req, res) => {
  const profileData = JSON.stringify(req.body);

  db.run(
    'UPDATE users SET profile_data = ? WHERE id = ?',
    [profileData, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      // Fetch updated profile
      db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const profile = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profile_data: JSON.parse(user.profile_data || '{}')
        };

        res.json({
          success: true,
          profile
        });
      });
    }
  );
});

export default router;
