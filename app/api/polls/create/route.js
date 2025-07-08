// app/api/polls/create/route.js - TEST VERSION WITHOUT AUTH
import { NextResponse } from 'next/server';
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
    console.log('🚀 Poll creation started - NO AUTH CHECK');

    const { question, option1, option2 } = await request.json();
    console.log('📝 Poll data:', { question, option1, option2 });

    if (!question?.trim() || !option1?.trim() || !option2?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    console.log('🔥 Initializing Firebase Admin...');
    const fbAdminApp = getFbAdminApp();
    if (!fbAdminApp) {
      console.error('❌ Firebase Admin failed to initialize');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    console.log('✅ Firebase Admin initialized');

    const db = getFirestore(fbAdminApp);
    const urlSlug = createUrlSlug(question);
    const createdBy = 'test-user';
    
    console.log('👤 Created by:', createdBy);
    console.log('🔗 URL slug:', urlSlug);

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

    console.log('💾 Saving to Firestore...');
    const docRef = await db.collection('polls').add(pollData);
    console.log('✅ Poll saved with ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true, 
      pollId: docRef.id,
      urlSlug 
    });

  } catch (error) {
    console.error('❌ Error creating poll:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to create poll: ' + error.message }, { status: 500 });
  }
}