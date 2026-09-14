import React from 'react';
import { X, Music, CheckCircle, ListMusic, Mic2, Disc } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import EqualizerAnimation from '../Cards/EqualizerAnimation.jsx';

export default function RightSidebar() {
  const {
    currentTrack,
    queue,
    isPlaying,
    isRightSidebarOpen,
    toggleRightSidebar,
    playTrack,
  } = usePlayer();

  if (!isRightSidebarOpen) return null;

  return (
    <aside className="w-80 lg:w-84 h-full p-2 flex-shrink-0 select-none hidden md:flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex-1 rounded-xl bg-[#121212] p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white truncate">Now Playing</h3>
          <button
            onClick={toggleRightSidebar}
            aria-label="Close now playing panel"
            className="p-1.5 text-spotify-subtext hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentTrack ? (
          <>
            {/* High-Res Album Artwork Container */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center">
              {currentTrack.artwork || currentTrack.thumbnail ? (
                <img
                  src={currentTrack.artwork || currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-950 via-[#1a1a1a] to-black p-6 text-center">
                  <Music className="w-16 h-16 text-spotify-green mb-3 opacity-90" />
                  <span className="text-sm font-semibold text-white truncate max-w-full">
                    {currentTrack.title}
                  </span>
                </div>
              )}

              {/* Sound Equalizer Pill on Artwork */}
              {isPlaying && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <EqualizerAnimation isPlaying={isPlaying} />
                  <span className="text-[10px] uppercase font-bold text-spotify-green tracking-wider">
                    Playing
                  </span>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div>
              <h2 className="text-xl font-extrabold text-white truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </h2>
              <p className="text-sm text-spotify-subtext truncate hover:underline cursor-pointer mt-0.5">
                {currentTrack.artistName || currentTrack.artist?.username || 'Unknown Artist'}
              </p>
            </div>

            {/* About the Artist Card */}
            <div className="rounded-xl bg-[#181818] p-4 flex flex-col gap-3 relative overflow-hidden border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-spotify-subtext">
                <Mic2 className="w-4 h-4 text-spotify-green" />
                <span>About the Artist</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-spotify-green to-emerald-900 flex items-center justify-center font-bold text-black text-lg">
                  {(currentTrack.artistName || currentTrack.artist?.username || 'A')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm truncate">
                      {currentTrack.artistName || currentTrack.artist?.username || 'Artist'}
                    </span>
                    <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 flex-shrink-0" />
                  </div>
                  <span className="text-xs text-spotify-subtext">Verified Creator</span>
                </div>
              </div>

              <p className="text-xs text-spotify-subtext leading-relaxed line-clamp-3">
                Original musical composition hosted directly on Spotify Node Cloud with lossless
                audio streaming.
              </p>
            </div>

            {/* Next in Queue */}
            {queue.length > 1 && (
              <div className="rounded-xl bg-[#181818] p-4 flex flex-col gap-2 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-spotify-subtext">
                    <ListMusic className="w-4 h-4 text-spotify-green" />
                    <span>Next in Queue</span>
                  </div>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {queue
                    .filter((t) => t.id !== currentTrack.id)
                    .slice(0, 4)
                    .map((queuedTrack) => (
                      <div
                        key={`queue-${queuedTrack.id}`}
                        onClick={() => playTrack(queuedTrack, queue)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-spotify-green transition-colors">
                            {queuedTrack.title}
                          </p>
                          <p className="text-[11px] text-spotify-subtext truncate">
                            {queuedTrack.artistName || queuedTrack.artist?.username}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-spotify-subtext">
            <Music className="w-12 h-12 text-spotify-muted mb-3" />
            <p className="text-sm font-semibold text-white">Nothing playing</p>
            <p className="text-xs text-spotify-subtext mt-1">
              Select a song from your library or the catalog to view details.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
