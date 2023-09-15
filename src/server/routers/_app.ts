/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { userRouter } from './user';
import { pitchRouter } from './pitch';
import { pitchDeckRouter } from './pitch-deck';
import { pitchWrittenFeedbackRouter } from './pitch-written-feedback';
import { authRouter } from './auth';
import { accountSettingsRouter } from './account-settings';
import { slackRouter } from './slack';
import { miscRouter } from './misc';
import { startupRouter } from './startup';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  user: userRouter,
  pitch: pitchRouter,
  pitchDeck: pitchDeckRouter,
  slack: slackRouter,
  pitchWrittenFeedback: pitchWrittenFeedbackRouter,
  auth: authRouter,
  accountSettings: accountSettingsRouter,
  misc: miscRouter,
  startup: startupRouter
});

export type AppRouter = typeof appRouter;
