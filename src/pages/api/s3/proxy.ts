import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;
  const response = await axios({
    url,
    responseType: 'stream'
  });

  res.setHeader(
    'Cache-Control',
    'public, max-age=31536000'
  );

  response.data.pipe(res)
}
