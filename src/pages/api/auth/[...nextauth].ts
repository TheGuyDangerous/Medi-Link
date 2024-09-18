import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from '@/lib/supabase'
import bcrypt from "bcryptjs"

// Update this interface near the top of the file
interface CustomSession extends Session {
  user: (Session["user"] & { role?: string }) | undefined
}

interface CustomUser extends User {
  role?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user || !user.password) {
          return null
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as CustomUser
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role
      }
      return token
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: session.user ? {
          ...session.user,
          role: token.role as string | undefined
        } : undefined
      } as CustomSession
    }
  },
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)