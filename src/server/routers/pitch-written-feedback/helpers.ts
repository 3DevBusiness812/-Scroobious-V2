import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { trackUser, track, identify } from '~/utils/customerio';
import { debug, error } from '~/utils/logger';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/routers/_app';

type RouterOutput = inferRouterOutputs<AppRouter>;
type TFeedback = RouterOutput['pitchWrittenFeedback']['sendFeedbackForQA']

export const cioSendForQA = async (feedback: TFeedback) => {
  debug(`cioSendForQA`, feedback);

  try {
    const l2Reviewers = await prisma.user.findMany({
      where: {
        capabilities: {
          hasSome: ['ADMIN', 'L2_REVIEWER']
        }
      },
      take: 10, // 
      select: { id: true }
    });

    if (feedback?.reviewer?.id) {
      await trackUser(feedback.reviewer?.id, 'pitch_written_feedback.submittedForQA', feedback)
    }

    await Promise.all([
      l2Reviewers.map(({ id }) => trackUser(id, 'pitch_written_feedback.receivedForQA', feedback))
    ])

  } catch (err) {
    error("CIO SendForQA", feedback);
    error(err);
  }
}

export const cioCompleteReview = async (feedback: TFeedback) => {
  debug(`cioCompleteReview`, feedback);

  try {
    const l2Reviewers = await prisma.user.findMany({
      where: {
        capabilities: {
          hasSome: ['ADMIN', 'L2_REVIEWER']
        }
      },
      take: 10, // 
      select: { id: true }
    });

    if (feedback?.reviewer?.id) {
      await trackUser(feedback.reviewer?.id, 'pitch_written_feedback.completed', feedback)
    }

    if (feedback?.pitch?.user?.id) {
      await trackUser(feedback.pitch.user.id, 'pitch_written_feedback.completed', feedback)
    }


    await Promise.all([
      l2Reviewers.map(({ id }) => trackUser(id, 'pitch_written_feedback.completed', feedback))
    ])

  } catch (err) {
    error("CIO CompleteReview", feedback);
    error(err);
  }
}

export const cioAssignReview = async (feedback: TFeedback) => {
  debug(`cioAssignReview`, feedback);

  try {
    const cioEvents = [];

    if (feedback?.updatedById && feedback?.updatedById === feedback?.reviewer?.id) {
      const l2Reviewers = await prisma.user.findMany({
        where: {
          capabilities: {
            hasSome: ['ADMIN', 'L2_REVIEWER']
          }
        },
        take: 10, // 
        select: { id: true }
      });

      cioEvents.push(...l2Reviewers?.map(({ id }) => trackUser(id, 'pitch_written_feedback.claimed', feedback)));
      cioEvents.push(trackUser(feedback.pitch.user.id, 'pitch_written_feedback.claimed', feedback))
    } else if (feedback?.reviewer?.id) {
      cioEvents.push(trackUser(feedback.reviewer.id, 'pitch_written_feedback.assigned', feedback))
    }

    await Promise.all(cioEvents)

  } catch (err) {
    error("CIO AssignReview", feedback);
    error(err);
  }
}

export const cioRequestReview = async (feedback: TFeedback) => {
  debug(`cioRequestReview`, feedback);

  try {
    if (feedback?.pitch.user.id) {
      await trackUser(feedback.pitch.user.id, 'pitch_written_feedback.request', feedback)
    }

  } catch (err) {
    error("CIO RequestReview", feedback);
    error(err);
  }
}
