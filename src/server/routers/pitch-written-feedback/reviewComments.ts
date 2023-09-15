import { router, publicProcedure, protectedProcedure, authedProcedure } from '~/server/trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

type TDetails = Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined

export const pitchWrittenFeedbackSelect = Prisma.validator<Prisma.PitchWrittenFeedbackSelect>()({
  id: true,
  status: true,
  pitchWrittenFeedbackComments: {
    select: {
      id: true,
      v: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      deletedById: true,
      details: true,
      changeReason: true,
      author: {
        select: {
          id: true,
          name: true,
          profilePicture: {
            select: {
              url: true
            }
          }
        }
      }
    },
  },
  reviewer: {
    select: {
      id: true,
      name: true
    }
  }
});

const commentSelect = Prisma.validator<Prisma.PitchWrittenFeedbackCommentSelect>()({
  id: true,
  v: true,
  isActive: true,
  createdAt: true,
  createdById: true,
  updatedAt: true,
  deletedAt: true,
  deletedById: true,
  details: true,
  changeReason: true,
  author: {
    select: {
      id: true,
      name: true,
      profilePicture: {
        select: {
          url: true
        }
      }
    }
  }
})

export default {
  feedbackComments: publicProcedure
    .input(
      z.object({
        pitchWrittenFeedbackId: z.string(),
      }),
    )
    .query(async ({ input: { pitchWrittenFeedbackId }, ctx }) => {
      const feedback = await prisma.pitchWrittenFeedback.findUnique({
        where: { id: pitchWrittenFeedbackId },
        select: pitchWrittenFeedbackSelect
      });

      return feedback
    }),

  // addFeedbackComment: protectedProcedure(['pitch_written_feedback:review', 'pitch_written_feedback:list'])
  addFeedbackComment: authedProcedure
    .input(
      z.object({
        pitchWrittenFeedbackId: z.string(),
        commentId: z.string().nullish(),
        data: z.object({
          details: z.any(),
          changeReason: z.string().nullish()
        })
      })
    )
    .mutation(async ({ input: { pitchWrittenFeedbackId, commentId, data }, ctx }) => {
      // findFirstOrThrow --> pitchWrittenFeedback is ASSIGNED to reviewer, or user is Admin / L2 Reviewer
      if (!ctx.user.capabilities?.includes("ADMIN") && !ctx.user.capabilities?.includes("L2_REVIEWER")) {
        try {
          await prisma.pitchWrittenFeedback.findFirstOrThrow({
            where: {
              id: pitchWrittenFeedbackId,
              status: "ASSIGNED",
              reviewerId: ctx.user.id
            }
          })
        } catch (err) {
          throw new TRPCError({ message: 'Not allowed to review non-assigned or completed request', code: 'FORBIDDEN' });
        }
      }

      const comment = commentId ? await prisma.pitchWrittenFeedbackComment.findFirst({ where: { id: commentId }, orderBy: { v: "desc" } }) : null;

      const v = (comment?.v ?? 0) + 1;
      const { details, changeReason } = data as { details: TDetails, changeReason: string }

      const newComment = await prisma.pitchWrittenFeedbackComment.create({
        data: {
          details,
          changeReason,
          v,
          isActive: true,
          ownerId: ctx.user?.id!,
          createdById: ctx.user?.id!,
          pitchWrittenFeedbackId,
          ...commentId && { id: commentId }
        },
        select: commentSelect,
      });

      await prisma.pitchWrittenFeedbackComment.updateMany({
        where: {
          id: newComment.id,
          NOT: { v: newComment.v }
        },
        data: { isActive: false }
      });

      return newComment;
    }),

  deleteFeedbackComment: authedProcedure // delete own comment, no soft delete
    .input(
      z.object({
        id: z.string(),
        v: z.number()
      })
    )
    .mutation(async ({ input: { id, v }, ctx }) => {
      await prisma.pitchWrittenFeedbackComment.findFirstOrThrow({ where: { id, v, createdById: ctx.user.id } });
      await prisma.pitchWrittenFeedbackComment.delete({ where: { id_v: { id, v } } });
    }),

  reviewFeedbackCommentVersion: authedProcedure // delete comment made by reviewer, soft delete
    .input(
      z.object({
        id: z.string(),
        v: z.number(),
        isDelete: z.boolean().nullish(),
        data: z.object({
          details: z.any()
        }),
      })
    )
    .mutation(async ({ input: { id, v, isDelete, data }, ctx }) => {
      if (!ctx.user.capabilities?.includes("ADMIN") && !ctx.user.capabilities?.includes("L2_REVIEWER")) {
        throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });
      }
      const comment = await prisma.pitchWrittenFeedbackComment.findUniqueOrThrow({
        where: { id_v: { id, v } }
      });

      const cv = await prisma.pitchWrittenFeedbackComment.findFirst({ where: { id: comment.id }, orderBy: { v: "desc" } });

      const newV = (cv?.v ?? 0) + 1;
      const details = data.details as TDetails

      const newComment = await prisma.pitchWrittenFeedbackComment.create({
        data: {
          id,
          v: newV,
          details,
          isActive: true,
          ownerId: ctx.user?.id!,
          createdById: ctx.user?.id!,
          ...isDelete && {
            deletedAt: (new Date()).toISOString(),
            deletedById: ctx.user?.id!
          },
          pitchWrittenFeedbackId: comment.pitchWrittenFeedbackId,
        },
        select: commentSelect,
      });

      await prisma.pitchWrittenFeedbackComment.updateMany({
        where: {
          id: newComment.id,
          NOT: { v: newComment.v }
        },
        data: { isActive: false }
      });

      return newComment
    }),

  updateFeedbackComment: authedProcedure // update own comment
    .input(
      z.object({
        id: z.string(),
        v: z.number(),
        data: z.object({
          details: z.any(),
          changeReason: z.string().nullish()
        })
      })
    )
    .mutation(async ({ input: { id, v, data }, ctx }) => {
      await prisma.pitchWrittenFeedbackComment.findFirstOrThrow({ where: { id, v, createdById: ctx.user.id } });

      const { details, changeReason } = data as { details: TDetails, changeReason: string }

      const updatedComment = await prisma.pitchWrittenFeedbackComment.update({
        where: {
          id_v: { id, v },
        },
        data: {
          details,
          changeReason,
          updatedById: ctx.user.id,
          updatedAt: new Date()
        },
        select: commentSelect,
      })

      return updatedComment;
    }),
}
