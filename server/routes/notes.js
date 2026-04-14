const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Get all notes for the logged-in user (with Pagination and Sorting)
router.get('/', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const sortBy = req.query.sortBy || 'last_modified';
  const order = req.query.order || 'DESC';

  // Validate sort parameters to prevent SQL injection
  const allowedSorts = ['last_modified', 'title'];
  const finalSort = allowedSorts.includes(sortBy) ? sortBy : 'last_modified';
  const finalOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const sql = `
    SELECT * FROM notes 
    WHERE user_id = ? 
    ORDER BY ${finalSort} ${finalOrder}
    LIMIT ? OFFSET ?
  `;
  
  db.all(sql, [req.user.id, limit, offset], (err, rows) => {
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
  
  // 1. Create a version snapshot of the CURRENT content before updating
  const getOldContentSql = 'SELECT content FROM notes WHERE id = ? AND user_id = ?';
  db.get(getOldContentSql, [req.params.id, req.user.id], (err, row) => {
    if (row && row.content !== content) {
      db.run('INSERT INTO note_versions (note_id, content) VALUES (?, ?)', [req.params.id, row.content]);
    }

    // 2. Update the note
    const sql = 'UPDATE notes SET title = ?, content = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
    db.run(sql, [title, content, req.params.id, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
      res.json({ message: 'Note updated' });
    });
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
