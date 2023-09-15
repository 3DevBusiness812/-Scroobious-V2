import NextAuth, { DefaultUser } from 'next-auth'
import { JWT } from "next-auth/jwt"

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      id: string
      name: string
      email: string
      status: string
      capabilities: string[]
      image?: string
    }
    expires: string,
    impersonatingFromUserId?: string
  }

  interface User extends DefaultUser {
    status: string;
    capabilities: string[]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends Record<string, unknown> {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    status: string;
    capabilities: string[];
    impersonatingFromUserId?: string;
  }
}

// import NextAuth, { DefaultSession } from "next-auth"

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's postal address. */
//       address: string
//     } & DefaultSession["user"]
//   }
// }
