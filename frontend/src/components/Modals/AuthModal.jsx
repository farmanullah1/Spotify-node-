import React, { useState } from 'react';
import { X, Music2, User, Mic2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  const isLogin = authModalMode === 'login';

  const [formData, setFormData] = useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    role: 'user', // 'user' | 'artist'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        await login({
          identifier: formData.identifier,
          password: formData.password,
        });
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#282828] shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-spotify-subtext hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center shadow-spotify-glow mb-3">
            <Music2 className="w-7 h-7 text-black fill-black" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isLogin ? 'Log in to Spotify' : 'Sign up for free'}
          </h2>
          <p className="text-xs text-spotify-subtext mt-1">
            {isLogin
              ? 'Enter your credentials to continue'
              : 'Join millions of music lovers & artists today'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-950/80 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Email or username"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#242424] border border-transparent focus:border-spotify-green focus:bg-[#282828] text-sm text-white placeholder-spotify-muted outline-none transition-colors"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="What should we call you?"
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#242424] border border-transparent focus:border-spotify-green focus:bg-[#282828] text-sm text-white placeholder-spotify-muted outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#242424] border border-transparent focus:border-spotify-green focus:bg-[#282828] text-sm text-white placeholder-spotify-muted outline-none transition-colors"
                />
              </div>

              {/* Account Type Selector (User vs Artist) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      formData.role === 'user'
                        ? 'border-spotify-green bg-spotify-green/10 text-spotify-green shadow-sm'
                        : 'border-[#282828] bg-[#242424] text-spotify-subtext hover:border-neutral-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Listener</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'artist' })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      formData.role === 'artist'
                        ? 'border-spotify-green bg-spotify-green/10 text-spotify-green shadow-sm'
                        : 'border-[#282828] bg-[#242424] text-spotify-subtext hover:border-neutral-600'
                    }`}
                  >
                    <Mic2 className="w-4 h-4" />
                    <span>Artist</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-spotify-subtext mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password (min 6 characters)"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#242424] border border-transparent focus:border-spotify-green focus:bg-[#282828] text-sm text-white placeholder-spotify-muted outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black font-bold text-sm transition-all duration-200 shadow-spotify-glow hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
          >
            {submitting ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {/* Switch Login/Signup Mode */}
        <div className="mt-6 pt-5 border-t border-[#282828] text-center text-xs text-spotify-subtext">
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setError('');
                  setAuthModalMode('register');
                }}
                className="text-white font-semibold hover:underline"
              >
                Sign up for Spotify
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setError('');
                  setAuthModalMode('login');
                }}
                className="text-white font-semibold hover:underline"
              >
                Log in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
