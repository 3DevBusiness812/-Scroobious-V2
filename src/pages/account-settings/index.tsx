import Head from "next/head";
import { useSession } from "next-auth/react";
import AuthedWithNavbar from "~/components/layouts/AuthedWithNavbar";
import Main from "~/components/AccountSettings";
import Redirect from "~/components/Redirect";
import Spinner from "~/components/Spinner";

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const { user } = session ?? {};

  if (status === "loading")
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );

  if (!user) return <Redirect to="/auth/login" />;
  return (
    <AuthedWithNavbar>
      <Head>
        <title>Account Settings</title>
      </Head>

      <div className="py-4 sm:py-6 lg:py-8 w-full">
        <Main />
      </div>
    </AuthedWithNavbar>
  );
}
