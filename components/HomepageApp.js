// components/HomepageApp.js
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PollsFeed from '@/components/PollsFeed';
import Login from '@/components/Login';

export default function HomepageApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleAuth = (user) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  const handleLoginRequired = () => {
    setShowLogin(true);
  };

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
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                  <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
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
        {!currentUser && (
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
        {currentUser && (
          <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                  <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Welcome back, {currentUser.displayName}!</p>
                  <p className="text-sm text-muted-foreground">
                    Your votes count towards {currentUser.platform} platform stats
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Polls Feed */}
        <PollsFeed 
          currentUser={currentUser} 
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
              <Login onAuth={handleAuth} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      {currentUser && (
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
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
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