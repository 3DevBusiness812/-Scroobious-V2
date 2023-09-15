import { trpc } from "~/utils/trpc";
import ErrorBoundary from "../ErrorBoundary";
import Spinner from "../Spinner";
import PDFReviewerApp from "./PDFReviewerApp";

type TAppProps = {
  writtenFeedbackId: string;
};

function App({ writtenFeedbackId }: TAppProps) {
  const { isFetched: isFeedbackFetched, data: pitchWrittenFeedback } =
    trpc.pitchWrittenFeedback.byId.useQuery({
      id: writtenFeedbackId,
    });

  const { isFetched: isMeFetched, data: me = null } = trpc.user.me.useQuery();

  return (
    <ErrorBoundary>
      <div className="w-screen fixed left-0">
        <div className="w-full h-[calc(100vh-0px)] min-h-full max-h-full flex flex-col bg-gray-50">
          <main className="relative space-y-4 w-full max-h-full mx-auto flex flex-col flex-1 overflow-hidden">
            {isMeFetched && isFeedbackFetched ? (
              <PDFReviewerApp
                fileUrl={pitchWrittenFeedback?.originalPitchDeck?.file.url!}
                me={me}
                key={pitchWrittenFeedback?.id}
                pitchWrittenFeedback={pitchWrittenFeedback ?? null}
              />
            ) : (
              <div className="flex flex-1 w-full h-full items-center justify-center">
                <Spinner />
              </div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
