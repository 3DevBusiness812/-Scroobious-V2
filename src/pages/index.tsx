import { useSession } from "next-auth/react";
import Link from "next/link";
import Redirect from "~/components/Redirect";
import Spinner from "~/components/Spinner";
import { env } from "~/env.mjs";

type TCapabilities =
  | "FOUNDER_LITE"
  | "FOUNDER_MEDIUM"
  | "FOUNDER_FULL"
  | "INVESTOR"
  | "ADMIN"
  | "REVIEWER"
  | "L2_REVIEWER";

export default function IndexPage() {
  const { data: session, status } = useSession();
  const { user } = session ?? {};
  const founderUrl = env.NEXT_PUBLIC_V1_BASE_URL;
  const investorUrl = env.NEXT_PUBLIC_V1_BASE_URL;

  const userType = (user?.capabilities && user?.capabilities[0]) as
    | TCapabilities
    | undefined;

  if (status === "loading")
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );

  if (!user) return <Redirect to="/auth/login" />;

  if (user?.status === "INACTIVE") return <Redirect to="/auth/subscription" />;

  if (
    (userType && user?.status === "ONBOARDING") ||
    user?.status === "ONBOARDING_STARTUP"
  ) {
    const urls: Record<TCapabilities, string> = {
      FOUNDER_LITE: founderUrl,
      FOUNDER_MEDIUM: founderUrl,
      FOUNDER_FULL: founderUrl,
      INVESTOR: investorUrl,
      REVIEWER: "not possible to be in ONBOARDING",
      L2_REVIEWER: "not possible to be in ONBOARDING",
      ADMIN: "not possible to be in ONBOARDING",
    };
    const url = urls[userType!];

    return <Redirect to={url} />;
  }

  if (user?.status === "ACTIVE") {
    const urls: Record<TCapabilities, string> = {
      FOUNDER_LITE: founderUrl,
      FOUNDER_MEDIUM: founderUrl,
      FOUNDER_FULL: founderUrl,
      INVESTOR: investorUrl,
      ADMIN: "/admin/written-feedback",
      REVIEWER: "/admin/written-feedback",
      L2_REVIEWER: "/admin/written-feedback",
    };
    const url = urls[userType!];

    return <Redirect to={url} />;
  }

  return (
    <div className="relative bg-gray-50">
      <div className="relative bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <img
                className="w-auto h-8 sm:h-10"
                src="/scroobious_logo.png"
                alt="Scroobious"
              />
            </div>
            <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
              <Link
                href="/auth/login"
                className="mr-3 px-3 py-1 hover:bg-orange-50 rounded-md text-sm text-orange-700 border border-orange-700"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main className="lg:relative">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex flex-row pt-16 pb-20 mx-auto text-center max-w-7xl lg:py-48 lg:text-left">
            <div className="px-4 lg:w-1/2 sm:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block xl:inline">A </span>
                <span className="block text-orange-600 xl:inline">
                  human-first{" "}
                </span>
                <span className="block xl:inline">fundraising experience.</span>
              </h1>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                A pitch video platform for undernetworked founders to be
                discovered by the right investors with the right message in the
                right way.
              </p>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Because you can&apos;t put a person in a static pitch deck.
              </p>
              <p className="max-w-md mx-auto mt-3 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Not a member? Join us!
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                {/* <PricingPageButton /> */}
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md text-white "
                >
                  Sign up!
                </Link>
              </div>
            </div>
            <div className="flex items-center flex-grow">
              <div className="flex-1 text-center">
                Or
                <Link
                  href="https://www.scroobious.com/founders"
                  className="text-blue-600 mx-1"
                >
                  Learn More
                </Link>
                about the Scroobious experience.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
