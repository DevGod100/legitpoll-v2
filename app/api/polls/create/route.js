// app/api/polls/create/route.js - USING WORKING FIREBASE SETUP
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Copy the exact working function from your NextAuth route
function getFbAdminApp() {
  const existingApps = getApps()
  
  if (existingApps.length > 0) {
    return existingApps[0]
  }
  
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }

    return initializeApp({
      credential: cert(serviceAccount)
    })
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message)
    return null
  }
}

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

    const fbAdminApp = getFbAdminApp()
    if (!fbAdminApp) {
      throw new Error('Firebase Admin App not initialized')
    }
    
    const db = getFirestore(fbAdminApp)
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
    console.error('❌ Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll: ' + error.message }, { status: 500 });
  }
}