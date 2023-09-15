import React, { useState } from "react";
import Head from "next/head";
import AuthedWithNavbar from "~/components/layouts/AuthedWithNavbar";
import { trpc } from "~/utils/trpc";
import WrittenFeedbackTable from "~/components/written-feedback/WrittenFeedbackTable";
import FilterFeedbackStatusDropdown, {
  feedbackStatusOptions,
} from "~/components/written-feedback/FilterFeedbackStatusDropdown";
import Spinner from "~/components/Spinner";
import Redirect from "~/components/Redirect";

export default function AdminWrittenFeedbackPage() {
  const [selected, setSelected] = useState(feedbackStatusOptions[0]);

  const { isFetched, data: me } = trpc.user.me.useQuery();

  if (!isFetched)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );

  if (!me) return <Redirect to="/auth/login" />;

  if (!me?.permissions.includes("pitch_written_feedback:admin"))
    return <Redirect to="/auth/login" />;

  return (
    <AuthedWithNavbar>
      <Head>
        <title>Written Feedback Requests</title>
      </Head>

      <div className="py-4 sm:py-6 lg:py-8 w-full">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Written Feedback Requests
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of pitch written feedback requests.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex justify-end">
            <FilterFeedbackStatusDropdown
              selected={selected!}
              setSelected={setSelected}
              filterOptions={feedbackStatusOptions}
            />
          </div>
        </div>
        <WrittenFeedbackTable filterOption={selected!} me={me} />
      </div>
    </AuthedWithNavbar>
  );
}
