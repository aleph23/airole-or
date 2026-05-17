import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Only configure Google provider if environment variables are available
const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  )
}

// Helper function to refresh Google access tokens
async function refreshAccessToken(token: any) {
  try {
    const url = 'https://oauth2.googleapis.com/token'
    
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error('Error refreshing access token', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

const handler = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Simply allow sign in without database operations
      return true
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
          refreshToken: account.refresh_token,
          user,
          email: user.email,
          name: user.name || undefined,
          picture: user.image || undefined,
        }
      }

      // Return previous token if the access token has not expired yet
      // Refresh 5 minutes before expiration (buffer)
      if (Date.now() < (token.accessTokenExpires as number) - 300000) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.error = token.error
      
      // Use token data directly without database lookup
      if (token.email) {
        session.user = {
          ...session.user,
          email: token.email as string,
          name: token.name as string || '',
          image: token.picture as string || '',
        }
      }
      
      return session
    },
  },
})

export { handler as GET, handler as POST } 