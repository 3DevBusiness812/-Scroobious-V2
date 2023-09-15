import { NextApiRequest, NextApiResponse } from 'next'
import { encode, getToken } from "next-auth/jwt"
import { serialize } from "cookie"
import { env } from '~/env.mjs';
import { prisma } from '~/server/prisma';
import { Prisma } from '@prisma/client';
import { warn } from '~/utils/logger';
import { getSessionCookieValue } from '~/utils/auth';

const userSelect = Prisma.validator<Prisma.UserSelect>()({
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    throw new Error(`Invalid Request`)

  const parts = req.query.action as string[] ?? ["start"]
  const action = parts.join("/")

  if (action === "start") {
    startImpersonation(req, res)
  } else if (action === "stop") {
    stopImpersonation(req, res)
  }
}

//
// POST /api/auth/impersonate
//
export async function startImpersonation(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.reason || req.body.reason.length < 5 || !req.body.userId)
      throw new Error(`Invalid Input Provided`)

    const jwt = await getToken({ req })

    if (!jwt?.sub) throw new Error(`Invalid session`)

    const impersonatingFromUserId = jwt?.sub;
    const secret = env.NEXTAUTH_SECRET

    warn('impersonator user id :>> ', impersonatingFromUserId)
    warn('impersonator user name :>> ', jwt.name)
    warn('impersonation reason :>> ', req.body.reason)

    const admin = await prisma.user.findUnique({
      where: { id: impersonatingFromUserId },
      select: userSelect
    });

    if (!admin?.capabilities.includes("ADMIN")) {
      warn('impersonation ^^^ NO_PERMISSION ^^^ :>> ', admin)
      throw new Error(`Insufficient Permission`)
    }

    const impersonatedUser = await prisma.user.findUnique({
      where: { id: req.body.userId },
      select: userSelect
    });

    if (!impersonatedUser) {
      warn('No user found for impersonation :>> ', { id: req.body.userId })
      throw new Error(`Invalid user`)
    }

    warn('impersonated user id :>> ', impersonatedUser.id)
    warn('impersonated user name :>> ', impersonatedUser.name)

    const payload = {
      sub: impersonatedUser.id,
      name: impersonatedUser.name,
      email: impersonatedUser.email,
      status: impersonatedUser.status,
      capabilities: impersonatedUser.capabilities,
      picture: impersonatedUser.profilePicture?.url,
      impersonatingFromUserId
    };

    const token = await encode({
      token: payload,
      secret
    })

    res.setHeader("Set-Cookie", getSessionCookieValue(token))
    res.redirect("/")
  } catch (err) {
    res.status(401).json({})
  }
}

//
// POST /api/auth/impersonate/stop
//
export async function stopImpersonation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const secret = env.NEXTAUTH_SECRET

    const jwt = await getToken({ req })

    if (!jwt?.sub) throw new Error(`Invalid session`)

    if (!jwt?.impersonatingFromUserId)
      throw new Error(`Invalid request`)

    const admin = await prisma.user.findUnique({
      where: { id: jwt.impersonatingFromUserId },
      select: userSelect
    });

    if (!admin) throw new Error(`Invalid user`)

    const payload = {
      sub: admin.id,
      name: admin.name,
      email: admin.email,
      status: admin.status,
      capabilities: admin.capabilities,
      picture: admin.profilePicture?.url,
    };

    const token = await encode({
      token: payload,
      secret
    })

    res.setHeader("Set-Cookie", getSessionCookieValue(token))
    res.redirect("/");
  } catch (err) {
    res.status(401).json({})
  }
}
