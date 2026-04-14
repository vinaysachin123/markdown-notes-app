const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

// Get all versions for a note
router.get('/:noteId', authenticateToken, (req, res) => {
  const sql = `
    SELECT nv.* FROM note_versions nv
    JOIN notes n ON nv.note_id = n.id
    WHERE n.id = ? AND n.user_id = ?
    ORDER BY nv.created_at DESC
  `;
  db.all(sql, [req.params.noteId, req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Restore a version
router.post('/:versionId/restore', authenticateToken, (req, res) => {
  const findVersionSql = `
    SELECT nv.content, nv.note_id FROM note_versions nv
    JOIN notes n ON nv.note_id = n.id
    WHERE nv.id = ? AND n.user_id = ?
  `;
  
  db.get(findVersionSql, [req.params.versionId, req.user.id], (err, version) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!version) return res.status(404).json({ error: 'Version not found' });

    const updateNoteSql = 'UPDATE notes SET content = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(updateNoteSql, [version.content, version.note_id], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Note restored', content: version.content });
    });
  });
});

module.exports = router;
