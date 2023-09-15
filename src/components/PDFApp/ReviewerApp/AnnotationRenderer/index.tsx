import { FC } from "react";
import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { getRectsByAnnotationByPage } from "../../helpers";
import AnnotationPageRenderer from "./AnnotationPageRenderer";
import { useStore } from "../../state";

type TAnnotationRendererProps = {
  pdfViewer: PDFViewer;
};

const AnnotationRenderer: FC<TAnnotationRendererProps> = ({ pdfViewer }) => {
  const pagesCount = useStore((s) => s.pagesCount);
  const annotations = useStore((s) => s.annotations);
  const isViewer = useStore((state) => state.isViewer); // causes to re-render properly on zoom/in out

  const pages = Array(pagesCount)
    .fill(0)
    .map((_, ix) => pdfViewer.getPageView(ix) as PDFPageView);

  const rectsByAnnotationPage = getRectsByAnnotationByPage(
    annotations,
    pagesCount,
    isViewer()
  );

  return (
    <div className="absolute z-10 w-full h-full inset-0 pointer-events-none">
      {rectsByAnnotationPage.map((page, ix) => (
        <AnnotationPageRenderer
          key={`${page.pageNumber}`}
          page={pages[ix]!}
          rects={page.rects}
        />
      ))}
    </div>
  );
};

export default AnnotationRenderer;
