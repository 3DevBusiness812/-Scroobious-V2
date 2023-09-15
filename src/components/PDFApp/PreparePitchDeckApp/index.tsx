import { trpc } from "~/utils/trpc";
import PDFPreparePitchDeckViewer from "./PDFPreparePitchDeckViewer";
import ErrorBoundary from "../ErrorBoundary";
import Spinner from "../Spinner";
import { type PitchDeckSection } from "../state";

type TPreparePitchDeckAppProps = {
  pitchDeckId: string;
};

function PreparePitchDeckApp({ pitchDeckId }: TPreparePitchDeckAppProps) {
  const { isFetched: isPitchDeckFetched, data: pitchDeck } =
    trpc.pitchDeck.byId.useQuery({
      id: pitchDeckId,
    });

  const { isFetched: isMeFetched, data: me = null } = trpc.user.me.useQuery();
  const isDataLoaded = isMeFetched && isPitchDeckFetched

  const pitchDeckCreationSections = (pitchDeck?.pitch.course?.courseDefinition.courseStepDefinitions ?? []).map(
    (courseStepDefinition) =>
      ({ courseStepDefinition } as unknown as PitchDeckSection)
  );

  //
  // TODO:
  //  * allow access only to founders owning the pitch (deck)
  //

  return (
    <ErrorBoundary>
      <div className="w-screen fixed left-0">
        <div className="w-full h-[calc(100vh-0px)] min-h-full max-h-full flex flex-col bg-gray-50">
          <main className="relative space-y-4 w-full max-h-full mx-auto flex flex-col flex-1 overflow-hidden">
            {isDataLoaded ? (
              <PDFPreparePitchDeckViewer
                fileUrl={pitchDeck?.file.url!}
                me={me}
                key={pitchDeck?.id}
                pitchWrittenFeedback={null}
                pitchDeck={pitchDeck ?? null}
                pitchDeckCreationSections={pitchDeckCreationSections ?? []}
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

export default PreparePitchDeckApp;
