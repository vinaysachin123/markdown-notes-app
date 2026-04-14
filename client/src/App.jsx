import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import EditorPane from './components/EditorPane';
import Auth from './components/Auth';
import useDebounce from './hooks/useDebounce';

const API_BASE_URL = 'https://markdown-notes-app-nnh0.onrender.com/api';

function App() {
  const { token, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('last_modified');
  const [order, setOrder] = useState('DESC');

  // Theme support
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Fetch notes
  const fetchNotes = async (isNewSearch = false) => {
    if (!token) return;
    const currentPage = isNewSearch ? 0 : page;
    const limit = 10;
    const offset = currentPage * limit;

    try {
      const url = searchTerm 
        ? `${API_BASE_URL}/notes/search/${searchTerm}?limit=${limit}&offset=${offset}&sortBy=${sortBy}&order=${order}` 
        : `${API_BASE_URL}/notes?limit=${limit}&offset=${offset}&sortBy=${sortBy}&order=${order}`;
      
      const response = await axios.get(url);
      const newNotes = response.data;

      if (isNewSearch) {
        setNotes(newNotes);
        setPage(1);
      } else {
        setNotes([...notes, ...newNotes]);
        setPage(currentPage + 1);
      }
      
      setHasMore(newNotes.length === limit);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchNotes(true);
  }, [token, searchTerm, sortBy, order]);

  const loadMore = () => {
    if (hasMore) fetchNotes();
  };

  // Create note
  const createNote = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, {
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
      await axios.delete(`${API_BASE_URL}/notes/${id}`);
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
      await axios.put(`${API_BASE_URL}/notes/${id}`, data);
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
        loadMore={loadMore}
        hasMore={hasMore}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
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
