import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, Edit3, Type, Clock } from 'lucide-react';

import useDebounce from '../hooks/useDebounce';
import HistorySidebar from './HistorySidebar';
import TagManager from './TagManager';

export default function EditorPane({ note, onSave, isSaving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  useEffect(() => {
    if (note && (debouncedTitle !== note.title || debouncedContent !== note.content)) {
      onSave({ title: debouncedTitle, content: debouncedContent });
    }
  }, [debouncedTitle, debouncedContent]);

  const handleRestore = (newContent) => {
    setContent(newContent);
    onSave({ title, content: newContent });
  };

  if (!note) {
    return (
      <div className="no-note-selected">
        <Type size={48} color="#cbd5e1" />
        <p>Select a note or create a new one to start writing</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <header className="editor-header">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <input 
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
          />
          <TagManager noteId={note.id} />
        </div>
        <div className="header-actions">
          <span className={`save-indicator ${isSaving ? 'active' : ''}`}>
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
          <button 
            className={`history-btn ${isHistoryOpen ? 'active' : ''}`}
            onClick={() => setIsHistoryOpen(true)}
            title="Version History"
          >
            <Clock size={18} />
          </button>
          <div className="view-toggle">
            <button 
              className={viewMode === 'edit' ? 'active' : ''} 
              onClick={() => setViewMode('edit')}
              title="Edit Mode"
            >
              <Edit3 size={18} />
            </button>
            <button 
              className={viewMode === 'split' ? 'active' : ''} 
              onClick={() => setViewMode('split')}
              title="Split Mode"
            >
              <Type size={18} />
            </button>
            <button 
              className={viewMode === 'preview' ? 'active' : ''} 
              onClick={() => setViewMode('preview')}
              title="Preview Mode"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="editor-container">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="editor-pane">
            <textarea
              className="markdown-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing markdown..."
            />
          </div>
        )}
        
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="preview-pane">
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*No content yet...*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <HistorySidebar 
        noteId={note.id} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        onRestore={handleRestore}
      />

      <style jsx>{`
        .no-note-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          gap: 1rem;
        }
        .editor-header {
          min-height: calc(var(--header-height) + 40px);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-color);
        }
        .title-input {
          border: none;
          background: transparent;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-color);
          outline: none;
          width: 100%;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 5px;
        }
        .history-btn {
          background: transparent;
          color: #94a3b8;
          padding: 8px;
        }
        .history-btn:hover, .history-btn.active {
          color: var(--accent-color);
          background: var(--sidebar-bg);
        }
        .save-indicator {
          font-size: 0.8rem;
          color: #94a3b8;
          opacity: 0.7;
        }
        .save-indicator.active {
          color: var(--accent-color);
          font-weight: 500;
        }
        .view-toggle {
          display: flex;
          background: var(--sidebar-bg);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }
        .view-toggle button {
          padding: 6px 10px;
          background: transparent;
          color: #94a3b8;
          border-radius: 8px;
        }
        .view-toggle button.active {
          background: white;
          color: var(--accent-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        [data-theme='dark'] .view-toggle button.active {
          background: var(--border-color);
          color: white;
        }
        .preview-pane {
          padding: 2rem;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
