

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { User as UserType, Language } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  language: Language;
  users: UserType[]; // Added users to check for existence
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, language, users }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const t = TRANSLATIONS[language];

  // Reset all fields to avoid leaking previous session data
  const resetForm = () => {
    setMode('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess(false);
    setShowPassword(false);
  };

  // Whenever modal closes, clear sensitive inputs
  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanInput = email.trim(); // Can be email or phone
    const cleanPassword = password.trim();

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);

      // Admin Check (Hardcoded for demo)
      if (cleanInput === 'nt40935@gmail.com' && cleanPassword === 'Khoahuynh1234@') {
        onLogin({
          id: 'admin-1',
          name: 'Admin User',
          email: cleanInput,
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=a77f73&color=fff'
        });
        onClose();
        return;
      }

      // Customer Logic
      if (mode === 'login') {
         if (cleanInput && cleanPassword) {
            // Check if user exists in the provided users list
            const existingUser = users.find(u => u.email === cleanInput || u.phone === cleanInput);
            
            if (existingUser) {
                // User exists, log them in
                onLogin(existingUser);
                onClose();
            } else {
                // User does not exist, show error
                setError(t.auth.account_not_found);
            }
         } else {
            setError('Please fill in credentials.');
         }
      } else {
        // Register Logic
        if (name && cleanInput && cleanPassword) {
          // Check Password Match
          if (cleanPassword !== confirmPassword) {
             setError(t.auth.password_mismatch);
             return;
          }

          // Check if user already exists
          const existingUser = users.find(u => u.email === cleanInput || u.phone === cleanInput);
          
          if (existingUser) {
             setError(t.auth.account_exists);
          } else {
             // Create new user
             onLogin({
                id: 'user-' + Date.now(),
                name: name,
                email: cleanInput,
                role: 'customer',
                avatar: `https://ui-avatars.com/api/?name=${name}&background=e0cec7&color=5e3a32`
              });
              onClose();
          }
        } else {
          setError('Please fill in all fields.');
        }
      }
    }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const cleanInput = email.trim();

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);

      if (!cleanInput) {
        setError(language === 'vi' ? 'Vui lòng nhập email hoặc số điện thoại.' : 'Please enter your email or phone.');
        return;
      }

      // Check if user exists
      const existingUser = users.find(u => u.email === cleanInput || u.phone === cleanInput);
      
      if (existingUser) {
        // User exists, show success message
        setSuccess(true);
        setError('');
      } else {
        // User does not exist
        setError(t.auth.account_not_found);
      }
    }, 1000);
  };

  // Handle Social Login (Google)
  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      setLoading(false);
      // Mock Google user data
      const googleUser: UserType = {
        id: 'google-' + Date.now(),
        name: 'Google User',
        email: `google.user${Date.now()}@gmail.com`,
        role: 'customer',
        avatar: `https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff`
      };
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === googleUser.email);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        onLogin(googleUser);
      }
      onClose();
    }, 1500);
  };

  // Handle Social Login (Facebook)
  const handleFacebookLogin = () => {
    setLoading(true);
    setError('');
    
    // Simulate Facebook OAuth flow
    setTimeout(() => {
      setLoading(false);
      // Mock Facebook user data
      const facebookUser: UserType = {
        id: 'facebook-' + Date.now(),
        name: 'Facebook User',
        email: `facebook.user${Date.now()}@facebook.com`,
        role: 'customer',
        avatar: `https://ui-avatars.com/api/?name=Facebook+User&background=1877f2&color=fff`
      };
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === facebookUser.email);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        onLogin(facebookUser);
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors z-10 active:scale-95 touch-manipulation"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-900 mb-2">
              {mode === 'login' ? t.auth.welcome : mode === 'register' ? t.auth.join : t.auth.reset_password}
            </h2>
            <p className="text-sm sm:text-base text-coffee-600">
              {mode === 'login' ? t.auth.sign_in_desc : mode === 'register' ? t.auth.create_desc : t.auth.reset_desc}
            </p>
          </div>

          {success && mode === 'forgot-password' ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold text-base mb-1">{t.auth.reset_success}</p>
                <p>{t.auth.reset_success_desc}</p>
              </div>
              <button 
                onClick={() => {
                  setMode('login');
                  setSuccess(false);
                  setError('');
                  setEmail('');
                }}
                className="w-full bg-coffee-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-coffee-900/20 flex items-center justify-center gap-2"
              >
                {t.auth.back_to_login}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
          <form onSubmit={mode === 'forgot-password' ? handleForgotPassword : handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-coffee-800 mb-1">{t.auth.name}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    placeholder="John Doe"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-coffee-800 mb-1">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  placeholder={language === 'vi' ? 'Email hoặc SĐT...' : 'Email or Phone...'}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-coffee-800 mb-1">{t.auth.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-coffee-800 mb-1">{t.auth.confirm_password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    placeholder="••••••••"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setError('');
                    setPassword('');
                  }}
                  className="text-sm text-amber-600 font-medium hover:underline"
                >
                  {t.auth.forgot_password}
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-coffee-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-coffee-900/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? t.auth.sign_in : mode === 'register' ? t.auth.create : t.auth.reset_password}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          )}

          {mode !== 'forgot-password' && (
            <div className="mt-6 text-center">
              <p className="text-coffee-600 text-sm">
                {mode === 'login' ? `${t.auth.no_acc} ` : `${t.auth.have_acc} `}
                <button 
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                    setConfirmPassword(''); // Reset confirm password on toggle
                  }}
                  className="text-amber-600 font-bold hover:underline"
                >
                  {mode === 'login' ? t.auth.create : t.auth.sign_in}
                </button>
              </p>
            </div>
          )}

          {mode === 'forgot-password' && !success && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setMode('login');
                  setError('');
                  setEmail('');
                }}
                className="text-coffee-600 text-sm font-medium hover:underline"
              >
                {t.auth.back_to_login}
              </button>
            </div>
          )}
          
          {/* Social Login Buttons */}
          {mode !== 'forgot-password' && !success && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500 mb-4">{t.auth.continue_with}</p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.auth.sign_in_google}
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] border-2 border-[#1877F2] rounded-xl font-semibold text-white hover:bg-[#166FE5] hover:border-[#166FE5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t.auth.sign_in_facebook}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;