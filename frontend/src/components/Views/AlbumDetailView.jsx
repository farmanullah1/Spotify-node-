import React from 'react';
import { Play, Pause, Clock, Disc, ArrowLeft, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { getDominantGradient } from '../../utils/colorExtractor.js';
import EqualizerAnimation from '../Cards/EqualizerAnimation.jsx';

export default function AlbumDetailView({ album, onBack }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  if (!album) return null;

  const gradient = getDominantGradient(album.title || 'album');

  // Associated track
  const track = album.music || (album.musicId ? {
    id: album.musicId,
    title: album.musicTitle || album.title,
    uri: album.musicUri,
    artistName: album.artistName,
  } : null);

  const isCurrent = currentTrack?.id === track?.id;
  const isTrackPlaying = isCurrent && isPlaying;

  const handlePlayAlbum = () => {
    if (!track) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, [track]);
    }
  };

  return (
    <div className="relative pb-24 select-none">
      {/* Dynamic Header Gradient */}
      <div
        className="h-64 sm:h-80 p-4 sm:p-8 flex items-end gap-6 transition-colors duration-500 relative"
        style={{
          background: `linear-gradient(to bottom, ${gradient.primary}, #121212)`,
        }}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="absolute top-4 left-4 sm:left-8 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Large Artwork */}
        <div className="w-36 h-36 sm:w-52 sm:h-52 rounded-lg bg-gradient-to-tr from-purple-950 to-black shadow-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10">
          <Disc className="w-20 h-20 text-purple-400" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Album</span>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight truncate">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 mt-2 font-medium">
            <span className="text-white font-bold hover:underline cursor-pointer">
              {album.artistName || album.artist?.username || 'Artist'}
            </span>
            <span>•</span>
            <span>{track ? '1 Song' : '0 Songs'}</span>
          </div>
        </div>
      </div>

      {/* Actions & Tracklist Deck */}
      <div className="p-4 sm:p-8 space-y-6 bg-gradient-to-b from-[#121212] to-black min-h-[400px]">
        {/* Action Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={handlePlayAlbum}
            disabled={!track}
            aria-label="Play Album"
            className="w-14 h-14 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center shadow-spotify-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isTrackPlaying ? (
              <Pause className="w-7 h-7 fill-black text-black" />
            ) : (
              <Play className="w-7 h-7 fill-black text-black ml-1" />
            )}
          </button>
        </div>

        {/* Tracklist Table */}
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-spotify-subtext border-b border-white/5 mb-2">
            <span className="col-span-1">#</span>
            <span className="col-span-6 sm:col-span-8">Title</span>
            <span className="col-span-5 sm:col-span-3 text-right">
              <Clock className="w-4 h-4 inline-block" />
            </span>
          </div>

          {track ? (
            <div
              onClick={handlePlayAlbum}
              className={`grid grid-cols-12 items-center px-4 py-3 rounded-lg cursor-pointer transition-colors group ${
                isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {/* Number or Equalizer / Play icon */}
              <div className="col-span-1 text-sm font-medium text-spotify-subtext">
                {isTrackPlaying ? (
                  <EqualizerAnimation isPlaying={isTrackPlaying} />
                ) : (
                  <span className="group-hover:hidden">{1}</span>
                )}
                <Play className="w-4 h-4 text-white hidden group-hover:block" />
              </div>

              {/* Title & Artist */}
              <div className="col-span-6 sm:col-span-8 min-w-0 pr-4">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-spotify-green font-bold' : 'text-white'
                  }`}
                >
                  {track.title}
                </p>
                <p className="text-xs text-spotify-subtext truncate mt-0.5">
                  {track.artistName || album.artistName}
                </p>
              </div>

              {/* Duration / Status */}
              <div className="col-span-5 sm:col-span-3 text-right text-xs text-spotify-subtext">
                Stream Track
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-spotify-subtext">
              No tracks assigned to this album yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
