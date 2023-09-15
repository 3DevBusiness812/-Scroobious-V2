import { router, authedProcedure } from "~/server/trpc";
import { z } from "zod";
import { prisma } from "~/server/prisma";
import { Prisma } from "@prisma/client";
import { startupSelect } from "./selectionDefs";
import { TRPCError } from "@trpc/server";
import { getTranscript, getTranscriptById } from "~/utils/assemblyai";
import { getWistiaVideoUrl } from "~/utils/wistia";
import { summarizePitchDeck } from "~/utils/pdf";
import { error } from "~/utils/logger";
import { cioPipstantDescriptionSaved } from "./helpers";

const formatStartup = (startup: Prisma.StartupGetPayload<{ select: typeof startupSelect }> | null) => {
  if (!startup) return null

  const [pitch] = startup.organization?.pitches ?? [];
  const activePitchDeck = pitch?.pitchDecks?.find(({ status: s }) => s === "ACTIVE")
  const [latestPitchDeck] = pitch?.pitchDecks ?? []
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // IMPORTANT NOTE: 
  // The `status` field (ACTIVE | INACTIVE) may be deceiving, we actually use it as a flag for
  // whether founders wish the pitch deck to be visible to investors. So we end up with two pitch deck types: 
  // `activePitchDeck` — the most recently `updatedAt` && status=`ACTIVE` pitch deck — visible to investors
  // `latestPitchDeck` — the most recently `updatedAt` pitch deck is the latest uploaded pitch deck and is 
  //    actually `active`-ly used elewhere, except for showing it to investors
  // 
  // we should probably have this better documented on v1 or somewhere else
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const [pitchVideo] = pitch?.pitchVideos ?? [];
  const video = pitchVideo?.video ?? null;

  return {
    ...startup,
    activePitchDeck,
    latestPitchDeck,
    video
  };
}

export const startupRouter = router({
  myStartup: authedProcedure
    .query(async ({ ctx }) => {
      const startup = await prisma.startup.findFirst({
        select: startupSelect,
        where: { userId: ctx.user.id }
      });

      return formatStartup(startup)
    }),

  updateTinyDescription: authedProcedure
    .input(
      z.object({
        id: z.string(),
        tinyDescription: z.string()
      })
    )
    .mutation(async ({ input: { id, tinyDescription }, ctx }) => {
      const userId = ctx.user.id!
      await prisma.startup.findFirstOrThrow({ where: { id, userId } });

      const startup = await prisma.startup.update({
        where: { id },
        data: {
          tinyDescription,
          updatedAt: new Date(),
          updatedById: userId
        },
        select: startupSelect
      });

      await cioPipstantDescriptionSaved(tinyDescription, userId)

      return startup
    }),
  transcribeVideo: authedProcedure
    .input(
      z.object({
        wistiaId: z.string(),
        transcriptionId: z.string().optional(),
      })
    )
    .mutation(async ({ input: { wistiaId, transcriptionId }, ctx }) => {
      if (transcriptionId) {
        const transcription = await getTranscriptById(transcriptionId);
        return transcription;
      }

      const wistiaVideoUrl = await getWistiaVideoUrl(wistiaId);

      if (!wistiaVideoUrl) {
        throw new TRPCError({ message: 'Invalid or non-existing Wistia Video', code: 'BAD_REQUEST' });
      }

      const response = await getTranscript(wistiaVideoUrl);
      return response;
    }),

  saveVideoTranscription: authedProcedure
    .input(
      z.object({
        videoId: z.string(),
        transcriptionId: z.string()
      })
    )
    .mutation(async ({ input: { videoId, transcriptionId }, ctx }) => {
      const transcription = await getTranscriptById(transcriptionId);

      if (!["completed", "error"].includes(transcription.status)) {
        throw new TRPCError({ message: 'No transcription or not completed yet', code: 'BAD_REQUEST' });
      }

      await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          transcription: transcription.text,
          transcriptionRaw: transcription
        },
      });
    }),
  summarizePitchDeck: authedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input: { id }, ctx }) => {
      try {
        const pitchDeck = await prisma.pitchDeck.findFirstOrThrow({
          where: { id },
          select: {
            textSummary: true,
            file: {
              select: {
                url: true
              }
            }
          }
        })

        if (!pitchDeck?.textSummary && pitchDeck.file?.url) {
          const { textSummary, textContent } = await summarizePitchDeck(pitchDeck.file.url);
          await prisma.pitchDeck.update({
            where: { id },
            data: {
              textSummary,
              textContent
            }
          })
        }
      } catch (err) {
        error("summarizePitchDeck", err)
        throw err
      }
    })
});
