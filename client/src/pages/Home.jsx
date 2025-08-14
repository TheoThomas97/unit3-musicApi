import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎵 Jukebox</h1>
          <p className="hero-description">
            {user
              ? `Welcome back, ${user.username}! Manage your songs and build playlists.`
              : 'A simple music library where you can add songs, explore others, and build playlists.'}
          </p>

          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/signup" className="btn-primary">Create an account</Link>
                <Link to="/login"  className="btn-secondary">Sign in</Link>
              </>
            ) : (
              <>
                <Link to="/songs"     className="btn-primary">Browse Songs</Link>
                <Link to="/playlists" className="btn-primary">My Playlists</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-content">
          <h2>What you can do</h2>
          <ul className="features-list">
            <li>Add your favorite songs with title, artist, genre, and year.</li>
            <li>Filter and search songs from everyone using the app.</li>
            <li>Create playlists and mix your songs with tracks from other users.</li>
            <li>Keep your data secure with sign up / log in using JWT.</li>
          </ul>
        </div>
      </section>

      <footer className="home-footer">
        <small>Built with React, Express, and MongoDB.</small>
      </footer>
    </div>
  );
}
