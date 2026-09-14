import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Upload,
  User,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';

export default function TopNavbar({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  scrolled,
}) {
  const { user, isAuthenticated, isArtist, logout, openAuthModal } = useAuth();
  const { openUploadModal } = usePlayer();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 h-16 px-4 sm:px-6 flex items-center justify-between transition-colors duration-300 ${
        scrolled ? 'bg-spotify-black/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      {/* Left: Navigation Buttons & Search Input */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* History Chevrons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            aria-label="Go back"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentView('search')}
            aria-label="Go forward"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input (Active when in search view or typing) */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-spotify-subtext">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'search') {
                setCurrentView('search');
              }
            }}
            onFocus={() => {
              if (currentView !== 'search') setCurrentView('search');
            }}
            placeholder="What do you want to play?"
            className="w-full pl-10 pr-9 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-white placeholder-spotify-subtext border border-transparent focus:border-white/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-spotify-subtext hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Artist Upload Music Button */}
        {isArtist && (
          <button
            onClick={openUploadModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-bold transition-transform active:scale-95 shadow-spotify-glow"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Track</span>
          </button>
        )}

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-spotify-green text-black flex items-center justify-center font-bold text-xs">
                {user?.username?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
              <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden md:inline">
                {user?.username}
              </span>
              {isArtist && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-spotify-green/20 text-spotify-green font-bold hidden lg:inline">
                  Artist
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#282828] border border-white/10 shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-[11px] text-spotify-subtext truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold text-spotify-green">
                    {user?.role} Account
                  </span>
                </div>

                {isArtist && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      openUploadModal();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded-md transition-colors mt-1"
                  >
                    <Upload className="w-4 h-4 text-spotify-green" />
                    <span>Upload Track</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/10 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="text-xs sm:text-sm font-bold text-spotify-subtext hover:text-white transition-colors px-3 py-1.5"
            >
              Sign up
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="text-xs sm:text-sm font-bold bg-white text-black px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
