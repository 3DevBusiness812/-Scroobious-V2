import isHotkey from "is-hotkey";
import { useEffect } from "react";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import ZoomSelector from "./ZoomSelector";
import { useStore } from "~/components/PDFApp/state";
import Popover from "~/components/Popover";

const HOTKEYS: Record<string, string> = {
  "mod+=": "zoom-in",
  "mod+-": "zoom-out",
  "mod+0": "zoom-0",
  "mod+2": "next-page",
  "mod+1": "previous-page",
  "mod+S": "toggle-thumbsbar",
  "mod+H": "select-tool-text",
  "mod+J": "select-tool-screenshot",
};

const Toolbar = () => {
  const isPDFViewerLoaded = useStore((state) => state.isPDFViewerLoaded);

  const pagesCount = useStore((state) => state.pagesCount);
  const currentScale = useStore((state) => state.currentScale);
  const maxScale = useStore((state) => state.maxScale);
  const minScale = useStore((state) => state.minScale);
  const currentPageNumber = useStore((state) => state.currentPageNumber);

  const pdfViewer = useStore((state) => state.pdfViewer);
  const linkService = useStore((state) => state.linkService);

  const isViewer = useStore((state) => state.isViewer);

  const onKeyDown = (event: KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      const mark = HOTKEYS[hotkey];
      const hKey = isHotkey(hotkey, event);

      if (hKey && mark === "zoom-out") {
        event.preventDefault();
        if (pdfViewer?._currentScale > minScale) {
          pdfViewer?.decreaseScale();
        }
      } else if (hKey && mark === "zoom-in") {
        event.preventDefault();
        if (pdfViewer?._currentScale < maxScale) {
          pdfViewer?.increaseScale();
        }
      } else if (hKey && mark === "zoom-0") {
        event.preventDefault();
        pdfViewer?._setScale(1, {});
      } else if (hKey && mark === "previous-page") {
        event.preventDefault();
        pdfViewer?.previousPage();
      } else if (hKey && mark === "next-page") {
        event.preventDefault();
        pdfViewer?.nextPage();
      } else if (hKey && mark === "first-page") {
        event.preventDefault();
        linkService?.goToPage(1);
      } else if (hKey && mark === "last-page") {
        event.preventDefault();
        linkService?.goToPage(pagesCount);
      }
    }
  };

  useEffect(() => {
    if (pdfViewer && pagesCount) {
      document.addEventListener("keydown", onKeyDown);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [pdfViewer, pagesCount]);

  return (
    <div
      className={`w-full h-8 flex items-center justify-between bg-gray-50 border border-b-gray-300 shadow-sm text-sm select-none ${
        isPDFViewerLoaded ? "" : "text-gray-300"
      }`}
    >
      <div className="px-1 flex items-center space-x-1">
        <div className="h-5 flex items-center space-x-1 text-xs text-gray-300 hover:text-gray-700 transition-colors">
          <img src="/scroobious_logo.png" className="h-full w-auto" />
        </div>
      </div>

      <div className="px-2 space-x-1 flex items-center justify-end">
        <ZoomSelector />
        <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />
        <button
          disabled={!isPDFViewerLoaded || currentPageNumber === 1}
          className="enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative"
          onClick={() => pdfViewer?.previousPage()}
        >
          <GoArrowUp className="h-4 w-4" />
          <span className="text-xs">
            <Popover x="center" y="bottom">
              <span className="space-y-1">
                <span className="opacity-90 text-center block whitespace-nowrap">
                  Previous Page
                </span>
                <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    ⌘
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    1
                  </span>
                </span>
              </span>
            </Popover>
          </span>
        </button>

        <div className="text-xs items-center text-center w-16">
          {currentPageNumber} of {pagesCount}
        </div>

        <button
          disabled={!isPDFViewerLoaded || currentPageNumber === pagesCount}
          className="enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative"
          onClick={() => pdfViewer?.nextPage()}
        >
          <GoArrowDown className="h-4 w-4" />
          <span className="text-xs">
            <Popover x="align-right" y="bottom">
              <span className="space-y-1">
                <span className="opacity-90 text-center block whitespace-nowrap">
                  Next Page
                </span>
                <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    ⌘
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    2
                  </span>
                </span>
              </span>
            </Popover>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
