import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import LeftSidebar from './components/Layout/LeftSidebar.jsx';
import TopNavbar from './components/Layout/TopNavbar.jsx';
import RightSidebar from './components/Layout/RightSidebar.jsx';
import BottomPlayer from './components/Player/BottomPlayer.jsx';
import HomeView from './components/Views/HomeView.jsx';
import SearchView from './components/Views/SearchView.jsx';
import AlbumDetailView from './components/Views/AlbumDetailView.jsx';
import AuthModal from './components/Modals/AuthModal.jsx';
import UploadMusicModal from './components/Modals/UploadMusicModal.jsx';
import { musicAPI, albumAPI } from './services/api.js';

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'album'
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const scrollContainerRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tracksRes, albumsRes] = await Promise.allSettled([
        musicAPI.getAll(),
        albumAPI.getAll(),
      ]);

      if (tracksRes.status === 'fulfilled' && tracksRes.value) {
        const list = tracksRes.value.musics || tracksRes.value.music || tracksRes.value.data || [];
        setTracks(Array.isArray(list) ? list : []);
      }
      if (albumsRes.status === 'fulfilled' && albumsRes.value) {
        const list = albumsRes.value.albums || albumsRes.value.album || albumsRes.value.data || [];
        setAlbums(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load Spotify catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrolled(scrollTop > 40);
  };

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentView('album');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromAlbum = () => {
    setCurrentView('home');
    setSelectedAlbum(null);
  };

  // Switch view helper that also scrolls top
  const handleNavigate = (view) => {
    setCurrentView(view);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-spotify-black text-white overflow-hidden select-none font-sans pb-20 sm:pb-24">
      {/* Upper 3-Column Studio Workspace */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Left Navigation & Library Sidebar */}
        <LeftSidebar
          currentView={currentView}
          setCurrentView={handleNavigate}
          tracks={tracks}
          albums={albums}
          onSelectAlbum={handleSelectAlbum}
        />

        {/* Center Dynamic Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-spotify-base rounded-xl relative border border-white/5 shadow-2xl">
          {/* Glassmorphic Sticky Top Navbar */}
          <TopNavbar
            currentView={currentView}
            setCurrentView={handleNavigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            scrolled={scrolled}
          />

          {/* Scrollable View Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto spotify-scrollbar relative"
          >
            {loading && tracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4">
                <div className="w-10 h-10 border-3 border-spotify-green border-t-transparent rounded-full animate-spin" />
                <p className="text-spotify-subtext text-sm font-medium animate-pulse">
                  Connecting to Spotify catalog...
                </p>
              </div>
            ) : (
              <>
                {currentView === 'home' && (
                  <HomeView
                    tracks={tracks}
                    albums={albums}
                    onSelectAlbum={handleSelectAlbum}
                  />
                )}

                {currentView === 'search' && (
                  <SearchView
                    searchQuery={searchQuery}
                    tracks={tracks}
                    albums={albums}
                    onSelectAlbum={handleSelectAlbum}
                  />
                )}

                {currentView === 'album' && (
                  <AlbumDetailView
                    album={selectedAlbum}
                    onBack={handleBackFromAlbum}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Right "Now Playing" Inspector Drawer */}
        <RightSidebar />
      </div>

      {/* Persistent Bottom Floating Audio Player */}
      <BottomPlayer />

      {/* Global Modals */}
      <AuthModal />
      <UploadMusicModal onUploadSuccess={fetchData} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </AuthProvider>
  );
}
