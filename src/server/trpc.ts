/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters;


const isAuthenticated = t.middleware(({ next, ctx }) => {
  // if (!ctx.session?.user?.email) {
  //   throw new TRPCError({ message: JSON.stringify(ctx), code: 'UNAUTHORIZED' });
  // }
  // return next({
  //   ctx: {
  //     session: ctx.session,
  //   },
  // });

  if (!ctx.user?.id) {
    throw new TRPCError({ message: 'No permission', code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const requirePermissions = (permissions: string[]) => t.middleware(({ next, ctx }) => {
  const hasPermissions = (ctx.user?.permissions ?? []).some((permission) => permissions.includes(permission))

  if (!ctx.user?.id || !hasPermissions) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx });
});

const requireCapability = (capability: string) => t.middleware(({ next, ctx }) => {
  const hasCapability = ctx.user?.capabilities?.includes(capability)

  if (!ctx.user?.id || !hasCapability) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx });
});

export const authedProcedure = t.procedure.use(isAuthenticated);
export const protectedProcedure = (permissions: string[]) => t.procedure.use(requirePermissions(permissions));
export const protectedProcedureWithCapability = (capability: string) => t.procedure.use(requireCapability(capability));
