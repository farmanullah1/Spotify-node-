import React, { useState, useRef } from 'react';
import { X, Upload, Music, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { musicAPI } from '../../services/api.js';

export default function UploadMusicModal({ onUploadSuccess }) {
  const { isUploadModalOpen, closeUploadModal, playTrack } = usePlayer();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // If title is empty, prefill with filename without extension
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim()) {
      setError('Please enter a track title.');
      return;
    }

    if (!file) {
      setError('Please select an audio file to upload.');
      return;
    }

    setUploading(true);

    try {
      const response = await musicAPI.upload({ title: title.trim(), file });
      setSuccessMsg('Track uploaded successfully!');

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Auto play newly uploaded track if returned
      if (response && response.music) {
        playTrack(response.music);
      }

      setTimeout(() => {
        closeUploadModal();
        setTitle('');
        setFile(null);
        setSuccessMsg('');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to upload audio track. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#282828] shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeUploadModal}
          disabled={uploading}
          className="absolute top-4 right-4 p-2 text-spotify-subtext hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-spotify-green/20 text-spotify-green flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Upload Music Track</h2>
            <p className="text-xs text-spotify-subtext">Publish audio to your artist catalog</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-950/80 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-spotify-green" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker Drop Zone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
              Audio File (MP3, WAV, FLAC, M4A)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                file
                  ? 'border-spotify-green bg-spotify-green/5'
                  : 'border-[#333] hover:border-spotify-subtext bg-[#181818]'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <Music className="w-10 h-10 text-spotify-green mb-2" />
                  <span className="text-sm font-semibold text-white max-w-xs truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-spotify-subtext mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-spotify-subtext mb-2 group-hover:text-white transition-colors" />
                  <span className="text-sm font-semibold text-white">
                    Choose an audio file or drag it here
                  </span>
                  <span className="text-xs text-spotify-subtext mt-1">
                    Supports high-quality stereo up to 50MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Track Title Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
              Track Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Reverie"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#242424] border border-transparent focus:border-spotify-green focus:bg-[#282828] text-sm text-white placeholder-spotify-muted outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-3 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black font-bold text-sm transition-all duration-200 shadow-spotify-glow hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Cloud...</span>
              </>
            ) : (
              <span>Publish Track</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
