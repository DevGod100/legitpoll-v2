// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import RedditProvider from 'next-auth/providers/reddit'
import { FirestoreAdapter } from '@auth/firebase-adapter'
import { cert } from 'firebase-admin/app'

console.log('🔧 NextAuth.js config loading...')
console.log('🔑 Twitter Client ID:', process.env.TWITTER_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Twitter Secret:', process.env.TWITTER_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Client ID:', process.env.REDDIT_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Secret:', process.env.REDDIT_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 NextAuth Secret:', process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING')

const handler = NextAuth({
  debug: true,
  
  // Firebase adapter - saves users automatically to Firestore
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),
  
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
    async session({ session, user }) {
      console.log('📝 Session callback:', { 
        userId: user.id,
        provider: user.platform || 'unknown'
      })
      
      // Add custom fields from Firestore user to session
      session.user.id = user.id
      session.user.platform = user.platform
      session.user.username = user.username
      session.user.verified = user.verified
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      console.log('🎫 Sign in callback:', { 
        provider: account.provider, 
        profileName: profile?.name || profile?.screen_name 
      })
      
      // Add platform-specific data to user object (saved to Firestore)
      if (account.provider === 'twitter') {
        user.platform = 'twitter'
        user.username = profile.screen_name || profile.username
        user.verified = profile.verified || false
        user.profileUrl = `https://twitter.com/${profile.screen_name}`
      } else if (account.provider === 'reddit') {
        user.platform = 'reddit'
        user.username = profile.name
        user.verified = profile.verified || false
        user.profileUrl = `https://reddit.com/u/${profile.name}`
      }
      
      return true
    }
  }
})

export { handler as GET, handler as POST }