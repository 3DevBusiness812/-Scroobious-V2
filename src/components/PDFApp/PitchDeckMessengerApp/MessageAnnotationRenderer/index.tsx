import { FC } from "react";
import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";
// import { getRectsByAnnotationByPage } from "../../helpers";
import MessagesAnnotationPageRenderer from "./MessagesAnnotationPageRenderer";
import { useStore } from "../../state";

type MessageAnnotationRendererProps = {
  pdfViewer: PDFViewer;
};

const MessageAnnotationRenderer: FC<MessageAnnotationRendererProps> = ({
  pdfViewer,
}) => {
  const messagesByPage = useStore((s) => s.computed.messagesByPage);

  return (
    <div className="absolute z-10 w-full h-full inset-0 pointer-events-none">
      {messagesByPage.map(([pageIx, messages]) => (
        <MessagesAnnotationPageRenderer
          key={`${pageIx}`}
          pageIx={pageIx}
          messages={messages}
          pdfViewer={pdfViewer}
        />
      ))}
    </div>
  );
};

export default MessageAnnotationRenderer;
