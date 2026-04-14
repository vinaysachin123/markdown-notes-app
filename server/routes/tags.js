const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Get all tags for user
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM tags WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Add tag to note
router.post('/note/:noteId', authenticateToken, (req, res) => {
  const { name } = req.body;
  
  // 1. Ensure tag exists or create it
  db.run('INSERT OR IGNORE INTO tags (user_id, name) VALUES (?, ?)', [req.user.id, name], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    // 2. Get tag ID
    db.get('SELECT id FROM tags WHERE user_id = ? AND name = ?', [req.user.id, name], (err, tag) => {
      if (err || !tag) return res.status(500).json({ error: 'Database error' });
      
      // 3. Link tag to note
      db.run('INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)', [req.params.noteId, tag.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Tag added', tagId: tag.id, name });
      });
    });
  });
});

// Remove tag from note
router.delete('/note/:noteId/:tagId', authenticateToken, (req, res) => {
  db.run('DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?', [req.params.noteId, req.params.tagId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Tag removed' });
  });
});

// Get tags for a specific note
router.get('/note/:noteId', authenticateToken, (req, res) => {
  const sql = `
    SELECT t.* FROM tags t
    JOIN note_tags nt ON t.id = nt.tag_id
    WHERE nt.note_id = ?
  `;
  db.all(sql, [req.params.noteId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
