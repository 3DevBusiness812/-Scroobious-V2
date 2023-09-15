import { FC, MutableRefObject, useRef, useEffect, useState } from "react";
import interact from "interactjs";
import { InteractEvent, ResizeEvent } from "@interactjs/types";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore, type ConversationMessage } from "../../state";
import { createRectStyles, scrollAnimateTo } from "../../helpers";
import { trpc } from "~/utils/trpc";

type TScreenshotRendererProps = {
  page: PDFPageView;
  message: ConversationMessage;
};

const ScreenshotRenderer: FC<TScreenshotRendererProps> = ({
  message,
  page,
}) => {
  const { rects } = message.contextDetails;

  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);
  const conversationMessage = useStore((s) => s.computed.conversationMessage);
  const isDraggingResizingScreenshot = useStore(
    (s) => s.isDraggingResizingScreenshot
  );
  const setIsDraggingResizingScreenshot = useStore(
    (s) => s.setIsDraggingResizingScreenshot
  );
  const currentScale = useStore((s) => s.currentScale);
  const setIsAddMenuOpen = useStore((s) => s.setIsAddMenuOpen);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const getMessageById = useStore((s) => s.getMessageById);
  const me = useStore((s) => s.me);

  const rootThreadMessageId =
    conversationMessage?.rootThreadMessageId ?? conversationMessage?.id;

  const isMine = message.createdById === me?.id;

  const utils = trpc.useContext();
  const interactRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [rect] = rects;

  const [pos, setPos] = useState(rect!);

  const onMoveStart = () => {
    setConversationMessageId(message.id);
    setIsDraggingResizingScreenshot(true);
  };

  const onMoveEnd = async (event: InteractEvent) => {
    setIsDraggingResizingScreenshot(false);

    const msg = getMessageById(message.id);

    if (!msg) return;
    const { contextDetails: details } = msg!;

    details.rects = details.rects.map((r) => ({
      ...r,
      ...pos,
    }));

    const { pitchDeck } = await utils.client.pitchDeck.updateMessage.mutate({
      id: message.id,
      details,
      body: msg.body,
    });

    setPitchDeck(pitchDeck);
  };

  useEffect(() => {
    if (isMine) {
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
              const { left: x, top: y } = pos;

              const left = x * currentScale + (event.deltaRect?.left ?? 0);
              const top = y * currentScale + (event.deltaRect?.top ?? 0);
              const width = event.rect.width;
              const height = event.rect.height;

              setPos({
                ...pos,
                left: left / currentScale,
                top: top / currentScale,
                width: width / currentScale,
                height: height / currentScale,
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
              const { left: x, top: y, width, height } = pos;

              const left = x * currentScale + dx;
              const top = y * currentScale + dy;

              setPos({
                ...pos,
                left: left / currentScale,
                top: top / currentScale,
                width: width,
                height: height,
              });
            },
            end: onMoveEnd,
            start: onMoveStart,
          },
        });
    }
  });

  useEffect(() => {
    if (!isMine) {
      try {
        interact(interactRef.current).unset();
      } catch (e) {}
    }
  }, [isMine]);

  useEffect(() => {
    if (
      rootThreadMessageId &&
      rootThreadMessageId === message.id &&
      !isDraggingResizingScreenshot
    ) {
      scrollAnimateTo({
        parent: pdfViewer?.viewer?.parentElement,
        child: interactRef.current,
      });
    }
  }, [rootThreadMessageId]);

  return (
    <div
      ref={interactRef}
      id={`annotation.${message.id}`}
      className={`border absolute cursor-pointer pointer-events-auto ${
        isMine ? "z-20" : "z-10"
      } ${
        rootThreadMessageId === message.id
          ? "border-orange-500 bg-orange-300/20"
          : "border-green-500 bg-green-300/10 hover:bg-green-300/20"
      }`}
      style={createRectStyles(
        pos.left,
        pos.top,
        pos.width,
        pos.height,
        currentScale
      )}
      onClick={(e) => {
        e.preventDefault();
        setIsAddMenuOpen(false);

        window.getSelection()?.removeAllRanges();
        setConversationMessageId(message.id);
      }}
    />
  );
};

export default ScreenshotRenderer;
