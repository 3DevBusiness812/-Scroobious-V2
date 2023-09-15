import { Prisma } from '@prisma/client';
import { pitchDeckSelect } from "./selectionDefs";
import { trackUser } from '~/utils/customerio';
import { debug, error } from '~/utils/logger';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/routers/_app';

type RouterOutput = inferRouterOutputs<AppRouter>;
type TAddMessageResult = RouterOutput['pitchDeck']['addMessage']

export const cioPitchDeckMessagePosted = async (result: TAddMessageResult) => {
  debug(`cioPitchDeckMessagePosted`, result);

  try {
    const { conversationMessage } = result
    const { createdById, conversation: { conversationParticipants } } = conversationMessage

    const events = conversationParticipants.filter(p => p.user.id !== createdById).map(p => {
      return trackUser(p.user.id, 'pitch_deck.messageReceived', conversationMessage)
    })

    await Promise.all(events)

  } catch (err) {
    error("CIO PitchDeckMessageReceived", result);
    error(err);
  }
}

export function isPitchDeckCategorized(pitchDeck: Prisma.PitchDeckGetPayload<{ select: typeof pitchDeckSelect }>) {
  const nonAssignable = ["pitch deck summary", "optional content", "marketplaces"]
  const assignableSections = pitchDeck.pitch.course?.courseDefinition?.courseStepDefinitions
    .filter(s => s.type === "VIDEO" && !nonAssignable.includes(s.name.toLowerCase()))
    .map(s => s.id)

  const reqSections = new Set(assignableSections ?? []);
  const assignedSections = new Set(pitchDeck?.pitchDeckSections.map(s => s.courseStepDefinition?.id ?? s.customSectionName) ?? [])
  const allPages = new Set(Array(pitchDeck.numPages).fill(0).map((_, ix) => ix + 1));
  const assignedPages = new Set(pitchDeck?.pitchDeckSections.map(s => s.pageNumber) ?? [])

  const areAllSectionsAssigned = [...reqSections].every((x) => x && assignedSections.has(x))
  const areAllPagesAssigned = [...allPages].every((x) => x && assignedPages.has(x))

  return areAllSectionsAssigned && areAllPagesAssigned
}
