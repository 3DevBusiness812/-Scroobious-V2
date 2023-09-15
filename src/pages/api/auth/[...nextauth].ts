import NextAuth, { type User, type Session } from 'next-auth'
import { type JWT, } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';
import SecurePassword from 'secure-password';
import { debug, error } from "~/utils/logger"

const SP = new SecurePassword();

const loginUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: true,
  status: true,
  capabilities: true,
  profilePicture: {
    select: {
      url: true
    }
  }
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials ?? {};

          if (!email || !password) throw new Error(`Invalid credentials`);

          const user = await prisma.user.findUnique({
            where: { email },
            select: loginUserSelect
          });

          const { password: hashedPassword, id, name, status, capabilities, profilePicture } = user!

          if (!hashedPassword || !id) throw new Error(`Invalid credentials`);

          const hashVerifyResult = await SP.verify(
            Buffer.from(password),
            Buffer.from(hashedPassword, 'base64')
          );

          if (hashVerifyResult !== SecurePassword.VALID) {
            throw new Error(`Invalid credentials`);
          }

          return {
            id,
            name,
            email,
            status,
            capabilities,
            image: profilePicture?.url,
          } as unknown as User;
        } catch (err) {
          error(err);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User | undefined }) {
      return {
        ...token,
        ...user && {
          status: user?.status,
          capabilities: user?.capabilities
        }
      };
    },
    async session({ session, user, token }: {
      session: Session,
      user: User,
      token: JWT,
    }) {
      const impersonatingFromUserId = token.impersonatingFromUserId
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          image: token.picture,
          status: token.status,
          capabilities: token.capabilities,
          id: token.sub
        },
        ...impersonatingFromUserId && { impersonatingFromUserId }
      } as Session
    },
  },

  pages: {
    signIn: '/auth/login', // Displays signin buttons,
  },
}

export default NextAuth(authOptions)
