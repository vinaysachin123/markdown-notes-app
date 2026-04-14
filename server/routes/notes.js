const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Get all notes for the logged-in user
router.get('/', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM notes WHERE user_id = ? ORDER BY last_modified DESC';
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Get a single note
router.get('/:id', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM notes WHERE id = ? AND user_id = ?';
  db.get(sql, [req.params.id, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Note not found' });
    res.json(row);
  });
});

// Create a new note
router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const sql = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
  db.run(sql, [req.user.id, title, content || ''], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: this.lastID, title, content, user_id: req.user.id });
  });
});

// Update a note
router.put('/:id', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const sql = 'UPDATE notes SET title = ?, content = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
  
  db.run(sql, [title, content, req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
    res.json({ message: 'Note updated' });
  });
});

// Delete a note
router.delete('/:id', authenticateToken, (req, res) => {
  const sql = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
  db.run(sql, [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
    res.json({ message: 'Note deleted' });
  });
});

// Search notes (Bonus)
router.get('/search/:query', authenticateToken, (req, res) => {
  const query = `%${req.params.query}%`;
  const sql = 'SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY last_modified DESC';
  db.all(sql, [req.user.id, query, query], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
