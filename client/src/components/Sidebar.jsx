import React, { useState } from 'react';
import { Plus, Search, Trash2, LogOut, Moon, Sun, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  notes, 
  onNoteSelect, 
  activeNoteId, 
  onNoteCreate, 
  onNoteDelete, 
  searchTerm, 
  setSearchTerm,
  theme,
  toggleTheme 
}) {
  const { logout, user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>My Notes</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleTheme} className="icon-btn">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={onNoteCreate} className="icon-btn primary">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="search-container" style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state">No notes found</div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => onNoteSelect(note)}
            >
              <div className="note-item-content">
                <span className="note-title">{note.title || 'Untitled'}</span>
                <span className="note-date">
                  {new Date(note.last_modified).toLocaleDateString()}
                </span>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteDelete(note.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <span>{user?.username}</span>
        </div>
        <button onClick={logout} className="logout-btn">
          <LogOut size={16} />
        </button>
      </div>

      <style jsx>{`
        .icon-btn {
          background: var(--border-color);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
        }
        .icon-btn.primary {
          background: var(--accent-color);
          color: white;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 8px 12px;
          border-radius: var(--radius);
          border: 1px solid var(--border-color);
        }
        [data-theme='dark'] .search-box {
          background: var(--bg-color);
        }
        .search-box input {
          border: none;
          background: transparent;
          width: 100%;
          outline: none;
          color: var(--text-color);
          font-size: 0.9rem;
        }
        .notes-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .note-item {
          padding: 1rem 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-left: 4px solid transparent;
        }
        .note-item:hover {
          background: hsla(var(--primary-h), 47%, 95%, 0.5);
        }
        [data-theme='dark'] .note-item:hover {
          background: hsla(var(--primary-h), 47%, 15%, 0.5);
        }
        .note-item.active {
          background: hsla(var(--primary-h), 83%, 53%, 0.1);
          border-left-color: var(--accent-color);
        }
        .note-item-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }
        .note-title {
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .note-date {
          font-size: 0.75rem;
          color: #64748b;
        }
        .delete-btn {
          background: transparent;
          color: #ef4444;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .note-item:hover .delete-btn {
          opacity: 1;
        }
        .empty-state {
          text-align: center;
          margin-top: 2rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar {
          width: 32px;
          height: 32px;
          background: var(--accent-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .logout-btn {
          background: transparent;
          color: var(--text-color);
          padding: 8px;
        }
        .logout-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }
      `}</style>
    </aside>
  );
}
