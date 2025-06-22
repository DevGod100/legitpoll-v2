// components/PollsFeed.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function PollsFeed({ currentUser, onLoginRequired }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - replace with Firestore
  useEffect(() => {
    const mockPolls = [
      {
        id: "poll_1",
        question: "Should pineapple go on pizza?",
        yesVotes: 1247,
        noVotes: 892,
        platformBreakdown: {
          google: { yes: 234, no: 156 },
          twitter: { yes: 567, no: 234 },
          reddit: { yes: 445, no: 502 }
        },
        commentCount: 89,
        createdAt: new Date(Date.now() - 86400000),
        createdBy: "user_456"
      },
      {
        id: "poll_2", 
        question: "Is working from home better than office work?",
        yesVotes: 2156,
        noVotes: 743,
        platformBreakdown: {
          google: { yes: 445, no: 123 },
          twitter: { yes: 892, no: 234 },
          reddit: { yes: 734, no: 356 }
        },
        commentCount: 156,
        createdAt: new Date(Date.now() - 172800000),
        createdBy: "user_789"
      }
    ];

    setTimeout(() => {
      setPolls(mockPolls);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = (pollId, choice) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }
    
    // Optimistic update
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const newPoll = { ...poll };
          if (choice === 'yes') {
            newPoll.yesVotes += 1;
          } else {
            newPoll.noVotes += 1;
          }
          return newPoll;
        }
        return poll;
      })
    );

    // TODO: Save vote to Firestore
    console.log('Voting:', { pollId, choice, userId: currentUser?.id });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 h-14 bg-muted rounded-xl"></div>
                <div className="flex-1 h-14 bg-muted rounded-xl"></div>
              </div>
              <div className="h-2 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map(poll => (
        <PollCard 
          key={poll.id}
          poll={poll}
          currentUser={currentUser}
          onVote={handleVote}
          onLoginRequired={onLoginRequired}
        />
      ))}
    </div>
  );
}

function PollCard({ poll, currentUser, onVote, onLoginRequired }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [userVote, setUserVote] = useState(null);

  const totalVotes = poll.yesVotes + poll.noVotes;
  const yesPercentage = totalVotes > 0 ? Math.round((poll.yesVotes / totalVotes) * 100) : 0;
  const noPercentage = 100 - yesPercentage;

  const handleVoteClick = (choice) => {
    if (userVote) return; // Already voted
    
    setUserVote(choice);
    onVote(poll.id, choice);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        {/* Question */}
        <h2 className="text-xl font-semibold mb-6 leading-tight">
          {poll.question}
        </h2>

        {/* Vote Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => handleVoteClick('yes')}
            variant={userVote === 'yes' ? 'default' : 'outline'}
            size="lg"
            className={`flex-1 h-16 text-lg font-bold ${
              userVote === 'yes' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'hover:bg-green-50 hover:border-green-300 hover:text-green-700'
            } ${userVote && userVote !== 'yes' ? 'opacity-50' : ''}`}
            disabled={userVote && userVote !== 'yes'}
          >
            YES
          </Button>
          <Button
            onClick={() => handleVoteClick('no')}
            variant={userVote === 'no' ? 'default' : 'outline'}
            size="lg"
            className={`flex-1 h-16 text-lg font-bold ${
              userVote === 'no' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'hover:bg-red-50 hover:border-red-300 hover:text-red-700'
            } ${userVote && userVote !== 'no' ? 'opacity-50' : ''}`}
            disabled={userVote && userVote !== 'no'}
          >
            NO
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>YES {yesPercentage}%</span>
            <span>{totalVotes.toLocaleString()} votes</span>
            <span>NO {noPercentage}%</span>
          </div>
          
          <Progress value={yesPercentage} className="h-3" />
        </div>

        {/* Platform Breakdown Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full justify-start text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          {showBreakdown ? '▼' : '▶'} Platform breakdown
        </Button>

        {/* Platform Breakdown */}
        {showBreakdown && (
          <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
            {Object.entries(poll.platformBreakdown).map(([platform, votes]) => {
              const platformTotal = votes.yes + votes.no;
              const platformYesPercent = platformTotal > 0 ? Math.round((votes.yes / platformTotal) * 100) : 0;
              
              return (
                <div key={platform} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={platform} />
                    <span className="capitalize font-medium">{platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${platformYesPercent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-muted-foreground">
                      {platformTotal} votes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => !currentUser && onLoginRequired()}
          >
            💬 {poll.commentCount} comments
          </Button>
          <span>{formatTimeAgo(poll.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformBadge({ platform }) {
  const badges = {
    google: { bg: 'bg-red-500', text: 'G', name: 'Google' },
    twitter: { bg: 'bg-blue-500', text: 'X', name: 'Twitter' },
    reddit: { bg: 'bg-orange-500', text: 'R', name: 'Reddit' },
    truthsocial: { bg: 'bg-purple-500', text: 'T', name: 'Truth Social' }
  };

  const badge = badges[platform] || { bg: 'bg-gray-500', text: '?', name: 'Unknown' };

  return (
    <Badge 
      className={`${badge.bg} text-white w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold`}
      title={badge.name}
    >
      {badge.text}
    </Badge>
  );
}