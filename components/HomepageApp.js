// components/HomepageApp.js
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PollsFeed from '@/components/PollsFeed';
import Login from '@/components/Login';

export default function HomepageApp() {
  const { data: session, status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLoginRequired = () => {
    setShowLogin(true);
  };

  const handleSignIn = async (provider) => {
    try {
      await signIn(provider);
      setShowLogin(false);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-md mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg">🗳️</span>
            </div>
            <h1 className="text-xl font-bold">LegitPoll</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setShowProfile(true)}>
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                  <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto py-6 px-4">
        {/* Welcome Message for New Users */}
        {!session && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-3">🗳️</div>
              <h2 className="text-lg font-semibold mb-2">Welcome to LegitPoll</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Browse polls below. Sign in to vote and see platform breakdowns!
              </p>
              <Button onClick={() => setShowLogin(true)} size="sm">
                Sign In to Vote
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Welcome Back */}
        {session && (
          <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                  <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Welcome back, {session.user.name}!</p>
                  <p className="text-sm text-muted-foreground">
                    Your votes count towards {session.user.platform || 'platform'} stats
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Polls Feed */}
        <PollsFeed 
          currentUser={session?.user} 
          onLoginRequired={handleLoginRequired}
        />
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sign In to Vote</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLogin(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Login />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfile && session && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowProfile(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                  <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  <p className="text-xs text-muted-foreground">Via {session.user.platform || 'OAuth'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📊</span>
                  My Voting History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🗳️</span>
                  My Polls
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">⚙️</span>
                  Account Settings
                </Button>
              </div>

              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  setShowProfile(false);
                  signOut();
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      {session && (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-md mx-auto px-4 py-2">
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 text-primary">
                <span className="text-lg mb-1">🏠</span>
                <span className="text-xs">Home</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <span className="text-lg mb-1">➕</span>
                <span className="text-xs">Create</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                <span className="text-lg mb-1">📊</span>
                <span className="text-xs">Trending</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col h-auto py-2"
                onClick={() => setShowProfile(true)}
              >
                <span className="text-lg mb-1">👤</span>
                <span className="text-xs">Profile</span>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}