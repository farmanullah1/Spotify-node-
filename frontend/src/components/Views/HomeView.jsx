import React from 'react';
import { Sparkles, Disc, Music } from 'lucide-react';
import { getGreeting } from '../../utils/formatters.js';
import { getDominantGradient } from '../../utils/colorExtractor.js';
import { usePlayer } from '../../context/PlayerContext.jsx';
import QuickAccessCard from '../Cards/QuickAccessCard.jsx';
import MusicCard from '../Cards/MusicCard.jsx';

export default function HomeView({ tracks = [], albums = [], onSelectAlbum }) {
  const { currentTrack, playTrack } = usePlayer();
  const greeting = getGreeting();

  // Dynamic mesh gradient based on the currently active track or default
  const gradient = getDominantGradient(currentTrack?.title || 'spotify-home');

  // Take top 6 tracks for the 2x3 Quick Access Grid
  const quickAccessItems = tracks.slice(0, 6);

  return (
    <div className="relative pb-24">
      {/* Dynamic Ambient Hero Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-80 transition-colors duration-700 pointer-events-none opacity-40 -z-10"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% -20%, ${gradient.primary}, transparent)`,
        }}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Time-Aware Greeting */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {greeting}
          </h1>
        </div>

        {/* Quick Access 2x3 Grid */}
        {quickAccessItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickAccessItems.map((track) => (
              <QuickAccessCard
                key={`quick-${track.id}`}
                item={track}
                queue={tracks}
                onClick={() => playTrack(track, tracks)}
              />
            ))}
          </div>
        )}

        {/* Section 1: Made For You (Tracks Carousel) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer">
              Made For You
            </h2>
            <span className="text-xs font-bold text-spotify-subtext hover:text-white uppercase tracking-wider cursor-pointer">
              Show All
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tracks.map((track) => (
              <MusicCard
                key={`track-${track.id}`}
                item={track}
                queue={tracks}
                subtitle={`By ${track.artistName || track.artist?.username || 'Artist'}`}
              />
            ))}

            {tracks.length === 0 && (
              <div className="col-span-full py-12 text-center text-spotify-subtext">
                <Music className="w-12 h-12 text-spotify-muted mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No tracks available yet</p>
                <p className="text-xs text-spotify-subtext mt-1">
                  Log in as an artist to upload original songs!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Featured Albums */}
        {albums.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                Popular Albums
              </h2>
              <span className="text-xs font-bold text-spotify-subtext hover:text-white uppercase tracking-wider cursor-pointer">
                Show All
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map((album) => (
                <MusicCard
                  key={`album-${album.id}`}
                  item={album}
                  onClick={() => onSelectAlbum && onSelectAlbum(album)}
                  subtitle={`Album • ${album.artistName || album.artist?.username || 'Artist'}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Recently Played */}
        {tracks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                Recently Played
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tracks.slice(0, 6).map((track) => (
                <MusicCard
                  key={`recent-${track.id}`}
                  item={track}
                  queue={tracks}
                  subtitle={track.artistName || 'Artist'}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
