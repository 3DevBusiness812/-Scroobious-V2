import { FC } from "react";
import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore } from "../../state";
import PageAreaHighlighter from "./PageAreaHighlighter";

type TAreaHighlighterProps = {
  pdfViewer: PDFViewer;
};

const AreaHighlighter: FC<TAreaHighlighterProps> = ({ pdfViewer }) => {
  const pagesCount = useStore((s) => s.pagesCount);
  const selectedTool = useStore((s) => s.selectedTool);

  const pages = Array(pagesCount)
    .fill(0)
    .map((_, ix) => pdfViewer.getPageView(ix) as PDFPageView);

  return (
    <>
      {selectedTool === "screenshot" && (
        <div className="absolute z-10 w-full h-full inset-0">
          {pages.map((page, ix) => (
            <PageAreaHighlighter key={page.id} page={page} pageNumber={ix + 1} />
          ))}
        </div>
      )}
    </>
  );
};

export default AreaHighlighter;
