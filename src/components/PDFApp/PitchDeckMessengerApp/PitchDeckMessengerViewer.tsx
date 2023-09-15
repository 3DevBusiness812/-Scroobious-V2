import { useStore, type AppState } from "../state";
import PDFViewerBase from "../PDFViewerBase";
import { useSearchParams } from 'next/navigation';
import Toolbar from "./Toolbar";
import ThumbSidebar from "./ThumbSidebar";
import AddSelectionMenu from "./AddSelectionMenu";
import AreaHighlighter from "./AreaHighlighter";
import MessageAnnotationRenderer from "./MessageAnnotationRenderer";
import Sidebar from "./Sidebar";

type PitchDeckMessengerViewerProps = {
  fileUrl: string;
  me: AppState["me"];
  pitchWrittenFeedback: AppState["pitchWrittenFeedback"];
  pitchDeck: AppState["pitchDeck"];
  conversation: AppState["conversation"];
};

function PitchDeckMessengerViewer({
  fileUrl,
  me,
  pitchWrittenFeedback,
  pitchDeck,
  conversation,
}: PitchDeckMessengerViewerProps) {
  const pdfViewer = useStore((s) => s.pdfViewer);
  const isPDFViewerLoaded = useStore((s) => s.isPDFViewerLoaded);
  const isInvestor = useStore((s) => s.isInvestor);
  const setConversation = useStore((s) => s.setConversation);

  const searchParams = useSearchParams();
  const messageId = searchParams.get('messageId');


  return (
    <>
      <div
        className="flex flex-1 flex-col bg-gray-100 relative"
        id="pdf-reviewer-app"
      >
        <Toolbar />

        <div className="h-full w-full flex flex-1 relative">
          <ThumbSidebar />
          <div className="h-full w-full flex flex-1 flex-col relative">
            <div className="flex-1 relative w-full">
              <PDFViewerBase
                {...{
                  fileUrl,
                  me,
                  pitchWrittenFeedback,
                  pitchDeck,
                  minScale: 0.25,
                  maxScale: 5,
                  messageId,
                  onBeforeLoad: () => {
                    setConversation(conversation);
                  }
                }}
              >
                {isPDFViewerLoaded && pdfViewer && (
                  <>
                    <AreaHighlighter pdfViewer={pdfViewer} />
                    <MessageAnnotationRenderer pdfViewer={pdfViewer} />
                  </>
                )}
              </PDFViewerBase>
            </div>
          </div>

          {isPDFViewerLoaded && <Sidebar />}
        </div>
      </div>
      {isInvestor() && <AddSelectionMenu />}
    </>
  );
}

export default PitchDeckMessengerViewer;
