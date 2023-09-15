import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import interact from "interactjs";
import { trpc } from "~/utils/trpc";
import { type InteractEvent } from "@interactjs/types";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { createPositionStyle, normalizeRect } from "../../helpers";
import { useStore, type NewAnnotation } from "../../state";
import { nanoid } from "nanoid";

type TPageAreaHighlighterProps = {
  page: PDFPageView;
  pageNumber: number;
};

const PageAreaHighlighter: FC<TPageAreaHighlighterProps> = ({
  page,
  pageNumber,
}) => {
  const draggerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const cntRef = useRef() as MutableRefObject<HTMLDivElement>;

  const utils = trpc.useContext();

  const [isDrawing, setIsDrawing] = useState(false);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const addAnnotation = useStore((state) => state.addAnnotation);
  const pitchWrittenFeedback = useStore((s) => s.pitchWrittenFeedback);
  const setAnnotation = useStore((state) => state.setAnnotation);
  const currentScale = useStore((state) => state.currentScale);

  useEffect(() => {
    try {
      interact(draggerRef.current).unset();
    } catch (e) {}

    interact(draggerRef.current)
      .styleCursor(false)
      .draggable({})
      .on("dragmove", (event: InteractEvent) => {
        const width = event.pageX - event.clientX0;
        const height = event.pageY - event.clientY0;

        setWidth(width);
        setHeight(height);
      })
      .on("dragstart", (event: InteractEvent) => {
        const { left, top } = page.div.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        setX0(x);
        setY0(y);
        setIsDrawing(true);
      })
      .on("dragend", async (event: InteractEvent) => {
        const { left, top } = page.div.getBoundingClientRect();
        const { x0, y0 } = event;
        const x = x0 - left;
        const y = y0 - top;
        const width = event.pageX - event.clientX0;
        const height = event.pageY - event.clientY0;

        try {
          const annotation = {
            comment: [],
            id: nanoid(),
            text: "",
            type: "screenshot",
            createdAt: new Date().toISOString(),
            rects: [
              {
                ...normalizeRect(x, y, width, height, page.width, page.height),
                pageNumber,
              },
            ].map((rect) => ({
              ...rect,
              top: rect.top / currentScale,
              left: rect.left / currentScale,
              width: rect.width / currentScale,
              height: rect.height / currentScale,
              id: nanoid(),
            })),
          };

          const commentVersion =
            await utils.client.pitchWrittenFeedback.addFeedbackComment.mutate({
              pitchWrittenFeedbackId: pitchWrittenFeedback?.id!,
              data: {
                details: annotation,
              },
            });

          addAnnotation({
            ...annotation,
            commentVersion,
          } as NewAnnotation);
        } catch (err) {}

        setIsDrawing(false);
      });
  }, [currentScale]);

  return (
    <div
      ref={cntRef}
      onMouseDown={() => setAnnotation(null)}
      className={`relative my-[10px] mx-auto overflow-hidden ${
        isDrawing ? "cursor-nwse-resize" : "cursor-crosshair"
      }`}
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
      }}
    >
      {isDrawing && (
        <div
          className="absolute border border-blue-500 bg-blue-300/20"
          style={createPositionStyle(
            x0,
            y0,
            width,
            height,
            page.width,
            page.height
          )}
        />
      )}
      <div ref={draggerRef} className="absolute inset-0" />
    </div>
  );
};

export default PageAreaHighlighter;
