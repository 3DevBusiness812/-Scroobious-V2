import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Spinner from "~/components/PDFApp/Spinner";

const PDFReviewerApp = dynamic(() => import("~/components/PDFApp/ReviewerApp"), {
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
  const writtenFeedbackId = router.query.writtenFeedbackId as string;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Written Feedback</title>
        <link href="/pdfviewer.css" rel="stylesheet" />
      </Head>

      {!isLoading && (
        <PDFReviewerApp
          key={writtenFeedbackId}
          writtenFeedbackId={writtenFeedbackId}
        />
      )}
    </>
  );
}
