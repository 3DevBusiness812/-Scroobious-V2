import { Prisma } from "@prisma/client";

export const startupSelect = Prisma.validator<Prisma.StartupSelect>()({
  id: true,
  name: true,
  shortDescription: true,
  tinyDescription: true,
  originStory: true,
  userId: true,
  organization: {
    select: {
      id: true,
      pitches: {
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          pitchVideos: {
            where: {
              extendedVideo: false,
              deletedAt: null,
            },
            orderBy: {
              updatedAt: "desc"
            },
            select: {
              id: true,
              video: {
                select: {
                  transcription: true,
                  transcriptionRaw: true,
                  wistiaId: true,
                  id: true,
                  file: {
                    select: {
                      id: true,
                      url: true,
                    },
                  },
                },
              },
            },
          },
          pitchDecks: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              updatedAt: "desc"
            },
            select: {
              id: true,
              status: true,
              textContent: true,
              file: {
                select: {
                  id: true,
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  },
});
