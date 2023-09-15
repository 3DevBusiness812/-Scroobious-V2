import { router, publicProcedure, authedProcedure } from '~/server/trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { pitchDeckSelect, conversationMessageSelect } from "./selectionDefs";
import { cioPitchDeckMessagePosted } from './helpers';
import { TRPCError } from '@trpc/server';

const getOrCreateConversationId = z
  .function()
  .args(z.object({
    founderId: z.string(),
    userId: z.string(),
    conversationId: z.string().nullish(),
  }))
  .implement(async ({ conversationId, userId, founderId }) => {
    const now = new Date()
    const version = 1

    if (conversationId) return conversationId

    if (!conversationId && founderId !== userId) { // find existing conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          conversationParticipants: {
            every: { userId: { in: [userId, founderId] } }
          }
        }
      });

      conversationId = conversation?.id
    }

    if (!conversationId) {
      const conversation = await prisma.conversation.create({
        select: { id: true },
        data: {
          createdAt: now,
          createdById: userId,
          updatedAt: now,
          ownerId: userId,
          version,
          conversationParticipants: {
            createMany: {
              data: [{
                createdAt: now,
                createdById: userId,
                updatedAt: now,
                ownerId: userId,
                userId: userId,
                messageAnonymously: true,
                version
              }, {
                createdAt: now,
                createdById: founderId,
                updatedAt: now,
                ownerId: founderId,
                userId: founderId,
                version
              }]
            }
          }
        }
      })

      conversationId = conversation.id
    }

    return conversationId
  });

const pitchDeckConversationRouter = router({
  updateMessagingAnonymously: authedProcedure
    .input(
      z.object({
        id: z.string(),
        messageAnonymously: z.boolean(),
        conversationId: z.string().nullish(),
      })
    )
    .mutation(async ({ input: { id, conversationId, messageAnonymously }, ctx }) => {
      const pitchDeckOwner = await prisma.pitchDeck.findUnique({
        where: { id },
        select: { ownerId: true }
      });

      const userId = ctx.user.id!
      const founderId = pitchDeckOwner?.ownerId!
      const now = new Date()

      if (!conversationId && founderId === userId) // only investors can message anonymously
        throw new TRPCError({ code: 'BAD_REQUEST', message: `No conversation found!` });

      conversationId = await getOrCreateConversationId({ conversationId, userId, founderId })

      await prisma.conversationParticipant.updateMany({
        where: { conversationId, userId },
        data: {
          updatedAt: now,
          updatedById: userId,
          messageAnonymously
        }
      })

      const conversation = await prisma.conversation.findFirst({
        where: {
          conversationParticipants: {
            every: { userId: { in: [userId, founderId] } }
          }
        },
        select: {
          id: true,
          conversationParticipants: {
            select: {
              userId: true,
              messageAnonymously: true
            }
          }
        }
      });

      return conversation ?? null
    }),

  addMessage: authedProcedure
    .input(
      z.object({
        id: z.string(),
        conversationId: z.string().nullish(),
        rootThreadMessageId: z.string().nullish(),
        body: z.string(),
        details: z.any()
      })
    )
    .mutation(async ({ input: { id, conversationId, body, details, rootThreadMessageId }, ctx }) => {
      const pitchDeckOwner = await prisma.pitchDeck.findUnique({
        where: { id },
        select: { ownerId: true }
      });

      const userId = ctx.user.id!
      const founderId = pitchDeckOwner?.ownerId!
      const now = new Date()
      const contextDetails = details
      const version = 1

      if (!conversationId && founderId === userId) // investor must innitiate the conversation?
        throw new TRPCError({ code: 'BAD_REQUEST', message: `No conversation found!` });

      conversationId = await getOrCreateConversationId({ conversationId, userId, founderId })

      if (!conversationId) // something went wrong
        throw new TRPCError({ code: 'BAD_REQUEST', message: `No conversation found!` });

      const conversationMessage = await prisma.conversationMessage.create({
        select: conversationMessageSelect,
        data: {
          createdById: userId,
          createdAt: now,
          updatedAt: now,
          ownerId: userId,
          pitchDeckId: id,
          conversationId,
          body,
          version,
          rootThreadMessageId,
          contextDetails
        }
      })

      const pitchDeck = await prisma.pitchDeck.findUnique({
        where: { id },
        select: pitchDeckSelect
      });

      const result = {
        pitchDeck: pitchDeck ?? null,
        conversationMessage
      }

      return result
    }),

  updateMessage: authedProcedure
    .input(
      z.object({
        id: z.string(),
        body: z.string(),
        details: z.any()
      })
    )
    .mutation(async ({ input: { id, body, details }, ctx }) => {
      const userId = ctx.user.id!;
      const contextDetails = details

      const oldMessage = await prisma.conversationMessage.findFirstOrThrow({
        select: {
          updatedById: true,
        },
        where: {
          id,
          createdById: userId
        }
      });

      const conversationMessage = await prisma.conversationMessage.update({
        where: { id },
        select: conversationMessageSelect,
        data: {
          updatedAt: new Date(),
          updatedById: userId,
          body,
          ...contextDetails && { contextDetails },
        }
      })

      const pitchDeck = await prisma.pitchDeck.findUnique({
        where: { id: conversationMessage.pitchDeck?.id },
        select: pitchDeckSelect
      });

      const result = {
        pitchDeck: pitchDeck ?? null,
        conversationMessage
      }

      //
      // we only want to send the CIO event if the message is being updated for the first time
      // because on the frontned we first create an empty message and then update it 
      // with the actual content/comment (or delete it if empty)
      //
      if (!oldMessage.updatedById) {
        await cioPitchDeckMessagePosted(result)
      }

      return result
    }),

  deleteMessage: authedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input: { id }, ctx }) => {
      const createdById = ctx.user.id!;

      await prisma.conversationMessage.findFirstOrThrow({
        where: { id, createdById }
      })

      const conversationMessage = await prisma.conversationMessage.delete({
        where: { id },
        select: {
          id: true,
          pitchDeck: {
            select: { id: true }
          }
        },
      })

      const pitchDeck = await prisma.pitchDeck.findUnique({
        where: { id: conversationMessage.pitchDeck?.id },
        select: pitchDeckSelect
      });

      return pitchDeck ?? null
    }),

  conversation: authedProcedure
    .input(
      z.object({
        id: z.string(),
        conversationId: z.string().nullish(),
      })
    )
    .query(async ({ input: { id, conversationId }, ctx }) => {
      const pitchDeckOwner = await prisma.pitchDeck.findUnique({
        where: { id },
        select: { ownerId: true }
      });

      const userId = ctx.user.id!
      const founderId = pitchDeckOwner?.ownerId!

      if (!conversationId && founderId === userId) { // founders can't initiate conversations on their own pitch decks
        return null;
      }

      conversationId = await getOrCreateConversationId({ conversationId, userId, founderId })

      const conversation = await prisma.conversation.findFirst({
        where: {
          conversationParticipants: {
            every: { userId: { in: [userId, founderId] } }
          }
        },
        select: {
          id: true,
          conversationParticipants: {
            select: {
              userId: true,
              messageAnonymously: true
            }
          }
        }
      });

      return conversation ?? null
    })
});

export { pitchDeckConversationRouter }
