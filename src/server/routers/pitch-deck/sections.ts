import { router, publicProcedure } from '~/server/trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { pitchDeckSelect } from "./selectionDefs";
import { isPitchDeckCategorized } from "./helpers";

export const pitchDeckSectionsRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input: { id }, ctx }) => {
      const pitchDeck = await prisma.pitchDeck.findUnique({
        where: { id },
        select: pitchDeckSelect
      });

      const conversationMessages = (pitchDeck?.conversationMessages ?? [])
        .filter(({ conversation }) => {
          return conversation?.conversationParticipants.some((p) => p.user.id === ctx.user?.id)
        });

      return pitchDeck ? {
        ...pitchDeck,
        conversationMessages
      } : null
    }),

  pitchDeckAssignPagesToSection: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            pageNumber: z.number().int().gte(1),
            id: z.string().optional(),
            customSectionName: z.string().optional(),
            courseStepDefinitionId: z.string().optional()
          })
        ).nonempty(),
        numPages: z.number().int().gte(1),
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id, items, numPages } }) => {
      const deleteExistingPageSections = prisma.pitchDeck.update({
        where: { id },
        data: {
          pitchDeckSections: {
            deleteMany: {
              pageNumber: {
                in: items.map(({ pageNumber }) => pageNumber)
              }
            }
          }
        }
      });

      const createPageSections = prisma.pitchDeck.update({
        where: { id },
        data: {
          pitchDeckSections: {
            createMany: {
              data: items.map(({ pageNumber, customSectionName, courseStepDefinitionId }) => ({
                pageNumber,
                customSectionName,
                courseStepDefinitionId
              }))
            }
          }
        },
        select: pitchDeckSelect
      });

      const [_, pitchDeck] = await prisma.$transaction([deleteExistingPageSections, createPageSections]);

      if (pitchDeck) {
        await prisma.pitchDeck.update({
          where: { id },
          data: {
            numPages,
            isCategorized: isPitchDeckCategorized(pitchDeck),
            updatedAt: new Date(),
            updatedById: pitchDeck.createdById
          }
        })
      }
      return pitchDeck ?? null
    }),
  pitchDeckUnassignPagesFromSection: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            pageNumber: z.number().int().gte(1)
          })
        ).nonempty(),
        numPages: z.number().int().gte(1),
        id: z.string()
      })
    )
    .mutation(async ({ input: { id, items, numPages } }) => {
      const pitchDeck = await prisma.pitchDeck.update({
        where: { id },
        data: {
          pitchDeckSections: {
            deleteMany: {
              pageNumber: {
                in: items.map(({ pageNumber }) => pageNumber)
              }
            }
          }
        },
        select: pitchDeckSelect
      });

      if (pitchDeck) {
        await prisma.pitchDeck.update({
          where: { id },
          data: {
            numPages,
            isCategorized: isPitchDeckCategorized(pitchDeck),
            updatedAt: new Date(),
            updatedById: pitchDeck.createdById
          }
        })
      }

      return pitchDeck ?? null
    }),
});
