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

// Bulletproof Firebase Admin initialization
function getFbAdminApp() {
  console.log('🔥 Checking existing Firebase apps:', getApps().length)
  
  let fbAdminApp
  const existingApps = getApps()
  
  if (existingApps.length > 0) {
    console.log('✅ Using existing Firebase app')
    fbAdminApp = existingApps[0]
  } else {
    try {
      // Use the service account JSON from environment variable
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : {
            type: "service_account",
            project_id: "legitpoll-v2",
            private_key_id: "76f1311acccaf6edfe4c9462f8fbf426476f329c",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2l7Lj2OJ1TGl+\nV6HAXdHeGqJq3XHNS6NsmBo+pkd1Pp6qXjsJfDWNh+0xDTrQIf/4zpIn+BPPCDTZ\n0c+pFmcxyEWXNABecAqWnG7T8q6tR61rkPJMbf1/RExpE+WsAGorHH3a8MFaqAud\nPtTPvlE0btWusp8aJf53wiMRXBk9wlAVo0uFcio90oASbk7LPFMYC5wcyHoa2W6c\n6E73zvVlvaGskzQmmnoCW8y4In/9GMgPuXaA+ROQS1q9uKZm5LSdJAdDacQNPXar\nze7S0wck2wLSOjGlYnUD5RJZv+A7r00NyifNAlJcUUyvs/zoxXBGhaLzs0/D8cOr\nSuBCOpTfAgMBAAECggEAA0Sh0gwuuXS9qqI85emH+Ra283y1Lbx911K9nYNyYfnV\n8yyul9PeTYMyTp9y/wiswTJJUWfSSvFVqNRliBw7ipuQC03F9+q/dcSlAywjzjwr\nMXKts4qAcAez6mmNwc9cFxtycTm/7DR3yL+4JWO9pleZgX/28wvdCx2xbP0eAonx\nEWNd8vgTiSsL49JlXMovsN4pJl9LbxADmQX9H5n/liO6Gr3tK9EnX9Fz6xiwn/kL\nafuwpgRKQgppNQtBIWpgc12FDKZFE5Mudt0hgo+D1Bh0SmWVWHUmARUaHQi2W2xR\n1Aml96Nk1blJneQwX8yqBHL6nmwxASchngYtFoUP0QKBgQDcJF+6MCgrtZD4vZ20\nimnrlSQD52/Cie5S98d6nqJVkrSiA47omxsXKNSvsopNBKw8V02Z265+1S2pkFWQ\nwi+alody0RKUnW9K2Wmg4JVaLa7nAaWlB/FmSrgAXY7KHBuYvUd9h5a3+AT3UaHP\n1f7PLN5h9NVMxXYEVDk4Z4+YWQKBgQDUVY+pREKumgZfNAQRX7FYOPPP9mUzA53s\nfwabscE1ErGl3BQ+8Vi3GRMQrioL+nXYiUIKGrhMM6ioyOTmywHz47L37cwBa9IX\nTAq+MN8XVdQSdnkbVmeSfgJAcP1+2c865JgNSpRPugqRWHBmQXjBmARt3bxPFgYq\nBwTBPKBv9wKBgQC8DnKcSiE23Z8fblP3c7pyHnCqyR1m0Y9+3t5QeI1yjqWyNVny\niPXGfgHaqamNi61ayrWm9syE2rVsQblmtQwXgfnpcoLt4+O7zCh43wGXDKl5+6U2\naqekW7X90e515zcH7sHQkXCGbeBIKjsRodxPvSOoCI/iSli77/sFnSpE2QKBgBkk\nSG5ydrLV6gs7zX+BJS6dD8GAG1t/AiQOpmmpEoeGPyK0fHE3gpmrjmZbOP9SGMIa\n/obTwx7CvyW9I91wDDskqvxQW+ePLME1b9A1WTUaJJJLFOv3vyvJX9rhhiKPB8qh\nZp+sRQNrs/Sh1C1Hc1T4+w1HRBTZNsGjMxzuYNDhAoGAahy82pSaKD9KmY8aCclj\nkwgQTQdy57dY9EWA/4i1ijmy8V0HpPsP7l5cJSUwwMmXZGinkLryvGPX3giJyWU0\nTYclw7Wn1axUi+Jnx1rlnfQQt3yGkyyJ9BEI8ULIh7vujA2vS2U1w2aHYjD91jRy\nOmq8RkGTpMCMR6fXdt67JeY=\n-----END PRIVATE KEY-----\n",
            client_email: "firebase-adminsdk-fbsvc@legitpoll-v2.iam.gserviceaccount.com",
            client_id: "116762808887362312770",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40legitpoll-v2.iam.gserviceaccount.com",
            universe_domain: "googleapis.com"
          }

      console.log('🔧 Service account check:', {
        project_id: serviceAccount.project_id ? 'EXISTS' : 'MISSING',
        client_email: serviceAccount.client_email ? 'EXISTS' : 'MISSING',
        private_key: serviceAccount.private_key ? 'EXISTS' : 'MISSING'
      })

      fbAdminApp = initializeApp({
        credential: cert(serviceAccount)
      })
      
      console.log('🔥 Firebase Admin initialized successfully!')
    } catch (error) {
      console.error('❌ Firebase Admin init failed:', error.message)
      return null
    }
  }
  
  return fbAdminApp
}

// Function to save user to Firestore
const saveUserToFirestore = async (userId, userData) => {
  try {
    const fbAdminApp = getFbAdminApp()
    if (!fbAdminApp) {
      throw new Error('Firebase Admin App not initialized')
    }
    
    const db = getFirestore(fbAdminApp)
    const userRef = db.collection('users').doc(userId)
    
    // Check if user already exists
    const userDoc = await userRef.get()
    
    if (!userDoc.exists) {
      await userRef.set({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('✅ New user saved to Firestore:', userId)
    } else {
      await userRef.update({
        ...userData,
        updatedAt: new Date()
      })
      console.log('✅ User updated in Firestore:', userId)
    }
  } catch (error) {
    console.error('❌ Failed to save user to Firestore:', error.message)
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

export { handler as GET, handler as POST }