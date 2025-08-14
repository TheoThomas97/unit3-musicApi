
import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../auth/AuthContext';

export default function Playlists() {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showSongsModal, setShowSongsModal] = useState(false);

  
  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await api.get('/playlists');
      setPlaylists(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

 
  const loadSongs = async () => {
    try {
      const res = await api.get('/songs');
      setSongs(res.data.items || res.data);
    } catch (e) {
      console.error('Failed to load songs:', e);
    }
  };

  useEffect(() => {
    if (token) {
      loadPlaylists();
      loadSongs();
    }
  }, [token]);

  
  const createPlaylist = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/playlists', form);
      setPlaylists([...playlists, res.data]);
      setForm({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to create playlist');
    }
  };

  
  const updatePlaylist = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put(`/playlists/${editingPlaylist._id}`, form);
      setPlaylists(playlists.map(p => p._id === editingPlaylist._id ? res.data : p));
      setForm({ name: '', description: '' });
      setEditingPlaylist(null);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to update playlist');
    }
  };

  
  const deletePlaylist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter(p => p._id !== id));
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to delete playlist');
    }
  };

  
  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const res = await api.post(`/playlists/${playlistId}/songs`, { songId });
      setPlaylists(playlists.map(p => p._id === playlistId ? res.data : p));
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(res.data);
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to add song to playlist');
    }
  };

  
  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
      setPlaylists(playlists.map(p => p._id === playlistId ? res.data : p));
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(res.data);
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to remove song from playlist');
    }
  };

  
  const startEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setForm({ name: playlist.name, description: playlist.description || '' });
    setShowCreateForm(false);
  };

 
  const cancelEdit = () => {
    setEditingPlaylist(null);
    setForm({ name: '', description: '' });
  };

  
  const showSongs = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowSongsModal(true);
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Playlists</h2>
        <p>Please log in to view your playlists.</p>
      </div>
    );
  }

  if (loading) return <div style={{ padding: 20 }}>Loading playlists...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>My Playlists</h2>
        <button 
          onClick={() => {
            setShowCreateForm(true);
            setEditingPlaylist(null);
            setForm({ name: '', description: '' });
          }}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
        >
          Create Playlist
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {}
      {(showCreateForm || editingPlaylist) && (
        <form 
          onSubmit={editingPlaylist ? updatePlaylist : createPlaylist}
          style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 20,
            display: 'grid',
            gap: 12
          }}
        >
          <h3>{editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}</h3>
          <input
            type="text"
            placeholder="Playlist name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4 }}>
              {editingPlaylist ? 'Update' : 'Create'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowCreateForm(false);
                cancelEdit();
              }}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {}
      <div style={{ display: 'grid', gap: 16 }}>
        {playlists.length === 0 ? (
          <p>No playlists yet. Create your first playlist!</p>
        ) : (
          playlists.map((playlist) => (
            <div 
              key={playlist._id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                padding: 16,
                backgroundColor: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{playlist.name}</h3>
                  {playlist.description && <p style={{ margin: '0 0 8px 0', color: '#666' }}>{playlist.description}</p>}
                  <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                    {playlist.songs?.length || 0} songs
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => showSongs(playlist)}
                    style={{ padding: '4px 8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px' }}
                  >
                    Manage Songs
                  </button>
                  <button 
                    onClick={() => startEdit(playlist)}
                    style={{ padding: '4px 8px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: 4, fontSize: '12px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deletePlaylist(playlist._id)}
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {}
              {playlist.songs && playlist.songs.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Songs:</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {playlist.songs.map((song) => (
                      <li key={song._id} style={{ marginBottom: 4, fontSize: '14px' }}>
                        {song.title} - {song.artist}
                        {song.year && ` (${song.year})`}
                        {song.genre && ` [${song.genre}]`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {}
      {showSongsModal && selectedPlaylist && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 8,
            maxWidth: 600,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Manage Songs - {selectedPlaylist.name}</h3>
              <button 
                onClick={() => setShowSongsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <h4>Available Songs</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: 8, marginBottom: 16 }}>
              {songs.map((song) => {
                const isInPlaylist = selectedPlaylist.songs?.some(s => s._id === song._id);
                return (
                  <div key={song._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <span style={{ fontSize: '14px' }}>
                      {song.title} - {song.artist}
                      {song.year && ` (${song.year})`}
                    </span>
                    {isInPlaylist ? (
                      <button 
                        onClick={() => removeSongFromPlaylist(selectedPlaylist._id, song._id)}
                        style={{ padding: '2px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => addSongToPlaylist(selectedPlaylist._id, song._id)}
                        style={{ padding: '2px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px' }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <h4>Current Playlist ({selectedPlaylist.songs?.length || 0} songs)</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: 8 }}>
              {selectedPlaylist.songs && selectedPlaylist.songs.length > 0 ? (
                selectedPlaylist.songs.map((song) => (
                  <div key={song._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <span style={{ fontSize: '14px' }}>
                      {song.title} - {song.artist}
                      {song.year && ` (${song.year})`}
                    </span>
                    <button 
                      onClick={() => removeSongFromPlaylist(selectedPlaylist._id, song._id)}
                      style={{ padding: '2px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>No songs in this playlist</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
