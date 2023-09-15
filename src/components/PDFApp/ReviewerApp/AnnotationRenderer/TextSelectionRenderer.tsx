import { FC, useRef, useEffect, MutableRefObject } from "react";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type PageAnnotationRects } from "../../state";
import {
  createPolygonPoints,
  boundingRectStyles,
  scrollAnimateTo,
} from "../../helpers";

type TTextSelectionRendererProps = {
  page: PDFPageView;
  rects: PageAnnotationRects;
};

const TextSelectionRenderer: FC<TTextSelectionRendererProps> = ({
  page,
  rects: { annotation, rects, pageNumber },
}) => {
  const currentScale = useStore((state) => state.currentScale);
  const selectedAnnotation = useStore((state) => state.selectedAnnotation);
  const setIsAddMenuOpen = useStore((state) => state.setIsAddMenuOpen);
  const setAnnotation = useStore((state) => state.setAnnotation);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const me = useStore((s) => s.me);

  const isMine = annotation.commentVersion.author.id === me?.id;

  const scrollToRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (selectedAnnotation?.id === annotation.id) {
      scrollAnimateTo({
        parent: pdfViewer?.viewer?.parentElement,
        child: scrollToRef.current,
      });
    }
  }, [selectedAnnotation]);

  return (
    <>
      <svg
        viewBox={`0 0 ${page.width} ${page.height}`}
        className={`pointer-events-none absolute inset-0 ${
          isMine ? "z-20" : "z-10"
        }`}
        key={`${annotation.id}-${pageNumber}`}
        id={`${annotation.id}-${pageNumber}`}
      >
        <defs>
          <clipPath id={`shape-merger-${annotation.id}-${pageNumber}`}>
            {rects.map(({ id, left, top, width, height }, ix) => (
              <polygon
                key={id}
                id={`annotation.${annotation.id}.${id}`}
                points={createPolygonPoints(
                  left,
                  top,
                  width,
                  height,
                  currentScale
                )}
                className="pointer-events-auto cursor-pointer origin-center"
              />
            ))}
          </clipPath>

          <filter id={`shadow-${annotation.id}-${pageNumber}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="0" />
            <feOffset dx="0" dy="0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          filter={`url(#shadow-${annotation.id}-${pageNumber})`}
          className={`peer`}
          onClick={(e) => {
            e.preventDefault();
            setIsAddMenuOpen(false);

            window.getSelection()?.removeAllRanges();
            setAnnotation(annotation);
          }}
        >
          <rect
            width="100%"
            height="100%"
            clipPath={`url(#shape-merger-${annotation.id}-${pageNumber})`}
            className={`transition-all pointer-events-auto cursor-pointer origin-center ${
              selectedAnnotation?.id === annotation.id
                ? "fill-orange-300/20"
                : "fill-green-500/10 hover:fill-green-500/20"
            }`}
          />
        </g>
      </svg>
      <div
        ref={scrollToRef}
        id={`annotation.${annotation.id}`}
        style={boundingRectStyles(rects, currentScale)}
        className={`pointer-events-auto absolute transition-colors border ${
          selectedAnnotation?.id === annotation.id
            ? "border-orange-500"
            : " border-transparent peer-hover:border-orange-500"
        }`}
      />
    </>
  );
};

export default TextSelectionRenderer;
