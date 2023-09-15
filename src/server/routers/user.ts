/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure, protectedProcedure, protectedProcedureWithCapability } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import SecurePassword from 'secure-password';

const SP = new SecurePassword();

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  pitchWrittenFeedbacks: true,
  plans: true,
  capabilities: true
});

const listUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  plans: true,
  status: true,
  lastLoginAt: true,
  profilePicture: {
    select: {
      url: true
    }
  },
  capabilities: true
});

const reviewersSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  status: true,
  profilePicture: {
    select: {
      url: true
    }
  },
});

const loginUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  password: true
});

export const userRouter = router({
  list: protectedProcedure(["user:list"])
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.user.findMany({
        select: listUserSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
            id: cursor,
          }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  listReviewers: protectedProcedureWithCapability("ADMIN")
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.user.findMany({
        select: reviewersSelect,
        take: limit + 1,
        where: {
          capabilities: {
            has: "REVIEWER"
          }
        },
        cursor: cursor
          ? {
            id: cursor,
          }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return items
    }),
  me: publicProcedure
    .query(({ ctx }) => {
      return ctx.user ?? null
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return user;
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(5)
      })
    )
    .mutation(async ({ input: { email, password } }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        select: loginUserSelect
      });

      const { password: hashedPassword } = user ?? {};

      try {
        if (!hashedPassword) throw new Error(`Invalid user`);

        const hashVerifyResult = await SP.verify(
          Buffer.from(password),
          Buffer.from(hashedPassword, 'base64')
        );

        if (hashVerifyResult === SecurePassword.VALID) return true;

        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    })
});
