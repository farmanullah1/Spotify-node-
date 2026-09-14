import React, { useState } from 'react';
import {
  Home,
  Search,
  Library,
  Plus,
  Music,
  Disc,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function LeftSidebar({
  currentView,
  setCurrentView,
  tracks = [],
  albums = [],
  onSelectAlbum,
}) {
  const { isArtist, openAuthModal, isAuthenticated } = useAuth();
  const { playTrack, openUploadModal } = usePlayer();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'playlists' | 'artists' | 'albums'

  return (
    <aside
      className={`h-full flex flex-col gap-2 p-2 transition-all duration-300 select-none flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64 sm:w-72'
      }`}
    >
      {/* Top Nav Block */}
      <div className="rounded-xl bg-[#121212] p-4 flex flex-col gap-4">
        {/* Spotify Brand Header */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-spotify-glow group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-extrabold text-xl leading-none tracking-tighter">S</span>
            </div>
            {!isCollapsed && (
              <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-spotify-green transition-colors">
                Spotify
              </span>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 text-spotify-subtext hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand library' : 'Collapse library'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Home & Search Buttons */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-bold text-sm transition-colors ${
              currentView === 'home'
                ? 'text-white bg-white/5'
                : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Home className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </button>

          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-bold text-sm transition-colors ${
              currentView === 'search'
                ? 'text-white bg-white/5'
                : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Search className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span>Search</span>}
          </button>
        </div>
      </div>

      {/* Library Block */}
      <div className="flex-1 rounded-xl bg-[#121212] p-3 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-2 text-spotify-subtext">
          <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <Library className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span className="font-bold text-sm">Your Library</span>}
          </div>

          {!isCollapsed && isArtist && (
            <button
              onClick={openUploadModal}
              title="Upload new music track"
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Library Tab Filter Pills */}
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 px-1 py-2 overflow-x-auto no-scrollbar">
            {['all', 'tracks', 'albums'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {tab === 'all' ? 'All Items' : tab}
              </button>
            ))}
          </div>
        )}

        {/* Items Scrollable List */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1">
          {/* Tracks List */}
          {(activeTab === 'all' || activeTab === 'tracks') &&
            tracks.slice(0, 10).map((track) => (
              <div
                key={`lib-track-${track.id}`}
                onClick={() => playTrack(track, tracks)}
                className="group flex items-center gap-3 p-2 rounded-md hover:bg-[#232323] cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded bg-gradient-to-br from-[#282828] to-[#181818] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {track.artwork || track.thumbnail ? (
                    <img src={track.artwork || track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-5 h-5 text-spotify-green" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate group-hover:text-spotify-green transition-colors">
                      {track.title}
                    </p>
                    <p className="text-xs text-spotify-subtext truncate">
                      Song • {track.artistName || track.artist?.username || 'Artist'}
                    </p>
                  </div>
                )}
              </div>
            ))}

          {/* Albums List */}
          {(activeTab === 'all' || activeTab === 'albums') &&
            albums.map((album) => (
              <div
                key={`lib-album-${album.id}`}
                onClick={() => onSelectAlbum && onSelectAlbum(album)}
                className="group flex items-center gap-3 p-2 rounded-md hover:bg-[#232323] cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded bg-gradient-to-tr from-purple-950/80 to-[#181818] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Disc className="w-5 h-5 text-purple-400" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate group-hover:text-spotify-green transition-colors">
                      {album.title}
                    </p>
                    <p className="text-xs text-spotify-subtext truncate">
                      Album • {album.artistName || album.artist?.username || 'Artist'}
                    </p>
                  </div>
                )}
              </div>
            ))}

          {tracks.length === 0 && albums.length === 0 && !isCollapsed && (
            <div className="p-4 text-center text-xs text-spotify-subtext">
              No tracks uploaded yet.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
