import { useEffect, useState, useCallback } from 'react';
import api from './api';
import { useAuth } from './auth/AuthContext';

export default function App() {
  const { token, user } = useAuth();

  const [songs, setSongs] = useState([]);

  const [form, setForm] = useState({ title: '', artist: '', genre: '', year: '' });

  const [search, setSearch] = useState('');
  const [genre, setGenre]   = useState('');
  const [page, setPage]     = useState(1);
  const [limit, setLimit]   = useState(5);
  const [sort, setSort]     = useState('-createdAt');

  const load = useCallback(async () => {
    const params = {};
    if (search) params.q = search;
    if (genre)  params.genre = genre;
    params.page  = page;
    params.limit = limit;
    params.sort  = sort;

    const res = await api.get('/songs', { params });
    setSongs(res.data.items || res.data);
  }, [search, genre, page, limit, sort]);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/songs', {
      title: form.title,
      artist: form.artist,
      genre: form.genre || undefined,
      year: form.year ? Number(form.year) : undefined,
    });
    setForm({ title: '', artist: '', genre: '', year: '' });
    setPage(1);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/songs/${id}`);
    setSongs((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="main-container">
      <h1>Jukebox</h1>

      <div className="filters-grid">
        <input placeholder="Search title…" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select value={genre} onChange={(e)=>setGenre(e.target.value)}>
          <option value="">All genres</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="jazz">Jazz</option>
          <option value="hip hop">Hip Hop</option>
          <option value="r&b">R&B</option>
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="year">Year ↑</option>
          <option value="-year">Year ↓</option>
          <option value="title">Title A–Z</option>
          <option value="-title">Title Z–A</option>
        </select>
        <select value={limit} onChange={(e)=>setLimit(Number(e.target.value))}>
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>
      <button onClick={()=>{ setPage(1); load(); }} className="apply-btn">Apply</button>

      {token && (
        <form onSubmit={create} className="create-form">
          <input placeholder="Title"  value={form.title}  onChange={(e)=>setForm(f=>({ ...f, title:e.target.value }))} required />
          <input placeholder="Artist" value={form.artist} onChange={(e)=>setForm(f=>({ ...f, artist:e.target.value }))} required />
          <input placeholder="Genre"  value={form.genre}  onChange={(e)=>setForm(f=>({ ...f, genre:e.target.value }))} />
          <input placeholder="Year"   value={form.year}   onChange={(e)=>setForm(f=>({ ...f, year:e.target.value }))} />
          <button type="submit">Add Song</button>
        </form>
      )}

      <ul className="songs-list">
        {songs.map((s) => (
          <li key={s._id} className="song-item">
            {s.title} — {s.artist}
            {s.year ? ` (${s.year})` : ''} {s.genre ? ` [${s.genre}]` : ''}
           
            {user && (
               (typeof s.owner === 'string'
                ? s.owner === user.id
                : s.owner?._id === user.id
               ) && (
                <button onClick={() => remove(s._id)} className="delete-btn">
                  Delete
                </button>
               )
             )}
          </li>
        ))}
        {songs.length === 0 && <li>No songs found.</li>}
      </ul>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span className="page-info">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
