import { FC, MutableRefObject, useRef, useEffect } from "react";
import interact from "interactjs";
import { InteractEvent, ResizeEvent } from "@interactjs/types";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type PageAnnotationRects } from "../../state";
import { createRectStyles, normalizeRect, scrollAnimateTo } from "../../helpers";
import { trpc } from "~/utils/trpc";

type TScreenshotRendererProps = PageAnnotationRects & {
  page: PDFPageView;
};

const ScreenshotRenderer: FC<TScreenshotRendererProps> = ({
  annotation,
  rects,
  page,
}) => {
  const isDraggingResizingScreenshot = useStore(
    (s) => s.isDraggingResizingScreenshot
  );
  const setIsDraggingResizingScreenshot = useStore(
    (s) => s.setIsDraggingResizingScreenshot
  );
  const currentScale = useStore((s) => s.currentScale);
  const selectedAnnotation = useStore((s) => s.selectedAnnotation);
  const setIsAddMenuOpen = useStore((s) => s.setIsAddMenuOpen);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const updateAnnotation = useStore((s) => s.updateAnnotation);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const editEnabled = useStore((s) => s.computed.editEnabled);
  const me = useStore((s) => s.me);

  const isMine = annotation.commentVersion.author.id === me?.id;

  const utils = trpc.useContext();
  const interactRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [rect] = rects;
  const { left, top, width, height } = rect!;

  const onMoveStart = () => setIsDraggingResizingScreenshot(true);

  const onMoveEnd = async (event: InteractEvent) => {
    setIsDraggingResizingScreenshot(false);

    if (!selectedAnnotation) return;

    const annotation = {
      ...selectedAnnotation
    };

    const { commentVersion: comment, ...rest } = annotation;

    const commentVersion =
      await utils.client.pitchWrittenFeedback.updateFeedbackComment.mutate({
        id: comment.id,
        v: comment.v,
        data: {
          details: rest,
        },
      });

    updateAnnotation({
      ...annotation,
      commentVersion,
    });
  };

  useEffect(() => {
    if (editEnabled) {
      interact(interactRef.current)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: {
            resistance: 30,
            minSpeed: 200,
            endSpeed: 100,
          },
          listeners: {
            move(event: ResizeEvent) {
              const [rect0] = annotation.rects;
              const { left: x, top: y, ...rect } = rect0!;

              const left = x * currentScale + (event.deltaRect?.left ?? 0);
              const top = y * currentScale + (event.deltaRect?.top ?? 0);
              const width = event.rect.width;
              const height = event.rect.height;

              updateAnnotation({
                ...annotation,
                rects: [
                  {
                    ...rect,
                    ...normalizeRect(
                      left,
                      top,
                      width,
                      height,
                      page.width,
                      page.height
                    ),
                  },
                ].map((rect) => ({
                  ...rect,
                  top: rect.top / currentScale,
                  left: rect.left / currentScale,
                  width: rect.width / currentScale,
                  height: rect.height / currentScale,
                })),
              });
            },
            end: onMoveEnd,
            start: onMoveStart,
          },
          modifiers: [
            interact.modifiers.restrictEdges({
              outer: "parent",
            }),
          ],
        })
        .draggable({
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
            }),
          ],

          listeners: {
            move(event) {
              const { dx, dy } = event;
              const [rect0] = annotation.rects;
              const { left: x, top: y, width, height, ...rect } = rect0!;

              const left = x * currentScale + dx;
              const top = y * currentScale + dy;

              updateAnnotation({
                ...annotation,
                rects: [
                  {
                    ...rect,
                    ...normalizeRect(
                      left,
                      top,
                      width * currentScale,
                      height * currentScale,
                      page.width,
                      page.height
                    ),
                  },
                ].map((rect) => ({
                  ...rect,
                  top: rect.top / currentScale,
                  left: rect.left / currentScale,
                  width: rect.width / currentScale,
                  height: rect.height / currentScale,
                })),
              });
            },
            end: onMoveEnd,
            start: onMoveStart,
          },
        });
    }
  });

  useEffect(() => {
    if (!editEnabled) {
      try {
        interact(interactRef.current).unset();
      } catch (e) {}
    }
  }, [editEnabled]);

  useEffect(() => {
    if (
      selectedAnnotation?.id === annotation.id &&
      !isDraggingResizingScreenshot
    ) {
      scrollAnimateTo({
        parent: pdfViewer?.viewer?.parentElement,
        child: interactRef.current,
      });
    }
  }, [selectedAnnotation]);

  return (
    <div
      ref={interactRef}
      id={`annotation.${annotation.id}`}
      className={`border absolute cursor-pointer pointer-events-auto ${
        isMine ? "z-20" : "z-10"
      } ${
        selectedAnnotation?.id === annotation.id
          ? "border-orange-500 bg-orange-300/20"
          : "border-green-500 bg-green-300/10 hover:bg-green-300/20"
      }`}
      style={createRectStyles(left, top, width, height, currentScale)}
      onClick={(e) => {
        e.preventDefault();
        setIsAddMenuOpen(false);

        window.getSelection()?.removeAllRanges();
        setAnnotation(annotation);
      }}
    />
  );
};

export default ScreenshotRenderer;
