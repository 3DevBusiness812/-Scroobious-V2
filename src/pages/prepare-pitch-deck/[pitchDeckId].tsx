import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";

const PreparePitchDeckApp = dynamic(() => import("~/components/PDFApp/PreparePitchDeckApp"), {
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
        <title>Prepare Pitch Deck</title>
        <link href="/pdfviewer.css" rel="stylesheet" />
      </Head>

      {!isLoading && (
        <PreparePitchDeckApp
          key={pitchDeckId}
          pitchDeckId={pitchDeckId}
        />
      )}
    </>
  );
}
