import { router } from '../../trpc';
import pitchWrittenFeedback from './pitchWrittenFeedback';
import reviewComments from './reviewComments';
import preparePitchDeck from './preparePitchDeck';

export const pitchWrittenFeedbackRouter = router({
  ...pitchWrittenFeedback,
  ...reviewComments,
  ...preparePitchDeck
});
