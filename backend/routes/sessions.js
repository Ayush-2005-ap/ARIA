const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/sessions/:user_id
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `
      SELECT s.*, COUNT(m.id) as msg_count 
      FROM sessions s 
      LEFT JOIN messages m ON s.id = m.session_id 
      WHERE s.user_id = ?
      GROUP BY s.id
      ORDER BY s.last_active DESC
    `;
    const [sessions] = await db.query(query, [user_id]);
    res.json(sessions);
  } catch (error) {
    console.error('Error in GET /api/sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sessions
router.post('/', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const [result] = await db.query(
      'INSERT INTO sessions (user_id, title) VALUES (?, ?)',
      [user_id, 'New Chat']
    );
    res.status(201).json({ session_id: result.insertId });
  } catch (error) {
    console.error('Error in POST /api/sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM sessions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
