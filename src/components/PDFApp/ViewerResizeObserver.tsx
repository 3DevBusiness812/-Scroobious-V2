import useResizeObserver from "@react-hook/resize-observer";
import { MutableRefObject, useRef } from "react";
import { useStore } from "./state";

type TViewerResizeObserverProps = {
  target: MutableRefObject<HTMLElement>;
};

const ViewerResizeObserver = ({ target }: TViewerResizeObserverProps) => {
  const lastTimeCall = useRef(+new Date());
  const DEBOUNCE_MS = 0;

  const pdfViewer = useStore((state) => state.pdfViewer);

  useResizeObserver(target, (entry) => {
    const newTime = +new Date();

    if (newTime - lastTimeCall.current >= DEBOUNCE_MS) {
      lastTimeCall.current = newTime;

      if (!pdfViewer) return;

      const currentScaleValue = pdfViewer.currentScaleValue;
      if (
        currentScaleValue === "auto" ||
        currentScaleValue === "page-fit" ||
        currentScaleValue === "page-width"
      ) {
        pdfViewer.currentScaleValue = currentScaleValue;
      }
      pdfViewer.update();
    }
  });
  return <></>;
};

export default ViewerResizeObserver;
