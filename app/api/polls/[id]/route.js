// app/api/polls/[id]/route.js - DEBUG VERSION
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getFbAdminApp } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('🚀 Poll GET started for ID:', id);
    console.log('🔧 Environment check:', {
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'EXISTS' : 'MISSING',
      client_email: process.env.FIREBASE_CLIENT_EMAIL ? 'EXISTS' : 'MISSING',
      private_key: process.env.FIREBASE_PRIVATE_KEY ? 'EXISTS (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'MISSING'
    });
    
    console.log('🔥 Initializing Firebase Admin...');
    const fbAdminApp = getFbAdminApp();
    
    if (!fbAdminApp) {
      console.error('❌ Firebase Admin App is null');
      return NextResponse.json({ error: 'Database connection failed - Firebase Admin null' }, { status: 500 });
    }
    
    console.log('✅ Firebase Admin initialized successfully');
    
    const db = getFirestore(fbAdminApp);
    console.log('📊 Getting Firestore reference...');
    
    const pollDoc = await db.collection('polls').doc(id).get();
    console.log('📄 Poll document exists:', pollDoc.exists);

    if (!pollDoc.exists) {
      console.log('❌ Poll document not found in Firestore');
      return NextResponse.json({ error: 'Poll not found in database' }, { status: 404 });
    }

    const pollData = pollDoc.data();
    console.log('✅ Poll data retrieved successfully');
    
    return NextResponse.json({
      id: pollDoc.id,
      ...pollData,
      createdAt: pollData.createdAt?.toDate?.()?.toISOString() || null,
      lastActivity: pollData.lastActivity?.toDate?.()?.toISOString() || null
    });

  } catch (error) {
    console.error('❌ Complete error details:');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to get poll', 
      details: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}