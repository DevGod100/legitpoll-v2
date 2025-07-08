// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export function getFbAdminApp() {
  const existingApps = getApps()
  
  if (existingApps.length > 0) {
    return existingApps[0]
  }
  
  try {
    // Use the exact same logic as your working NextAuth route
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }

    console.log('🔧 Service account check:', {
      project_id: serviceAccount.project_id ? 'EXISTS' : 'MISSING',
      client_email: serviceAccount.client_email ? 'EXISTS' : 'MISSING',
      private_key: serviceAccount.private_key ? 'EXISTS' : 'MISSING'
    })

    return initializeApp({
      credential: cert(serviceAccount)
    })
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message)
    return null
  }
}