// app/api/polls/create/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getFirestore } from 'firebase-admin/firestore';
import { getFbAdminApp } from '@/lib/firebase-admin';

function createUrlSlug(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, option1, option2 } = await request.json();

    if (!question?.trim() || !option1?.trim() || !option2?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const fbAdminApp = getFbAdminApp();
    if (!fbAdminApp) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = getFirestore(fbAdminApp);
    const urlSlug = createUrlSlug(question);
    const createdBy = session.user.email || session.user.name || session.user.id || 'anonymous';

    const pollData = {
      question: question.trim(),
      option1: option1.trim(),
      option2: option2.trim(),
      urlSlug,
      createdBy,
      createdAt: new Date(),
      isActive: true,
      
      votes: {
        twitter: { option1: 0, option2: 0, total: 0 },
        reddit: { option1: 0, option2: 0, total: 0 },
        overall: { option1: 0, option2: 0, total: 0 }
      },
      
      commentCount: 0,
      totalEngagement: 0,
      hotScore: 0,
      lastActivity: new Date(),
      category: 'general',
      tags: []
    };

    const docRef = await db.collection('polls').add(pollData);
    
    return NextResponse.json({ 
      success: true, 
      pollId: docRef.id,
      urlSlug 
    });

  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}