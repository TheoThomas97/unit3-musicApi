import { useEffect, useState, useCallback } from 'react';
import api from './api';
import { useAuth } from './auth/AuthContext';

export default function App() {
  const { token, user } = useAuth();

  const [songs, setSongs] = useState([]);

  // CSS styles for better dropdown visibility
  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
    minWidth: "120px",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: "url("data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 4 5\"><path fill=\"%23666\" d=\"M2 0L0 2h4zm0 5L0 3h4z\"/></svg>")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    backgroundSize: "12px",
    paddingRight: "28px"
  };

  const selectFocusStyle = {

  const optionStyle = {

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "14px",
    fontWeight: "500",
    outline: "none",
    minWidth: "120px"
  };
    color: "#000000",
    backgroundColor: "#ffffff",
    padding: "8px 12px",
    fontSize: "14px"
  };
    borderColor: "#007bff",
    boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.1)"
  };

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

  // CSS injection for dropdown options
  useEffect(() => {
    const styleId = "dropdown-options-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        select {
          color: #000000 !important;
          background-color: #ffffff !important;
          border: 2px solid #ddd !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        select option {
          color: #000000 !important;
          background-color: #ffffff !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
        }
        select:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
          outline: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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
        <input 
          placeholder="Search title…" 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
        />
        <select 
          value={genre} 
          onChange={(e)=>setGenre(e.target.value)}
          style={selectStyle}
          onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, selectStyle)}
        >
          <option style={optionStyle} value="">All genres</option>
          <option style={optionStyle} value="rock">Rock</option>
          <option style={optionStyle} value="pop">Pop</option>
          <option style={optionStyle} value="jazz">Jazz</option>
          <option style={optionStyle} value="hip hop">Hip Hop</option>
          <option style={optionStyle} value="r&b">R&B</option>
        </select>
        <select 
          value={sort} 
          onChange={(e)=>setSort(e.target.value)}
          style={selectStyle}
          onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, selectStyle)}
        >
          <option style={optionStyle} value="-createdAt">Newest</option>
          <option style={optionStyle} value="createdAt">Oldest</option>
          <option style={optionStyle} value="year">Year ↑</option>
          <option style={optionStyle} value="-year">Year ↓</option>
          <option style={optionStyle} value="title">Title A–Z</option>
          <option style={optionStyle} value="-title">Title Z–A</option>
        </select>
        <select 
          value={limit} 
          onChange={(e)=>setLimit(Number(e.target.value))}
          style={selectStyle}
          onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, selectStyle)}
        >
          <option style={optionStyle} value={5}>5 / page</option>
          <option style={optionStyle} value={10}>10 / page</option>
          <option style={optionStyle} value={20}>20 / page</option>
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
