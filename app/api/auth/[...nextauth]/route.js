import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import RedditProvider from 'next-auth/providers/reddit'

console.log('🔧 NextAuth.js config loading...')
console.log('🔑 Twitter Client ID:', process.env.TWITTER_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Twitter Secret:', process.env.TWITTER_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Client ID:', process.env.REDDIT_CLIENT_ID ? 'EXISTS' : 'MISSING')
console.log('🔑 Reddit Secret:', process.env.REDDIT_CLIENT_SECRET ? 'EXISTS' : 'MISSING')
console.log('🔑 NextAuth Secret:', process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING')

const handler = NextAuth({
  debug: true,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
      // Remove version: "2.0" to use OAuth 1.0a
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('📝 Session callback:', { session, token })
      session.provider = token.provider
      session.username = token.username
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        console.log('🎫 JWT callback - new login:', { provider: account.provider, profile })
        token.provider = account.provider
        if (account.provider === 'twitter') {
          token.username = profile.screen_name || profile.username
        } else if (account.provider === 'reddit') {
          token.username = profile.name
        }
      }
      return token
    }
  }
})

export { handler as GET, handler as POST }