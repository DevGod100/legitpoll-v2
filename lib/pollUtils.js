// lib/pollUtils.js (UPDATED FOR API ROUTES)

// Create a new poll
export async function createPoll({ question, option1, option2 }) {
  try {
    const response = await fetch('/api/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, option1, option2 }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create poll');
    }

    return data.pollId;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

// Get a poll by ID
export async function getPoll(pollId) {
  try {
    const response = await fetch(`/api/polls/${pollId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get poll');
    }

    return data;
  } catch (error) {
    console.error('Error getting poll:', error);
    throw error;
  }
}

// Vote on a poll
export async function votePoll({ pollId, choice }) {
  try {
    const response = await fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ choice }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to vote');
    }

    return data;
  } catch (error) {
    console.error('Error voting on poll:', error);
    throw error;
  }
}