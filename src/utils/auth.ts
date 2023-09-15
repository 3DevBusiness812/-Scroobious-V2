import { getToken, encode, type JWT, type GetTokenParams } from 'next-auth/jwt'
import { type CookiesOptions } from 'next-auth'
import { env } from '~/env.mjs';
import { serialize } from "cookie"
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';
import { warn } from '~/utils/logger';

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  status: true,
  capabilities: true,
  profilePicture: {
    select: {
      url: true
    }
  }
});

export const encodeTokenForUserId = async (id: string, impersonatingFromUserId?: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect
  });

  if (!user) return "";

  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    capabilities: user.capabilities,
    picture: user.profilePicture?.url,
    ...impersonatingFromUserId && { impersonatingFromUserId }
  };

  return encode({
    token: payload,
    secret: env.NEXTAUTH_SECRET
  })
}

export const useSecureCookies = Boolean(env.NEXTAUTH_URL?.startsWith("https://"))
export const securePrefix = useSecureCookies ? '__Secure-' : '';

export const __SESSION_TOKEN_COOKIE = `${securePrefix}next-auth.session-token`;

export const getSessionCookieValue = (token: string) => {
  const useSecureCookies = Boolean(env.NEXTAUTH_URL?.startsWith("https://"))
  const cookiePrefix = useSecureCookies ? '__Secure-' : ''
  const cookie = serialize(`${cookiePrefix}next-auth.session-token`, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecureCookies,
    maxAge: 30 * 24 * 60 * 60 // Default max age
  });

  return cookie;
}
