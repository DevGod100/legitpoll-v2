// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export function getFbAdminApp() {
  const existingApps = getApps()
  
  if (existingApps.length > 0) {
    return existingApps[0]
  }
  
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }

    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      console.error('Missing Firebase env vars')
      throw new Error('Missing required Firebase environment variables')
    }

    return initializeApp({
      credential: cert(serviceAccount)
    })
  } catch (error) {
    console.error('Firebase Admin init failed:', error)
    return null
  }
}