require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'https://your-netlify-app.netlify.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use('/playlists', require('./routes/playlists'));
app.use((req, _res, next) => {       
  console.log(req.method, JSON.stringify(req.url));
  next();
});

const songsRouter = require('./routes/songs');
app.use('/songs', songsRouter);

const playlistsRouter = require('./routes/playlists');
app.use('/playlists', playlistsRouter);


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 400).json({ error: err.message || 'Something went wrong' });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB connection error:', err));

app.use('/songs', require('./routes/songs'));
app.use('/auth', require('./routes/auth'));



app.get('/', (req, res) => {
  res.send('🎶 Music API is running!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
