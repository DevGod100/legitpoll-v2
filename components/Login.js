'use client';

import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, twitterProvider } from '../lib/firebase';
import { useState, useEffect } from 'react';

export default function Login() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Signed in with Google:', result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      console.log('Signed in with Twitter:', result.user);
    } catch (error) {
      console.error('Error signing in with Twitter:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (user) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Welcome!</h2>
        <div className="flex items-center gap-3 mb-4">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
              {user.providerData[0]?.providerId === 'google.com' ? 'Google User' : 
               user.providerData[0]?.providerId === 'twitter.com' ? 'Twitter User' : 'User'}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign in to LegitPoll</h2>
      
      <button
        onClick={signInWithGoogle}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mb-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <button
        onClick={signInWithTwitter}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Continue with Twitter
      </button>
    </div>
  );
}