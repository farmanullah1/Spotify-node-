import React from 'react';
import { Search, Music, Disc, Sparkles } from 'lucide-react';
import MusicCard from '../Cards/MusicCard.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';

const BROWSE_GENRES = [
  { name: 'Podcasts', color: 'from-orange-600 to-amber-700' },
  { name: 'Made For You', color: 'from-blue-700 to-indigo-900' },
  { name: 'Charts', color: 'from-purple-600 to-pink-800' },
  { name: 'New Releases', color: 'from-rose-600 to-red-800' },
  { name: 'Discover', color: 'from-emerald-600 to-teal-800' },
  { name: 'Concerts', color: 'from-cyan-600 to-blue-800' },
  { name: 'Hip-Hop', color: 'from-amber-600 to-orange-800' },
  { name: 'Pop', color: 'from-pink-600 to-rose-700' },
  { name: 'Rock', color: 'from-red-700 to-neutral-900' },
  { name: 'Chill', color: 'from-sky-600 to-indigo-800' },
  { name: 'Workout', color: 'from-lime-600 to-emerald-800' },
  { name: 'Party', color: 'from-violet-600 to-purple-900' },
];

export default function SearchView({ searchQuery, tracks = [], albums = [], onSelectAlbum }) {
  const { playTrack } = usePlayer();

  const query = searchQuery.trim().toLowerCase();

  const matchingTracks = query
    ? tracks.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.artistName?.toLowerCase().includes(query) ||
          t.artist?.username?.toLowerCase().includes(query)
      )
    : [];

  const matchingAlbums = query
    ? albums.filter(
        (a) =>
          a.title?.toLowerCase().includes(query) ||
          a.artistName?.toLowerCase().includes(query) ||
          a.artist?.username?.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 space-y-8">
      {query ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-xs text-spotify-subtext mt-1">
              Found {matchingTracks.length} song(s) and {matchingAlbums.length} album(s)
            </p>
          </div>

          {/* Matching Tracks */}
          {matchingTracks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Songs</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {matchingTracks.map((track) => (
                  <MusicCard
                    key={`search-track-${track.id}`}
                    item={track}
                    queue={matchingTracks}
                    subtitle={`By ${track.artistName || track.artist?.username || 'Artist'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matching Albums */}
          {matchingAlbums.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Albums</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {matchingAlbums.map((album) => (
                  <MusicCard
                    key={`search-album-${album.id}`}
                    item={album}
                    onClick={() => onSelectAlbum && onSelectAlbum(album)}
                    subtitle={`Album • ${album.artistName || 'Artist'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {matchingTracks.length === 0 && matchingAlbums.length === 0 && (
            <div className="py-16 text-center text-spotify-subtext">
              <Search className="w-12 h-12 mx-auto mb-3 text-spotify-muted opacity-60" />
              <p className="text-base font-semibold text-white">No results found for "{searchQuery}"</p>
              <p className="text-xs text-spotify-subtext mt-1">
                Please make sure your words are spelled correctly, or try using less or different keywords.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Browse All Category Tiles */
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BROWSE_GENRES.map((genre) => (
              <div
                key={genre.name}
                className={`relative aspect-square rounded-xl p-4 overflow-hidden bg-gradient-to-br ${genre.color} cursor-pointer shadow-lg hover:scale-[1.03] transition-transform duration-200 select-none group`}
              >
                <h3 className="text-base sm:text-lg font-bold text-white break-words">
                  {genre.name}
                </h3>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-black/20 rounded-lg shadow-2xl rotate-[25deg] group-hover:rotate-[15deg] transition-transform flex items-center justify-center">
                  <Music className="w-8 h-8 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
