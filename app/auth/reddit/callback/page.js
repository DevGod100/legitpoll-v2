'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RedditCallback() {
  const [status, setStatus] = useState('Processing...');
  const router = useRouter();

  useEffect(() => {
    const handleRedditCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        console.log('URL params:', window.location.search);
        console.log('Code:', code);
        console.log('State:', state);
        console.log('Error:', error);

        if (error) {
          setStatus('Error: ' + error);
          return;
        }

        // Verify state to prevent CSRF attacks
        const storedState = localStorage.getItem('reddit_oauth_state');
        if (state !== storedState) {
          setStatus('Error: Invalid state parameter');
          return;
        }

        if (!code) {
          setStatus('Error: No authorization code received');
          return;
        }

        // Exchange code for access token
        const response = await fetch('/api/auth/reddit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const userData = await response.json();
          // Store user data in localStorage or context
          localStorage.setItem('reddit_user', JSON.stringify(userData));
          setStatus('Success! Redirecting...');
          
          // Redirect back to home page
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          const errorData = await response.json();
          setStatus('Error: ' + (errorData.error || 'Authentication failed'));
        }
      } catch (error) {
        console.error('Reddit callback error:', error);
        setStatus('Error: ' + error.message);
      } finally {
        // Clean up stored state
        localStorage.removeItem('reddit_oauth_state');
      }
    };

    handleRedditCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Reddit Authentication</h1>
        <p className="text-gray-600">{status}</p>
        {status.includes('Error') && (
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}