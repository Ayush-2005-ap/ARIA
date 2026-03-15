const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// POST /api/users
// Register a new device or get existing user
router.post('/', async (req, res) => {
  try {
    const { device_id, name } = req.body;
    
    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE device_id = ?', [device_id]);
    
    if (existing.length > 0) {
      return res.json({ user_id: existing[0].id });
    }

    // Create new user
    const [result] = await db.query(
      'INSERT INTO users (device_id, name) VALUES (?, ?)',
      [device_id, name || 'User']
    );
    
    res.status(201).json({ user_id: result.insertId });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
