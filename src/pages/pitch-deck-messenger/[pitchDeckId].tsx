import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";

const PitchDeckMessengerApp = dynamic(() => import("~/components/PDFApp/PitchDeckMessengerApp"), {
  loading: () => (
    <div className="flex flex-1 w-screen h-screen items-center justify-center bg-gray-100">
      <Spinner />
    </div>
  ),
  ssr: false,
});

export default function WrittenFeedbackDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pitchDeckId = router.query.pitchDeckId as string;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Pitch Deck Conversation</title>
        <link href="/pdfviewer.css" rel="stylesheet" />
      </Head>

      {!isLoading && (
        <PitchDeckMessengerApp
          key={pitchDeckId}
          pitchDeckId={pitchDeckId}
        />
      )}
    </>
  );
}
