import { Prisma } from '@prisma/client';

const conversationSelectFields = {
  id: true,
  createdAt: true,
  createdById: true,
  updatedAt: true,
  updatedById: true,
  friendlyName: true,
  conversationParticipants: {
    select: {
      id: true,
      createdAt: true,
      createdById: true,
      updatedAt: true,
      updatedById: true,
      lastReadAt: true,
      conversation: true,
      messageAnonymously: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
    }
  },
}

export const pitchDeckSelect = Prisma.validator<Prisma.PitchDeckSelect>()({
  id: true,
  status: true,
  createdAt: true,
  createdById: true,
  numPages: true,
  isCategorized: true,
  pitch: {
    select: {
      id: true,
      course: {
        select: {
          id: true,
          courseDefinition: {
            select: {
              courseStepDefinitions: {
                where: {
                  section: "Pitch Deck Creation",
                  deletedAt: null
                },
                orderBy: {
                  sequenceNum: "asc"
                },
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
          }
        }
      },
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
      }
    }
  },
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
  conversationMessages: {
    select: {
      id: true,
      rootThreadMessageId: true,
      createdAt: true,
      createdById: true,
      updatedAt: true,
      updatedById: true,
      body: true,
      user: {
        select: {
          name: true,
          profilePicture: {
            select: {
              url: true
            }
          }
        }
      },
      readAt: true,
      contextDetails: true,
      conversation: {
        select: conversationSelectFields
      },
    }
  },
  file: {
    select: {
      id: true,
      url: true
    }
  }
})

export const conversationMessageSelect = Prisma.validator<Prisma.ConversationMessageSelect>()({
  id: true,
  body: true,
  pitchDeck: {
    select: { id: true }
  },
  createdById: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    }
  },
  conversation: {
    select: {
      conversationParticipants: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        }
      }
    }
  }
})

export const conversationSelect = Prisma.validator<Prisma.ConversationSelect>()(conversationSelectFields)
