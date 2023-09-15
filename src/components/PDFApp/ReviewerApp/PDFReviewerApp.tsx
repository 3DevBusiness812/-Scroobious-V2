import { useStore, type AppState } from "../state";
import PDFViewerBase from "../PDFViewerBase";
import Toolbar from "./Toolbar";
import AddSelectionMenu from "./AddSelectionMenu";
import AnnotationRenderer from "./AnnotationRenderer";
import AreaHighlighter from "./AreaHighlighter";
import PageSectionsRenderer from "./PageSectionsRenderer";
import ThumbSidebar from "./ThumbSidebar";
import Sidebar from "./Sidebar";

type PDFReviewerAppProps = {
  fileUrl: string;
  me: AppState["me"];
  pitchWrittenFeedback: AppState["pitchWrittenFeedback"];
};

function PDFReviewerApp({
  fileUrl,
  me,
  pitchWrittenFeedback
}: PDFReviewerAppProps) {
  const pdfViewer = useStore((s) => s.pdfViewer);
  const isPDFViewerLoaded = useStore((s) => s.isPDFViewerLoaded);
  const editEnabled = useStore((s) => s.computed.editEnabled);

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
                  pitchDeck: pitchWrittenFeedback?.originalPitchDeck!,
                  minScale: 0.25,
                  maxScale: 5,
                }}
              >
                {isPDFViewerLoaded && pdfViewer && (
                  <>
                    <PageSectionsRenderer pdfViewer={pdfViewer} />
                    {editEnabled && <AreaHighlighter pdfViewer={pdfViewer} />}
                    <AnnotationRenderer pdfViewer={pdfViewer} />
                  </>
                )}
              </PDFViewerBase>
            </div>
          </div>

          {isPDFViewerLoaded && pitchWrittenFeedback && <Sidebar />}
        </div>
      </div>
      {editEnabled && <AddSelectionMenu />}
    </>
  );
}

export default PDFReviewerApp;
