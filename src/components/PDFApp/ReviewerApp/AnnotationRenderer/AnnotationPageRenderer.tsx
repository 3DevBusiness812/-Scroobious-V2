import { FC } from "react";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type PageAnnotationRects } from "../../state";

import TextSelectionRenderer from "./TextSelectionRenderer";
import ScreenshotRenderer from "./ScreenshotRenderer";

type AnnotationPageRendererProps = {
  page: PDFPageView;
  rects: PageAnnotationRects[];
};

const AnnotationPageRenderer: FC<AnnotationPageRendererProps> = ({
  rects,
  page,
}) => {
  const currentScale = useStore((state) => state.currentScale); // causes to re-render properly on zoom/in out

  return (
    <div
      className="relative my-[10px] mx-auto pointer-events-none"
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
      }}
    >
      {rects.map(({ annotation, rects, pageNumber }, ix) =>
        annotation.type === "text" ? (
          <TextSelectionRenderer
            key={`${annotation.id}-${pageNumber}`}
            rects={{ annotation, rects, pageNumber }}
            page={page}
          />
        ) : (
          <ScreenshotRenderer
            key={`${annotation.id}-${pageNumber}`}
            {...{ annotation, rects, pageNumber, page }}
          />
        )
      )}
    </div>
  );
};

export default AnnotationPageRenderer;
