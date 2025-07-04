// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import RedditProvider from 'next-auth/providers/reddit'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

console.log('🔧 NextAuth.js config loading...')
console.log('🔑 Twitter Client ID:', process.env.TWITTER_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Twitter Secret:', process.env.TWITTER_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Client ID:', process.env.REDDIT_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Secret:', process.env.REDDIT_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 NextAuth Secret:', process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING')

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  try {
    // Debug environment variables
    console.log('🔧 Environment variables check:')
    console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'EXISTS' : 'MISSING')
    console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'EXISTS' : 'MISSING')
    console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'EXISTS (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'MISSING')
    
    const firebaseConfig = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'legitpoll-v2',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
    
    if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
      throw new Error('Missing Firebase environment variables')
    }
    
    initializeApp({
      credential: cert(firebaseConfig),
    })
    console.log('🔥 Firebase Admin initialized successfully')
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message)
  }
}

// Function to save user to Firestore
const saveUserToFirestore = async (userId, userData) => {
  try {
    const db = getFirestore()
    const userRef = db.collection('users').doc(userId)
    
    // Check if user already exists
    const userDoc = await userRef.get()
    
    if (!userDoc.exists) {
      // Create new user
      await userRef.set({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('✅ New user saved to Firestore:', userId)
    } else {
      // Update existing user
      await userRef.update({
        ...userData,
        updatedAt: new Date()
      })
      console.log('✅ User updated in Firestore:', userId)
    }
  } catch (error) {
    console.error('❌ Failed to save user to Firestore:', error)
  }
}

const handler = NextAuth({
  debug: true,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🎫 Sign in callback:', { 
        provider: account.provider, 
        profileName: profile?.name || profile?.screen_name 
      })
      
      // Prepare user data for Firestore
      const userData = {
        name: user.name,
        email: user.email,
        image: user.image,
        platform: account.provider,
        username: account.provider === 'twitter' 
          ? (profile.screen_name || profile.username)
          : profile.name,
        verified: profile.verified || false,
        profileUrl: account.provider === 'twitter' 
          ? `https://twitter.com/${profile.screen_name || profile.username}`
          : `https://reddit.com/u/${profile.name}`
      }
      
      // Save to Firestore
      await saveUserToFirestore(user.id, userData)
      
      return true
    },
    
    async session({ session, token }) {
      console.log('📝 Session callback:', { 
        user: session.user?.name, 
        provider: token.provider,
        username: token.username 
      })
      
      // Add platform info to session
      session.user.platform = token.provider
      session.user.username = token.username
      session.user.verified = token.verified || false
      
      return session
    },
    
    async jwt({ token, account, profile }) {
      if (account) {
        console.log('🎫 JWT callback - new login:', { 
          provider: account.provider, 
          profileName: profile?.name || profile?.screen_name 
        })
        
        token.provider = account.provider
        
        if (account.provider === 'twitter') {
          token.username = profile.screen_name || profile.username
          token.verified = profile.verified || false
        } else if (account.provider === 'reddit') {
          token.username = profile.name
          token.verified = profile.verified || false
        }
      }
      return token
    }
  }
})
//test 5
export { handler as GET, handler as POST }