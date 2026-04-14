import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RotateCcw, x, Clock, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function HistorySidebar({ noteId, isOpen, onClose, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && noteId) {
      fetchVersions();
    }
  }, [isOpen, noteId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/versions/${noteId}`);
      setVersions(response.data);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm('Are you sure you want to restore this version? Current changes will be saved to history.')) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/versions/${versionId}/restore`);
      onRestore(response.data.content);
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="history-overlay">
      <div className="history-panel">
        <div className="history-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} />
            <h3>Version History</h3>
          </div>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>

        <div className="history-list">
          {loading ? (
            <div className="loading">Loading history...</div>
          ) : versions.length === 0 ? (
            <div className="empty-history">No previous versions found.</div>
          ) : (
            versions.map(v => (
              <div key={v.id} className="version-item">
                <div className="version-info">
                  <span className="version-date">
                    {new Date(v.created_at).toLocaleString()}
                  </span>
                  <p className="version-snippet">
                    {v.content?.substring(0, 60)}...
                  </p>
                </div>
                <button 
                  onClick={() => handleRestore(v.id)} 
                  className="restore-btn"
                  title="Restore this version"
                >
                  <RotateCcw size={16} />
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .history-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .history-panel {
          width: 350px;
          background: var(--bg-color);
          height: 100%;
          box-shadow: -5px 0 15px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .history-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .version-item {
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.2s;
        }
        .version-item:hover {
          background: var(--sidebar-bg);
        }
        .version-date {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-color);
        }
        .version-snippet {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 5px;
        }
        .restore-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-color);
          color: white;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .restore-btn:hover {
          background: var(--accent-hover);
        }
        .empty-history {
          text-align: center;
          color: #94a3b8;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
