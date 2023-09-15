import { router, authedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env.mjs';
// @ts-expect-error
import { escapeForSlackWithMarkdown } from 'slack-hawk-down'

type TSlackResponse = {
  ok: boolean,
  messages: {
    type: string,
    user: string,
    text: string,
    ts: string
  }[],
  has_more: boolean,
  pin_count: number,
  response_metadata: {
    next_cursor: string
  }
}

const SCROOBIOUS_OFFICIAL_CHANNEL_ID = 'C01G95ERV1N';
const getSlackUrl = (endpoint: string, queryString: string) => `https://slack.com/api/${endpoint}?${queryString}`;

export const slackRouter = router({
  list: authedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        channel: z.string().nullish()
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 5;
      const channel = input.channel ?? SCROOBIOUS_OFFICIAL_CHANNEL_ID;

      const url = getSlackUrl('conversations.history', `channel=${channel}&limit=${limit}`);

      const res: TSlackResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        }
      }).then(r => r.json())

      const messages = res.messages.map((message: any) => {
        return {
          ...message,
          html: escapeForSlackWithMarkdown(message.text) as string,
        };
      });

      return {
        ...res,
        messages
      }
    }),
});
