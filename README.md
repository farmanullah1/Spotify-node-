# Spotify Web Player & API

A full-stack Spotify clone featuring a modern, pixel-perfect React frontend with Tailwind CSS and an Express / Node.js backend powered by MSSQL and ImageKit cloud audio storage.

---

## 🚀 Features

- **Pixel-Perfect Spotify UI**: Pitch-black theme, glassmorphic navbar, 3-column layout (collapsible sidebar, content area, now playing inspector), and responsive mobile support.
- **Audio Streaming Engine**: Real-time HTML5 audio playback with interactive scrubbing progress bar, animated 4-bar equalizer, volume memory, repeat, shuffle, and favorites.
- **Authentication & RBAC**: JWT with HTTP-only cookies and Bearer tokens supporting `user` (listener) and `artist` roles.
- **Music & Album Management**: Artist audio upload with ImageKit cloud integration, MIME validation, and album association.
- **Dynamic Search & Discovery**: Instant client and catalog search with genre exploration cards.

---

## 📁 Project Structure

```
Spotify/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # MSSQL database connection pool
│   │   ├── controllers/      # Auth, Music, and Album controllers
│   │   ├── middlewares/      # Auth (JWT/cookies) and Multer upload
│   │   ├── models/           # Database queries
│   │   └── routes/           # Express API routes (/api/auth, /api/music, /api/albums)
│   ├── server.js             # Server entry point
│   └── package.json
│
└── frontend/                 # React 19 + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── Cards/        # QuickAccessCard, MusicCard, EqualizerAnimation
    │   │   ├── Layout/       # LeftSidebar, TopNavbar, RightSidebar
    │   │   ├── Modals/       # AuthModal, UploadMusicModal
    │   │   ├── Player/       # BottomPlayer, PlayerControls, ProgressBar, VolumeControl
    │   │   └── Views/        # HomeView, SearchView, AlbumDetailView
    │   ├── context/          # AuthContext, PlayerContext
    │   ├── services/         # Centralized API service
    │   ├── utils/            # Time formatters, color extractors
    │   ├── App.jsx           # Master application assembly
    │   └── index.css         # Dark theme tokens, glassmorphism, scrollbars
    ├── vite.config.js        # Vite config with /api proxy
    └── package.json
```

---

## 🛠️ Local Development

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env based on .env.example
npm run dev
# Server starts on http://localhost:3000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Client runs on http://localhost:5174 (proxies /api to http://localhost:3000)
```

---

## 🌐 Deployment Guide

### Deploying Frontend (Vercel / Netlify / Render)
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://your-spotify-backend.onrender.com`)

### Deploying Backend (Render / Railway / Heroku)
1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `PORT`: (Provided automatically by cloud host)
   - `SERVER`: MSSQL host / connection string
   - `DATABASE`: Database name (`Spotify`)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Secure random secret key
   - `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
   - `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
   - `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint
