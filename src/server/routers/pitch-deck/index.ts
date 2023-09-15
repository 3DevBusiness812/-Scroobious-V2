import { mergeRouters } from '~/server/trpc';
import { pitchDeckSelect } from "./selectionDefs";
import { pitchDeckConversationRouter } from './conversation';
import { pitchDeckSectionsRouter } from './sections';

const pitchDeckRouter = mergeRouters(pitchDeckSectionsRouter, pitchDeckConversationRouter)

export { pitchDeckSelect, pitchDeckRouter }
