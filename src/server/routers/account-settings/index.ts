import { router } from '~/server/trpc';
import profile from './profile';

export const accountSettingsRouter = router({
  ...profile,
});
