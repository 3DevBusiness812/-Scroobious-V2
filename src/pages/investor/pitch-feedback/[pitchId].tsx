import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import Redirect from "~/components/Redirect";
import InvestorPitchFeedback from "~/components/investor/PitchFeedback";

export default function InvestorPitchFeedbackPage() {
  const router = useRouter();
  const pitchId = router.query.pitchId as string;

  const { isFetched: isMeFetched, data: me } = trpc.user.me.useQuery();
  const { isFetched: isPitchFetched, data: pitch } = trpc.pitch.byId.useQuery({
    id: pitchId,
  });
  const { isFetched: isPitchFeedbackFetched, data: pitchFeedback } = trpc.pitch.getInvestorPitchFeedback.useQuery({
    id: pitchId,
  });

  const isLoading = !isMeFetched || !isPitchFetched || !isPitchFeedbackFetched;
  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );

  if (!me || !me.capabilities?.includes("INVESTOR")) return <Redirect to="/auth/login" />;

  return (
    <>
      <Head>
        <title>Investor Pitch Feedback</title>
      </Head>
      <InvestorPitchFeedback pitch={pitch ?? null} pitchFeedback={pitchFeedback ?? null} />
    </>
  );
}
