# Spotify Web Player & API

A full-stack Spotify clone featuring a modern, pixel-perfect React frontend with Tailwind CSS and an Express / Node.js backend powered by MSSQL and ImageKit cloud audio storage.

---

## 🚀 Features

- **Pixel-Perfect Spotify UI**: Pitch-black theme (`#000000` / `#121212`), glassmorphic top navbar, 3-column studio layout (collapsible sidebar, content area, now playing inspector), and responsive mobile support.
- **Audio Streaming Engine**: Real-time HTML5 audio playback with interactive scrubbing progress bar, animated 4-bar equalizer, volume memory, repeat, shuffle, and favorites.
- **Authentication & RBAC**: JWT with HTTP-only cookies and Bearer tokens supporting `user` (listener) and `artist` roles.
- **Music & Album Management**: Artist audio upload with ImageKit cloud integration, MIME validation, and album association.
- **Dynamic Search & Discovery**: Instant client and catalog search with genre exploration cards.

---

## 📦 Packages & Dependencies

### 🖥️ Backend Packages (`backend/package.json`)

| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`express`** | `^5.2.1` | Fast, minimalist web framework for routing and REST APIs. |
| **`mssql`** | `^11.0.1` | Official Microsoft SQL Server client for Node.js with connection pooling and query execution. |
| **`msnodesqlv8`** | `^5.4.0` | Native Microsoft SQL Server V8 driver for Windows authentication and direct MSSQL connections. |
| **`@imagekit/nodejs`** | `^7.11.0` | Official ImageKit SDK for uploading and streaming audio tracks on cloud CDN storage. |
| **`jsonwebtoken`** | `^9.0.2` | Implements JWT authentication, payload signing, and secure token verification. |
| **`bcryptjs`** | `^3.0.3` | One-way password hashing algorithm with salt generation for user credential security. |
| **`cookie-parser`** | `^1.4.7` | Parses `Cookie` headers in HTTP requests, enabling seamless HTTP-only auth cookies. |
| **`cors`** | `^2.8.6` | Cross-Origin Resource Sharing middleware enabling authenticated frontend requests with credentials. |
| **`multer`** | `^2.3.0` | Middleware for handling `multipart/form-data` audio file uploads into memory buffers. |
| **`dotenv`** | `^16.4.7` | Loads environment variables from `.env` file into Node.js `process.env`. |
| **`nodemon`** | `^3.1.14` | Developer utility that monitors codebase changes and automatically restarts the Node server. |

### 💻 Frontend Packages (`frontend/package.json`)

| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`react`** | `^19.2.8` | Declarative, component-based UI framework powering the application architecture. |
| **`react-dom`** | `^19.2.8` | React package providing DOM-specific rendering and mounting methods. |
| **`lucide-react`** | `^1.45.0` | Consistent Spotify icon system (Play, Pause, Volume, Shuffle, Repeat, Heart, Search, Library, etc.). |
| **`vite`** | `^8.3.0` | Next-generation build tool and dev server with instant Hot Module Replacement (HMR). |
| **`@vitejs/plugin-react`** | `^6.1.1` | Official Vite plugin providing React JSX compilation and Fast Refresh. |
| **`tailwindcss`** | `^3.4.19` | Utility-first CSS framework for Spotify dark theme, layouts, glassmorphism, and animations. |
| **`postcss`** | `^8.5.28` | CSS processing pipeline tool required by Tailwind CSS for transforming utility classes. |
| **`autoprefixer`** | `^10.6.0` | PostCSS plugin that automatically adds browser vendor prefixes to CSS rules. |
| **`oxlint`** | `^1.81.0` | High-performance Rust-based JavaScript and JSX linter for code quality. |
| **`@types/react`** | `^19.2.18` | TypeScript definitions and autocomplete typing for React APIs. |
| **`@types/react-dom`** | `^19.2.7` | TypeScript definitions and autocomplete typing for React DOM APIs. |

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
├── frontend/                 # React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cards/        # QuickAccessCard, MusicCard, EqualizerAnimation
│   │   │   ├── Layout/       # LeftSidebar, TopNavbar, RightSidebar
│   │   │   ├── Modals/       # AuthModal, UploadMusicModal
│   │   │   ├── Player/       # BottomPlayer, PlayerControls, ProgressBar, VolumeControl
│   │   │   └── Views/        # HomeView, SearchView, AlbumDetailView
│   │   ├── context/          # AuthContext, PlayerContext
│   │   ├── services/         # Centralized API service
│   │   ├── utils/            # Time formatters, color extractors
│   │   ├── App.jsx           # Master application assembly
│   │   └── index.css         # Dark theme tokens, glassmorphism, scrollbars
│   ├── vite.config.js        # Vite config with /api proxy
│   └── package.json
│
├── render.yaml               # Render Blueprint for automated backend deployment
└── README.md
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

### Deploying Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: `Vite` (Build Command: `npm run build`, Output Directory: `dist`).
4. Set Environment Variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://spotify-backend.onrender.com`).
5. Click **Deploy**.

### Deploying Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com/) connecting this repository (or use the included `render.yaml` Blueprint).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `SERVER`: MSSQL host / connection string
   - `DATABASE`: `Spotify`
   - `JWT_SECRET`: Secure random secret string
   - `JWT_EXPIRES_IN`: `7d`
   - `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
   - `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
   - `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint
5. Click **Deploy Web Service**.
