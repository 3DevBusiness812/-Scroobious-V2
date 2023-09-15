import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"
import { env } from '~/env.mjs';
import { generateAIShortDescription } from '~/server/routers/startup/helpers';
import { error } from '~/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { startup: { id } } = req.body ?? {}
  const jwt = await getToken({ req })

  if (!jwt?.sub) return res.status(401).json({})

  try {
    const { text, ...rest } = await generateAIShortDescription(id, jwt.sub)

    res.json({
      text,
      ...env.DEPLOY_ENV !== "production" && rest
    })
  } catch (err) {
    error(err)
    return res.status(400).json({})
  }
}
