import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { trpc } from "~/utils/trpc";
import { useStore, type NewAnnotation } from "../state";
import { getPagesFromRange, getClientRects } from "../helpers"
import { nanoid } from "nanoid";

export default function AddSelectionMenu() {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  const utils = trpc.useContext();

  const setSelection = useStore((state) => state.setSelection);
  const pitchWrittenFeedback = useStore((s) => s.pitchWrittenFeedback);
  const addAnnotation = useStore((state) => state.addAnnotation);
  const setIsAddMenuOpen = useStore((state) => state.setIsAddMenuOpen);
  const isAddMenuOpen = useStore((state) => state.isAddMenuOpen);
  const currentScale = useStore((state) => state.currentScale);

  const onSelectionChange = () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount && selection?.getRangeAt(0);

    if (!selection || !range || selection.isCollapsed) {
      setIsAddMenuOpen(false);
      return;
    }

    const pages = getPagesFromRange(range) ?? [];
    const rects = getClientRects(range, pages);

    if (!pages.length || !rects.length) setIsAddMenuOpen(false);
  };

  const onSelectionEnd = (e: MouseEvent) => {
    const selection = window.getSelection();
    const range = selection?.rangeCount && selection?.getRangeAt(0);

    if (!isAddMenuOpen) {
      setPosX(e.pageX - 15);
      setPosY(e.pageY - 60);
    }

    if (range && selection && !selection.isCollapsed) {
      const pages = getPagesFromRange(range) ?? [];
      const rects = getClientRects(range, pages) ?? [];

      if (!pages.length || !rects.length) return;

      setSelection(window.getSelection());
      setIsAddMenuOpen(true);
    }
  };

  const onSelectionAnnotate = async () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount && selection?.getRangeAt(0);

    if (range && selection && !selection.isCollapsed) {
      const pages = getPagesFromRange(range) ?? [];
      const rects = getClientRects(range, pages) ?? [];

      if (!pages.length || !rects.length) return;

      // const text = range.toString();
      const text = "";

      selection.removeAllRanges();

      const annotation = {
        comment: [],
        id: nanoid(),
        text,
        type: "text",
        createdAt: new Date().toISOString(),
        rects: rects.map((rect) => ({
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

      // focusEditor();
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("mouseup", onSelectionEnd);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("mouseup", onSelectionEnd);
    };
  }, []);

  return (
    <div
      className={`absolute z-20 ${isAddMenuOpen ? "visible" : "invisible"}`}
      style={{
        top: `${posY}px`,
        left: `${posX}px`,
      }}
    >
      <span className="inline-flex rounded shadow-md my-1">
        <button
          type="button"
          onClick={onSelectionAnnotate}
          className="relative inline-flex items-center rounded border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <GoPlus className=" h-4 w-4" aria-hidden="true" />
        </button>
      </span>
    </div>
  );
}
