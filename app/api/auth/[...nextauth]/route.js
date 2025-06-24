// app/api/auth/[...nextauth]/route.js
// Based on official NextAuth example: https://github.com/nextauthjs/next-auth-example

import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import RedditProvider from "next-auth/providers/reddit"

const handler = NextAuth({
  debug: true,
  
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
    }),
  ],
  
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        
        // Add provider-specific info
        if (account.provider === 'twitter') {
          token.username = profile.data?.username || profile.username || profile.screen_name
          token.verified = profile.data?.verified || profile.verified || false
        } else if (account.provider === 'reddit') {
          token.username = profile.name
          token.verified = profile.verified || false
        }
      }
      return token
    },
    
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.user.provider = token.provider
      session.user.username = token.username
      session.user.verified = token.verified
      return session
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
})

export { handler as GET, handler as POST }