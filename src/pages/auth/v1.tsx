import Head from "next/head";
import { env } from "~/env.mjs";
import Spinner from "~/components/Spinner";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export default function V1Page({
  returnTo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  useEffect(() => {
    router.replace(returnTo)
  }, [])

  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="h-screen w-full flex items-center justify-center space-x-2">
        <Spinner />
        <p className="text-sm">Loading...</p>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const returnTo = (context.query.returnTo as string) ?? env.NEXT_PUBLIC_V1_BASE_URL

  return {
    props: {
      returnTo
    },
  };
}
