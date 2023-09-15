import { publicProcedure, protectedProcedure, authedProcedure } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { pitchWrittenFeedbackSelect } from "./selectionDefs"
import { cioSendForQA, cioCompleteReview, cioAssignReview, cioRequestReview } from './helpers';

export default {
  // pitchWrittenFeedbacks: protectedProcedure(['pitch:list', 'pitch:read'])
  list: protectedProcedure(['pitch_written_feedback:admin'])
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        status: z.enum(["COMPLETE", "ASSIGNED", "REQUESTED", "AWAITING_QA", "DRAFT"]).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const isAdminOrL2Reviewer = ctx.user.capabilities?.includes("ADMIN") || ctx.user.capabilities?.includes("L2_REVIEWER");

      const limit = input.limit ?? 50;
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const { status } = input;

      const items = await prisma.pitchWrittenFeedback.findMany({
        select: pitchWrittenFeedbackSelect,
        take: limit + 1,
        where: {
          ...!isAdminOrL2Reviewer && {
            OR: [
              { reviewerId: ctx.user.id },
              { status: "REQUESTED" }
            ]
          },
          ...{
            AND: [
              { deletedAt: null },
              { deletedById: null }
            ]
          },
          ...status && { status }
        },
        cursor,
        orderBy: { createdAt: "desc" }
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > limit) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const feedback = await prisma.pitchWrittenFeedback.findUnique({
        where: { id },
        select: pitchWrittenFeedbackSelect
      });

      const pitch = feedback?.pitch;
      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      return feedback ? {
        ...feedback,
        pitch: {
          ...pitch,
          activePitchDeck
        }
      } : null
    }),

  requestWrittenFeedback: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input: { id } }) => {
      const status = "DRAFT";
      const f = await prisma.pitchWrittenFeedback.findFirstOrThrow({
        where: { id, status },
        select: { createdById: true }
      })

      const feedback = await prisma.pitchWrittenFeedback.update({
        where: { id },
        select: pitchWrittenFeedbackSelect,
        data: {
          updatedAt: new Date(),
          updatedById: f.createdById,
          status: "REQUESTED"
        }
      })

      const pitch = feedback?.pitch;
      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      const result = feedback ? {
        ...feedback,
        pitch: {
          ...pitch,
          activePitchDeck
        }
      } : null

      await cioRequestReview(result)

      return result
    }),

  assignWrittenFeedback: authedProcedure
    .input(
      z.object({
        id: z.string(),
        reviewerId: z.string()
      })
    )
    .mutation(async ({ input: { id, reviewerId }, ctx }) => {
      const isAdmin = ctx.user.capabilities?.includes("ADMIN");

      if (!isAdmin && ctx.user.id !== reviewerId)
        throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });

      const feedback = await prisma.pitchWrittenFeedback.update({
        where: { id },
        select: pitchWrittenFeedbackSelect,
        data: {
          reviewerId,
          updatedAt: new Date(),
          updatedById: ctx.user.id,
          status: "ASSIGNED"
        }
      })

      const pitch = feedback?.pitch;
      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      const result = feedback ? {
        ...feedback,
        pitch: {
          ...pitch,
          activePitchDeck
        }
      } : null

      await cioAssignReview(result)

      return result
    }),
  sendFeedbackForQA: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id }, ctx }) => {
      await prisma.pitchWrittenFeedback.findFirstOrThrow({ where: { id, reviewerId: ctx.user.id } });

      const feedback = await prisma.pitchWrittenFeedback.update({
        where: { id },
        data: {
          updatedAt: new Date(),
          updatedById: ctx.user.id,
          status: "AWAITING_QA"
        },
        select: pitchWrittenFeedbackSelect
      });

      const pitch = feedback?.pitch;
      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      const result = feedback ? {
        ...feedback,
        pitch: {
          ...pitch,
          activePitchDeck
        }
      } : null

      await cioSendForQA(result)

      return result
    }),

  completeFeedback: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id }, ctx }) => {
      const isL2Reviewer = ctx.user.capabilities?.includes("ADMIN") || ctx.user.capabilities?.includes("L2_REVIEWER");

      if (!isL2Reviewer) {
        throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });
      }

      const feedback = await prisma.pitchWrittenFeedback.update({
        where: { id },
        data: {
          status: "COMPLETE",
          updatedAt: new Date(),
          updatedById: ctx.user.id
        },
        select: pitchWrittenFeedbackSelect
      });

      const pitch = feedback?.pitch;
      const activePitchDeck = pitch?.pitchDecks?.find(deck => deck.status === "ACTIVE");

      const result = feedback ? {
        ...feedback,
        pitch: {
          ...pitch,
          activePitchDeck
        }
      } : null

      await cioCompleteReview(result)

      return result
    }),
}
