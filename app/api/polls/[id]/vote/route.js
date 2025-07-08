// app/api/polls/[id]/vote/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getFirestore } from 'firebase-admin/firestore';
import { getFbAdminApp } from '@/lib/firebase-admin';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: pollId } = params;
    const { choice } = await request.json();

    if (!choice || !['option1', 'option2'].includes(choice)) {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
    }

    const fbAdminApp = getFbAdminApp();
    if (!fbAdminApp) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = getFirestore(fbAdminApp);
    const userId = session.user.email || session.user.name || session.user.id;
    const platform = session.user.platform;

    // Check if user already voted
    const existingVote = await db.collection('votes')
      .where('pollId', '==', pollId)
      .where('userId', '==', userId)
      .get();

    if (!existingVote.empty) {
      return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 400 });
    }

    // Add vote record
    await db.collection('votes').add({
      pollId,
      userId,
      platform,
      choice,
      timestamp: new Date()
    });

    // Update poll vote counts
    const pollRef = db.collection('polls').doc(pollId);
    const pollDoc = await pollRef.get();
    
    if (!pollDoc.exists) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const currentVotes = pollDoc.data().votes;
    
    const updatedVotes = {
      ...currentVotes,
      [platform]: {
        ...currentVotes[platform],
        [choice]: currentVotes[platform][choice] + 1,
        total: currentVotes[platform].total + 1
      },
      overall: {
        ...currentVotes.overall,
        [choice]: currentVotes.overall[choice] + 1,
        total: currentVotes.overall.total + 1
      }
    };

    await pollRef.update({
      votes: updatedVotes,
      lastActivity: new Date(),
      totalEngagement: (pollDoc.data().totalEngagement || 0) + 1
    });

    return NextResponse.json({ success: true, votes: updatedVotes });

  } catch (error) {
    console.error('Error voting on poll:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}