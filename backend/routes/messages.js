const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/messages/:session_id
router.get('/:session_id', async (req, res) => {
    try {
        const { session_id } = req.params;
        const [messages] = await db.query(
            'SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC',
            [session_id]
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
