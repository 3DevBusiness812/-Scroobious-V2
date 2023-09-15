import { FC, useRef, useEffect, MutableRefObject } from "react";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type ConversationMessage } from "../../state";
import {
  createPolygonPoints,
  boundingRectStyles,
  scrollAnimateTo,
} from "../../helpers";

type TTextSelectionRendererProps = {
  page: PDFPageView;
  message: ConversationMessage;
};

const TextSelectionRenderer: FC<TTextSelectionRendererProps> = ({
  page,
  message,
}) => {
  const { pageNumber, rects } = message.contextDetails;
  const currentScale = useStore((state) => state.currentScale);
  const conversationMessageId = useStore((s) => s.conversationMessageId);
  const conversationMessage = useStore((s) => s.computed.conversationMessage);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);
  const setIsAddMenuOpen = useStore((state) => state.setIsAddMenuOpen);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const me = useStore((s) => s.me);

  const rootThreadMessageId =
    conversationMessage?.rootThreadMessageId ?? conversationMessage?.id;

  const isMine = message.createdById === me?.id;

  const scrollToRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (rootThreadMessageId && rootThreadMessageId === message.id) {
      scrollAnimateTo({
        parent: pdfViewer?.viewer?.parentElement,
        child: scrollToRef.current,
      });
    }
  }, [rootThreadMessageId]);

  return (
    <>
      <svg
        viewBox={`0 0 ${page.width} ${page.height}`}
        className={`pointer-events-none absolute inset-0 ${
          isMine ? "z-20" : "z-10"
        }`}
        key={`${message.id}-${pageNumber}`}
        id={`${message.id}-${pageNumber}`}
      >
        <defs>
          <clipPath id={`shape-merger-${message.id}-${pageNumber}`}>
            {rects.map(({ id, left, top, width, height }, ix) => (
              <polygon
                key={id}
                id={`annotation.${message.id}.${id}`}
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

          <filter id={`shadow-${message.id}-${pageNumber}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="0" />
            <feOffset dx="0" dy="0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          filter={`url(#shadow-${message.id}-${pageNumber})`}
          className={`peer`}
          onClick={(e) => {
            e.preventDefault();
            setIsAddMenuOpen(false);

            window.getSelection()?.removeAllRanges();
            setConversationMessageId(message.id);
          }}
        >
          <rect
            width="100%"
            height="100%"
            clipPath={`url(#shape-merger-${message.id}-${pageNumber})`}
            className={`transition-all pointer-events-auto cursor-pointer origin-center ${
              rootThreadMessageId === message.id
                ? "fill-orange-300/20"
                : "fill-green-500/10 hover:fill-green-500/20"
            }`}
          />
        </g>
      </svg>
      <div
        ref={scrollToRef}
        id={`annotation.${message.id}`}
        style={boundingRectStyles(rects, currentScale)}
        className={`pointer-events-auto absolute transition-colors border ${
          rootThreadMessageId === message.id
            ? "border-orange-500"
            : " border-transparent peer-hover:border-orange-500"
        }`}
      />
    </>
  );
};

export default TextSelectionRenderer;
