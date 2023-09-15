import type { GetServerSideProps } from "next";
import superjson from 'superjson';
import { getToken } from "next-auth/jwt"
import { appRouter } from "~/server/routers/_app";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContextInner } from '~/server/context';

/**
 * Helpers to use trpc on server-side within getServerSideProps() to prefetch data
 * 
 * Note: Make sure to add `trpcState: helpers.dehydrate()` in the returning props
 * 
 * export async function getServerSideProps(
 *   context: GetServerSidePropsContext<{ id: string }>
 * ) {
 *   const helpers = getServerSideHelpers(context.req)
 *   const id = context.params?.id as string;
 * 
 *   await helpers.some.query.or.mutation.byId.prefetch({ id });
 * 
 *   return {
 *     props: {
 *       trpcState: helpers.dehydrate(),
 *       id,
 *     },
 *   };
 * }
 * 
 * 
 */
export const getServerSideHelpers = async (req: Parameters<GetServerSideProps>[0]["req"]) => {
  const jwt = await getToken({ req })

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ jwt }),
    transformer: superjson,
  });

  return helpers;
}
