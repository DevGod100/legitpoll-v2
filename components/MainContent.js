// components/MainContent.js
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MainContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleAuth = (user) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
              <AuthButton onAuth={handleAuth} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto py-6 px-4">
        {!currentUser ? (
          /* Welcome Screen */
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 text-6xl">🗳️</div>
                <h2 className="text-2xl font-bold">Welcome to LegitPoll</h2>
                <p className="text-muted-foreground">
                  Where social media users debate through polls. Vote on yes/no questions and see how different platforms think!
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <FeatureItem color="bg-green-500" text="Real-time voting with platform breakdowns" />
                  <FeatureItem color="bg-blue-500" text="Threaded discussions with social embeds" />
                  <FeatureItem color="bg-purple-500" text="Connect with Google, Twitter, Reddit & more" />
                </div>

                <AuthButton onAuth={handleAuth} variant="primary" />
              </CardContent>
            </Card>

            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Preview Active Polls</h3>
              <PreviewPollCards />
            </div>
          </div>
        ) : (
          /* Authenticated User Feed */
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <PlatformBadge platform={currentUser.platform} />
                  <div>
                    <p className="font-medium">Welcome back, {currentUser.displayName}!</p>
                    <p className="text-sm text-muted-foreground">
                      Ready to share your opinion? Tap on any poll below to vote.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center text-muted-foreground">
              <p>Poll feed component will be added next...</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      {currentUser && (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-md mx-auto px-4 py-2">
            <div className="flex justify-around">
              <NavButton icon="🏠" label="Home" active />
              <NavButton icon="➕" label="Create" />
              <NavButton icon="📊" label="Trending" />
              <NavButton icon="👤" label="Profile" />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

// Helper Components
function FeatureItem({ color, text }) {
  return (
    <div className="flex items-center space-x-3 text-left">
      <div className={`h-2 w-2 rounded-full ${color}`}></div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

function NavButton({ icon, label, active = false }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`flex-col h-auto py-2 ${active ? 'text-primary' : ''}`}
    >
      <span className="text-lg mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Button>
  );
}

function PlatformBadge({ platform, size = 'md' }) {
  const badges = {
    google: { bg: 'bg-red-500', text: 'G', name: 'Google' },
    twitter: { bg: 'bg-blue-500', text: 'X', name: 'Twitter' },
    reddit: { bg: 'bg-orange-500', text: 'R', name: 'Reddit' },
    truthsocial: { bg: 'bg-purple-500', text: 'T', name: 'Truth Social' }
  };

  const badge = badges[platform] || { bg: 'bg-gray-500', text: '?', name: 'Unknown' };
  const sizeClasses = size === 'sm' ? 'w-4 h-4 text-xs' : 'w-6 h-6 text-sm';

  return (
    <Badge variant="secondary" className={`${badge.bg} ${sizeClasses} rounded-full text-white p-0 flex items-center justify-center`}>
      {badge.text}
    </Badge>
  );
}

function AuthButton({ onAuth, variant = 'secondary' }) {
  const [showProviders, setShowProviders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const providers = [
    { id: 'google', name: 'Google', icon: '🔍', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'truthsocial', name: 'Truth Social', icon: '🇺🇸', color: 'bg-purple-500 hover:bg-purple-600' }
  ];

  const handleProviderLogin = async (providerId) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: `user_${Date.now()}`,
        platform: providerId,
        username: providerId === 'google' ? 'user@gmail.com' : `@user_${providerId}`,
        displayName: `User from ${providers.find(p => p.id === providerId)?.name}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${providerId}`,
        verified: providerId === 'twitter'
      };
      
      onAuth(mockUser);
      setShowProviders(false);
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showProviders) {
    return (
      <Button 
        onClick={() => setShowProviders(true)}
        variant={variant === 'primary' ? 'default' : 'outline'}
      >
        Sign in to vote
      </Button>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <p className="text-sm text-muted-foreground text-center mb-3">
        Choose your platform:
      </p>
      
      {providers.map((provider) => (
        <Button
          key={provider.id}
          onClick={() => handleProviderLogin(provider.id)}
          disabled={isLoading}
          className={`w-full ${provider.color} text-white hover:text-white`}
          variant="default"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <span className="text-lg mr-2">{provider.icon}</span>
          )}
          Continue with {provider.name}
        </Button>
      ))}
      
      <Button variant="ghost" onClick={() => setShowProviders(false)} className="w-full">
        Cancel
      </Button>
    </div>
  );
}

function PreviewPollCards() {
  return (
    <div className="space-y-4">
      {[
        { question: "Should pineapple go on pizza?", yes: 67, no: 33 },
        { question: "Is working from home better than office work?", yes: 74, no: 26 }
      ].map((poll, index) => (
        <Card key={index} className="opacity-75">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">{poll.question}</h3>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-800 font-medium">
                YES
              </div>
              <div className="flex-1 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-800 font-medium">
                NO
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>YES {poll.yes}%</span>
              <span>NO {poll.no}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${poll.yes}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Sign in to vote and see platform breakdown
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}