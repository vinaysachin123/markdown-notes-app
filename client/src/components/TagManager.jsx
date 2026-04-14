import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag as TagIcon, X, Plus } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function TagManager({ noteId }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (noteId) {
      fetchTags();
    }
  }, [noteId]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tags/note/${noteId}`);
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const addTag = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!inputValue.trim()) return;

      try {
        await axios.post(`${API_BASE_URL}/tags/note/${noteId}`, { name: inputValue.trim() });
        setInputValue('');
        fetchTags();
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const removeTag = async (tagId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tags/note/${noteId}/${tagId}`);
      fetchTags();
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  return (
    <div className="tag-manager">
      <div className="tags-list">
        {tags.map(tag => (
          <span key={tag.id} className="tag-badge">
            <TagIcon size={12} />
            {tag.name}
            <button onClick={() => removeTag(tag.id)} className="remove-tag">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="tag-input-wrapper">
        <input 
          type="text" 
          placeholder="Add tags..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addTag}
        />
        <button onClick={addTag} className="add-tag-btn"><Plus size={14} /></button>
      </div>

      <style jsx>{`
        .tag-manager {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
        }
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tag-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--sidebar-bg);
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-color);
        }
        .remove-tag {
          background: transparent;
          color: #94a3b8;
          padding: 0;
          display: flex;
        }
        .remove-tag:hover {
          color: #ef4444;
        }
        .tag-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--sidebar-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2px 8px;
        }
        .tag-input-wrapper input {
          border: none;
          background: transparent;
          font-size: 0.75rem;
          outline: none;
          padding: 4px;
          width: 80px;
          color: var(--text-color);
        }
        .add-tag-btn {
          background: transparent;
          color: var(--accent-color);
          padding: 0;
        }
      `}</style>
    </div>
  );
}
