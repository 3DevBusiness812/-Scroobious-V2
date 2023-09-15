import { publicProcedure } from '~/server/trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { pitchWrittenFeedbackSelect } from "./selectionDefs"

export default {
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
        pitchWrittenFeedbackId: z.string(),
        pitchDeckId: z.string(),
      })
    )
    .mutation(async ({ input: { pitchWrittenFeedbackId, pitchDeckId, items } }) => {
      const deleteExistingPageSections = prisma.pitchWrittenFeedback.update({
        where: { id: pitchWrittenFeedbackId },
        data: {
          originalPitchDeck: {
            update: {
              pitchDeckSections: {
                deleteMany: {
                  pageNumber: {
                    in: items.map(({ pageNumber }) => pageNumber)
                  }
                }
              }
            }
          }
        }
      });

      const createPageSections = prisma.pitchWrittenFeedback.update({
        where: { id: pitchWrittenFeedbackId },
        data: {
          originalPitchDeck: {
            update: {
              pitchDeckSections: {
                createMany: {
                  data: items.map(({ pageNumber, customSectionName, courseStepDefinitionId }) => ({
                    pageNumber,
                    customSectionName,
                    courseStepDefinitionId
                  }))
                }
              }
            }
          }
        },
        select: pitchWrittenFeedbackSelect
      });

      const [_, feedback] = await prisma.$transaction([deleteExistingPageSections, createPageSections]);
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
  pitchDeckUnassignPagesFromSection: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            pageNumber: z.number().int().gte(1)
          })
        ).nonempty(),
        pitchWrittenFeedbackId: z.string(),
        pitchDeckId: z.string(),
      })
    )
    .mutation(async ({ input: { pitchWrittenFeedbackId, pitchDeckId, items } }) => {
      const feedback = await prisma.pitchWrittenFeedback.update({
        where: { id: pitchWrittenFeedbackId },
        data: {
          originalPitchDeck: {
            update: {
              pitchDeckSections: {
                deleteMany: {
                  pageNumber: {
                    in: items.map(({ pageNumber }) => pageNumber)
                  }
                }
              }
            }
          }
        },
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
}
