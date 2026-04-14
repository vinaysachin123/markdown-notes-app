import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import EditorPane from './components/EditorPane';
import Auth from './components/Auth';
import useDebounce from './hooks/useDebounce';

function App() {
  const { token, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Theme support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Fetch notes
  const fetchNotes = async (query = '') => {
    if (!token) return;
    try {
      const url = query ? `http://localhost:5000/api/notes/search/${query}` : 'http://localhost:5000/api/notes';
      const response = await axios.get(url);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    if (token) fetchNotes(searchTerm);
  }, [token, searchTerm]);

  // Create note
  const createNote = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/notes', {
        title: 'Untitled Note',
        content: ''
      });
      const newNote = response.data;
      setNotes([newNote, ...notes]);
      setActiveNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      if (activeNote?.id === id) setActiveNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Update note
  const updateNote = async (id, data) => {
    setIsSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/notes/${id}`, data);
      setNotes(notes.map(n => n.id === id ? { ...n, ...data, last_modified: new Date().toISOString() } : n));
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!token) return <Auth />;

  return (
    <div className="app-layout">
      <Sidebar 
        notes={notes}
        activeNoteId={activeNote?.id}
        onNoteSelect={setActiveNote}
        onNoteCreate={createNote}
        onNoteDelete={deleteNote}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <EditorPane 
        note={activeNote} 
        onSave={(data) => updateNote(activeNote.id, data)}
        isSaving={isSaving}
      />

      <style jsx>{`
        .loading-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
}

export default App;
