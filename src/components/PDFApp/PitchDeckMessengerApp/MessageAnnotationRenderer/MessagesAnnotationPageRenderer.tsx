import { FC } from "react";
import { PDFPageView, PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type ConversationMessage } from "../../state";
import TextSelectionRenderer from "./TextSelectionRenderer";
import ScreenshotRenderer from "./ScreenshotRenderer";

type MessagesAnnotationPageRendererProps = {
  pageIx: number;
  messages: ConversationMessage[];
  pdfViewer: PDFViewer;
};

const MessagesAnnotationPageRenderer: FC<
  MessagesAnnotationPageRendererProps
> = ({ pageIx, messages, pdfViewer }) => {
  const page = pdfViewer.getPageView(pageIx) as PDFPageView;
  const currentScale = useStore((state) => state.currentScale); // causes to re-render properly on zoom/in out

  const rootMessages = messages.filter((msg) => !msg.rootThreadMessageId);

  return (
    <div
      className="relative my-[10px] mx-auto pointer-events-none"
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
      }}
    >
      {rootMessages.map((msg) =>
        msg.contextDetails.type === "text" ? (
          <TextSelectionRenderer key={msg.id} message={msg} page={page} />
        ) : (
          <ScreenshotRenderer key={msg.id} message={msg} page={page} />
        )
      )}
    </div>
  );
};

export default MessagesAnnotationPageRenderer;
