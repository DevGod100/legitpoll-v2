// components/polls/PollDisplay.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPoll, votePoll } from '@/lib/pollUtils';

export default function PollDisplay({ pollId }) {
  const { data: session } = useSession();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadPoll();
  }, [pollId]);

  const loadPoll = async () => {
    try {
      const pollData = await getPoll(pollId);
      setPoll(pollData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading poll:', error);
      setLoading(false);
    }
  };

  const handleVote = async (choice) => {
    if (!session) {
      alert('Please sign in to vote');
      return;
    }

    setVoting(true);
    try {
      const result = await votePoll({ pollId, choice });
      
      // Update poll data with new vote counts
      setPoll(prev => ({
        ...prev,
        votes: result.votes
      }));
      
      setUserVote(choice);
      setShowResults(true);
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.message || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Poll not found</h2>
            <p className="text-muted-foreground">This poll may have been deleted or doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVotes = poll.votes.overall.total;
  const option1Percentage = calculatePercentage(poll.votes.overall.option1, totalVotes);
  const option2Percentage = calculatePercentage(poll.votes.overall.option2, totalVotes);

  const twitterOption1Percentage = calculatePercentage(poll.votes.twitter.option1, poll.votes.twitter.total);
  const twitterOption2Percentage = calculatePercentage(poll.votes.twitter.option2, poll.votes.twitter.total);
  
  const redditOption1Percentage = calculatePercentage(poll.votes.reddit.option1, poll.votes.reddit.total);
  const redditOption2Percentage = calculatePercentage(poll.votes.reddit.option2, poll.votes.reddit.total);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container max-w-md mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg">🗳️</span>
            </div>
            <h1 className="text-xl font-bold">LegitPoll</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>
      </header>

      <main className="container max-w-md mx-auto p-4">
        {/* Poll Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{poll.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {totalVotes} votes
              </span>
            </div>
            <CardTitle className="text-lg">{poll.question}</CardTitle>
          </CardHeader>
          
          <CardContent>
            {!showResults && !userVote ? (
              // Voting Interface
              <div className="space-y-3">
                <Button
                  onClick={() => handleVote('option1')}
                  disabled={voting || !session}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
                  size="lg"
                >
                  {voting ? 'Voting...' : poll.option1}
                </Button>
                
                <Button
                  onClick={() => handleVote('option2')}
                  disabled={voting || !session}
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                >
                  {voting ? 'Voting...' : poll.option2}
                </Button>

                {!session && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Sign in to vote and see platform breakdowns
                  </p>
                )}

                {totalVotes > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowResults(true)}
                    className="w-full mt-4"
                  >
                    View Results ({totalVotes} votes)
                  </Button>
                )}
              </div>
            ) : (
              // Results Interface
              <div className="space-y-4">
                {/* Overall Results */}
                <div>
                  <h3 className="font-medium mb-3">Overall Results</h3>
                  
                  {/* Option 1 Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{poll.option1}</span>
                      <span>{option1Percentage}% ({poll.votes.overall.option1})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${option1Percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Option 2 Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{poll.option2}</span>
                      <span>{option2Percentage}% ({poll.votes.overall.option2})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${option2Percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Platform Breakdown */}
                {(poll.votes.twitter.total > 0 || poll.votes.reddit.total > 0) && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Platform Breakdown</h3>
                    
                    {/* Twitter Results */}
                    {poll.votes.twitter.total > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">🐦 Twitter Users</span>
                          <Badge variant="outline">{poll.votes.twitter.total} votes</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-medium">{poll.option1}</div>
                            <div className="text-blue-600">{twitterOption1Percentage}%</div>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <div className="font-medium">{poll.option2}</div>
                            <div className="text-red-600">{twitterOption2Percentage}%</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reddit Results */}
                    {poll.votes.reddit.total > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">🔴 Reddit Users</span>
                          <Badge variant="outline">{poll.votes.reddit.total} votes</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-medium">{poll.option1}</div>
                            <div className="text-blue-600">{redditOption1Percentage}%</div>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <div className="font-medium">{poll.option2}</div>
                            <div className="text-red-600">{redditOption2Percentage}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {userVote && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    You voted for: <strong>
                      {userVote === 'option1' ? poll.option1 : poll.option2}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Section */}
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="font-medium mb-2">Share this poll</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get more Twitter vs Reddit opinions
            </p>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Poll link copied!');
              }}
              variant="outline"
              className="w-full"
            >
              Copy Link
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}