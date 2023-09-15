import Head from "next/head";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSideHelpers } from "~/utils/trpcHelpers";
import AssistantAI from "~/components/founder/AssistantAI";

export default function ShartupShortDescriptionGeneratorPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { status, data: startup } = trpc.startup.myStartup.useQuery();

  if (status !== "success")
    return (
      <>
        <Head>
          <title>Scroobious+ AI assistant</title>
        </Head>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
          <Spinner />
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>Scroobious+ AI assistant</title>
      </Head>
      <AssistantAI {...{ startup }} />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = await getServerSideHelpers(context.req);

  await helpers.startup.myStartup.fetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}
