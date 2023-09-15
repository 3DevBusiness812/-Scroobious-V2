import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { cioPipstantDescriptionStarted } from "~/server/routers/startup/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req });

  if (!jwt?.sub) return res.status(401).json({});

  await cioPipstantDescriptionStarted(jwt.sub);

  res.json({});
}
