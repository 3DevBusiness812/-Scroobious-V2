/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getToken, JWT } from "next-auth/jwt"
import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';

const ctxUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  profilePicture: {
    select: {
      url: true
    }
  },
  capabilities: true,
  status: true
});

const ctxUserRolesSelect = Prisma.validator<Prisma.UserRoleSelect>()({
  role: {
    include: {
      rolePermission: {
        include: {
          permission: {
            select: { code: true }
          }
        },
        where: {
          deletedAt: null
        }
      }
    }
  }
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  jwt: JWT | null
}

export async function createContextInner({ jwt }: CreateContextOptions) {
  try {
    if (!jwt?.sub) throw new Error(`Invalid token`);

    const userData = await prisma.user.findUnique({
      where: { id: jwt.sub },
      select: ctxUserSelect
    });

    const userRoles = await prisma.userRole.findFirst({
      where: { userId: jwt.sub },
      select: ctxUserRolesSelect
    });

    const permissions = userRoles?.role.rolePermission?.map((rolePermision) => rolePermision.permission.code) ?? [];

    const user = {
      ...userData,
      permissions
    }

    return { user }
  } catch (err) {}

  return {}
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  const jwt = await getToken({ req: opts.req })

  return await createContextInner({ jwt });
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;
