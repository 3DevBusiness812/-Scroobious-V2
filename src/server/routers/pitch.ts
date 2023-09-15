import { router, publicProcedure, protectedProcedure, authedProcedure } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { getVideoStats } from '~/utils/wistia';

const defaultPitchSelect = Prisma.validator<Prisma.PitchSelect>()({
  id: true,
  pitchVideos: {
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      video: true
    }
  }
});

const pitchUserStatusSelect = Prisma.validator<Prisma.PitchUserStatusSelect>()({
  id: true,
  founderImpressionRating: true,
  founderImpressionComments: true,
  businessIdeaRating: true,
  businessIdeaComments: true,
  pitchMaterialsRating: true,
  pitchMaterialsComments: true,
  shareReviewWithFounder: true,
  shareReviewDirectly: true
});

const activePitchDeckSelect = Prisma.validator<Prisma.PitchDeckSelect>()({
  id: true,
  status: true,
  createdAt: true,
  pitchDeckSections: {
    select: {
      pageNumber: true,
      customSectionName: true,
      courseStepDefinition: {
        select: {
          id: true,
          name: true,
          section: true,
          description: true, type: true,
          sequenceNum: true,
          config: true
        }
      }
    }
  },
  file: {
    select: {
      id: true,
      url: true
    }
  }
})

const pitchSelect = Prisma.validator<Prisma.PitchSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  organization: {
    select: {
      id: true,
      startup: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  },
  pitchDecks: {
    where: {
      status: "ACTIVE",
      deletedAt: null
    },
    select: activePitchDeckSelect
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

export const pitchRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const pitch = await prisma.pitch.findUnique({
        where: { id },
        select: pitchSelect
      });

      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      return pitch ? {
        ...pitch,
        activePitchDeck
      } : null
    }),

  submitInvestorPitchFeedback: authedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          founderImpressionRating: z.number().nullable(),
          founderImpressionComments: z.string().nullable(),
          businessIdeaRating: z.number().nullable(),
          businessIdeaComments: z.string().nullable(),
          pitchMaterialsRating: z.number().nullable(),
          pitchMaterialsComments: z.string().nullable(),
          shareReviewWithFounder: z.boolean(),
          shareReviewDirectly: z.boolean(),
        })
      })
    )
    .mutation(async ({ input: { id, data }, ctx }) => {
      const isInvestor = ctx.user.capabilities?.includes("INVESTOR");

      if (!isInvestor)
        throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });

      const { id: pitchUserStatusId } = await prisma.pitchUserStatus.findFirstOrThrow({
        where: { pitchId: id, userId: ctx.user.id },
        select: { id: true }
      })

      const feedback = await prisma.pitchUserStatus.update({
        where: { id: pitchUserStatusId },
        select: pitchUserStatusSelect,
        data
      })

      return feedback;
    }),

  getInvestorPitchFeedback: authedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const isInvestor = ctx.user.capabilities?.includes("INVESTOR");

      if (!isInvestor)
        throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });

      const feedback = await prisma.pitchUserStatus.findFirst({
        where: { pitchId: id, userId: ctx.user.id },
        select: pitchUserStatusSelect
      })

      return feedback;
    }),

  pitchVideoStats: protectedProcedure(['pitch:list', 'pitch:read'])
    .query(async ({ ctx }) => {
      const BLANK_RESPONSE = {
        load_count: 0,
        play_count: 0,
        play_rate: 0,
        hours_watched: 0,
        engagement: 0,
        visitors: 0,
      };

      const pitches = await prisma.pitch.findMany({
        where: { userId: ctx.user.id },
        orderBy: { updatedAt: "desc" },
        select: defaultPitchSelect
      });

      const [pitch] = pitches;
      const [pitchVideo] = pitch?.pitchVideos ?? [];

      if (!pitches.length || !pitch?.pitchVideos?.length || !pitchVideo) {
        return BLANK_RESPONSE;
      }

      return await getVideoStats(pitchVideo.video.wistiaId)
    })
});
