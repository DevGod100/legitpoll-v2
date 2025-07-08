// components/polls/VoteButtons.js
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { votePoll } from '@/lib/pollUtils';

export default function VoteButtons({ pollId, option1, option2, onVoteSuccess }) {
  const { data: session } = useSession();
  const [voting, setVoting] = useState(false);

  const handleVote = async (choice) => {
    if (!session) {
      alert('Please sign in to vote');
      return;
    }

    setVoting(true);
    try {
      const result = await votePoll({ pollId, choice });
      onVoteSuccess?.(choice, result);
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.message || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={() => handleVote('option1')}
        disabled={voting || !session}
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
        size="lg"
      >
        {voting ? 'Voting...' : option1}
      </Button>
      
      <Button
        onClick={() => handleVote('option2')}
        disabled={voting || !session}
        className="w-full h-12 bg-red-500 hover:bg-red-600 text-white"
        size="lg"
      >
        {voting ? 'Voting...' : option2}
      </Button>

      {!session && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Sign in to vote and see platform breakdowns
        </p>
      )}
    </div>
  );
}