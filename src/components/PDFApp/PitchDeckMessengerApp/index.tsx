import { trpc } from "~/utils/trpc";
import PitchDeckMessengerViewer from "./PitchDeckMessengerViewer";
import ErrorBoundary from "../ErrorBoundary";
import Spinner from "../Spinner";

type PitchDeckMessengerAppProps = {
  pitchDeckId: string;
};

function PitchDeckMessengerApp({ pitchDeckId }: PitchDeckMessengerAppProps) {
  const { isFetched: isPitchDeckFetched, data: pitchDeck } =
    trpc.pitchDeck.byId.useQuery({
      id: pitchDeckId,
    });

  const { isFetched: isConversationFetched, data: conversation } = trpc.pitchDeck.conversation.useQuery({
    id: pitchDeckId
  });

  const { isFetched: isMeFetched, data: me = null } = trpc.user.me.useQuery();
  const isDataLoaded = isMeFetched && isPitchDeckFetched && isConversationFetched;

  return (
    <ErrorBoundary>
      <div className="w-screen fixed left-0">
        <div className="w-full h-[calc(100vh-0px)] min-h-full max-h-full flex flex-col bg-gray-50">
          <main className="relative space-y-4 w-full max-h-full mx-auto flex flex-col flex-1 overflow-hidden">
            {isDataLoaded ? (
              <PitchDeckMessengerViewer
                fileUrl={pitchDeck?.file.url!}
                me={me}
                key={pitchDeck?.id}
                pitchWrittenFeedback={null}
                pitchDeck={pitchDeck ?? null}
                conversation={conversation ?? null}
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

export default PitchDeckMessengerApp;
