'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Login() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (session) {
    console.log('Session status:', status);
console.log('Session data:', session);
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Welcome!</h2>
        <div className="flex items-center gap-3 mb-4">
          {session.user.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-gray-600">@{session.username}</p>
            <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
              session.provider === 'twitter' ? 'bg-black text-white' :
              session.provider === 'reddit' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {session.provider === 'twitter' ? 'Twitter User' :
               session.provider === 'reddit' ? 'Reddit User' : 'User'}
            </span>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Join the Political Debate</h2>
      <p className="text-gray-600 mb-6">See how Twitter vs Reddit users vote on controversial topics</p>
      
      <button
        onClick={() => signIn('twitter')}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-3"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Continue with Twitter
      </button>

      <button
        onClick={() => signIn('reddit')}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
        Continue with Reddit
      </button>
    </div>
  );
}