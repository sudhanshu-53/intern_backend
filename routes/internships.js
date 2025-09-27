// FILE: routes/internships.js
import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

// Get all internships (public endpoint)
router.get('/', (req, res) => {
  db.all('SELECT * FROM internships ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch internships' });
    }

    // Parse JSON fields
    const internships = rows.map(row => ({
      ...row,
      required_skills: JSON.parse(row.required_skills || '[]'),
      interests: JSON.parse(row.interests || '[]'),
      education_levels: JSON.parse(row.education_levels || '[]')
    }));

    res.json(internships);
  });
});

export default router;
