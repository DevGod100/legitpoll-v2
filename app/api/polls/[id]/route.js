// app/api/polls/[id]/route.js
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getFbAdminApp } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const fbAdminApp = getFbAdminApp();
    if (!fbAdminApp) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = getFirestore(fbAdminApp);
    const pollDoc = await db.collection('polls').doc(id).get();

    if (!pollDoc.exists) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const pollData = pollDoc.data();
    
    return NextResponse.json({
      id: pollDoc.id,
      ...pollData,
      createdAt: pollData.createdAt?.toDate?.()?.toISOString() || null,
      lastActivity: pollData.lastActivity?.toDate?.()?.toISOString() || null
    });

  } catch (error) {
    console.error('Error getting poll:', error);
    return NextResponse.json({ error: 'Failed to get poll' }, { status: 500 });
  }
}
