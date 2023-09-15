import { Prisma } from '@prisma/client';
import { pitchDeckSelect } from '../pitch-deck';

export const pitchSelect = {
  select: Prisma.validator<Prisma.PitchSelect>()({
    id: true,
    createdAt: true,
    updatedAt: true,
    pitchDecks: {
      where: {
        status: "ACTIVE",
        deletedAt: null
      },
      select: pitchDeckSelect
    },
    user: {
      select: {
        id: true,
        name: true,
        profilePicture: {
          select: {
            id: true,
            url: true
          }
        }
      },
    }
  })
}

export const pitchWrittenFeedbackSelect = Prisma.validator<Prisma.PitchWrittenFeedbackSelect>()({
  id: true,
  status: true,
  reviewerNotes: true,
  originalPitchDeck: { select: pitchDeckSelect },
  reviewedPitchDeck: { select: pitchDeckSelect },
  pitch: pitchSelect,
  createdAt: true,
  updatedAt: true,
  updatedById: true,
  reviewer: {
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: {
        select: {
          id: true,
          url: true
        }
      }
    }
  }
});
