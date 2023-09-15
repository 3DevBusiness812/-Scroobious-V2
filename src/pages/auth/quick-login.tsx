import { useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Spinner from "~/components/Spinner";
import { env } from "~/env.mjs";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

interface QuickLoginPageProps {
  userId?: string;
}

export default function QuickLoginPage({ userId }: QuickLoginPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLoggingIn, setUserLoggingIn] = useState<string | null>(null);
  const router = useRouter();

  const loginUser = async (email: string, password = "asdfasdf") => {
    setIsSubmitting(true);
    setUserLoggingIn(email);

    if (userId) await signOut({ redirect: false });

    await signIn("credentials", {
      ...{ email, password },
      redirect: false,
    });

    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Scroobious Quick Login</title>
      </Head>
      <div className="h-screen md:grid md:grid-cols-2 gap-0">
        <div
          className="bg-cover bg-center bg-no-repeat w-0 md:w-full h-0 md:h-full"
          style={{
            backgroundImage: "url(/login_bg.png)",
          }}
        />
        <div className="h-full flex-col flex py-12">
          <div className="space-y-6 flex-col flex p-6 items-center sm:mb-32">
            <Link href="/" className="">
              <img
                className="max-w-[225px] max-h-[100px] w-auto h-auto"
                loading="eager"
                src="/scroobious_logo.png"
                alt="Scroobious"
              />
            </Link>

            <div className="mt-8 mx-auto w-full max-w-md">
              <div className="bg-white px-4 sm:px-10">
                <div className="flex flex-col items-center space-y-2">
                  <button
                    disabled={true}
                    onClick={() => loginUser("founder-lite@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-50"
                  >
                    Founder Lite
                  </button>

                  <button
                    disabled={true}
                    onClick={() => loginUser("founder-medium@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-50"
                  >
                    Founder Medium
                  </button>

                  <button
                    // disabled={true}
                    onClick={() => loginUser("founder-full@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-50"
                  >
                    Founder Full
                  </button>

                  <button
                    // disabled={true}
                    onClick={() => loginUser("investor@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-50"
                  >
                    Investor
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => loginUser("reviewer@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-70"
                  >
                    {isSubmitting &&
                      userLoggingIn === "reviewer@scroobious.com" && (
                        <Spinner className="h-4 w-4 text-white" />
                      )}
                    <span>Reviewer</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => loginUser("l2reviewer@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-70"
                  >
                    {isSubmitting &&
                      userLoggingIn === "l2reviewer@scroobious.com" && (
                        <Spinner className="h-4 w-4 text-white" />
                      )}
                    <span>L2 Reviewer</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => loginUser("admin@scroobious.com")}
                    className="inline-flex items-center space-x-1 bg-gray-100 font-semibold enabled:hover:bg-gray-200 p-2 px-4 rounded-md disabled:opacity-70"
                  >
                    {isSubmitting &&
                      userLoggingIn === "admin@scroobious.com" && (
                        <Spinner className="h-4 w-4 text-white" />
                      )}
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (env.DEPLOY_ENV === "production") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let session: Session | null = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      userId: session && session.user && session.user.id,
    },
  };
};
