// app/api/polls/[id]/route.js - EXACT COPY OF WORKING NEXTAUTH PATTERN
import { NextResponse } from 'next/server';
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const fbAdminApp = getFbAdminApp()
    if (!fbAdminApp) {
      throw new Error('Firebase Admin App not initialized')
    }
    
    const db = getFirestore(fbAdminApp)
    const pollDoc = await db.collection('polls').doc(id).get()

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
    console.error('❌ Error getting poll:', error);
    return NextResponse.json({ error: 'Failed to get poll' }, { status: 500 });
  }
}