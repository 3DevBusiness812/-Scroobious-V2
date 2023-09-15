import isHotkey from "is-hotkey";
import { useEffect } from "react";
import Link from "next/link";
import {
  GoArrowUp,
  GoArrowDown,
  GoBook,
  GoScreenFull,
  GoTag
} from "react-icons/go";
import ZoomSelector from "./ZoomSelector";
import { useStore } from "../../state";
import Popover from "~/components/Popover";
import CopyPublicLinkButton from "./CopyPublicLinkButton";

const HOTKEYS: Record<string, string> = {
  "mod+=": "zoom-in",
  "mod+-": "zoom-out",
  "mod+0": "zoom-0",
  "mod+2": "next-page",
  "mod+1": "previous-page",
  "mod+S": "toggle-thumbsbar",
  "mod+E": "toggle-page-section-labels",
  "mod+H": "select-tool-text",
  "mod+J": "select-tool-screenshot",
};

const Toolbar = () => {
  const toggleThumbSidebar = useStore((s) => s.toggleThumbSidebar);
  const isThumbSidebarOpen = useStore((s) => s.isThumbSidebarOpen);
  const isPDFViewerLoaded = useStore((state) => state.isPDFViewerLoaded);

  const toggleShowPageSectionLabel = useStore((state) => state.toggleShowPageSectionLabel);
  const showPageSectionLabel = useStore((state) => state.showPageSectionLabel);

  const pagesCount = useStore((state) => state.pagesCount);
  const currentScale = useStore((state) => state.currentScale);
  const currentPageNumber = useStore((state) => state.currentPageNumber);
  const selectedTool = useStore((state) => state.selectedTool);
  const setSelectedTool = useStore((state) => state.setSelectedTool);

  const pdfViewer = useStore((state) => state.pdfViewer);
  const linkService = useStore((state) => state.linkService);
  const editEnabled = useStore((state) => state.computed.editEnabled);

  const isViewer = useStore((state) => state.isViewer);

  const onKeyDown = (event: KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      const mark = HOTKEYS[hotkey];
      const hKey = isHotkey(hotkey, event);

      if (hKey && mark === "zoom-out") {
        event.preventDefault();
        pdfViewer?.decreaseScale();
      } else if (hKey && mark === "zoom-in") {
        event.preventDefault();
        pdfViewer?.increaseScale();
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
      } else if (hKey && mark === "toggle-thumbsbar") {
        event.preventDefault();
        toggleThumbSidebar();
      } else if (hKey && mark === "toggle-page-section-labels") {
        event.preventDefault();
        toggleShowPageSectionLabel();
      } else if (hKey && mark === "select-tool-text" && editEnabled) {
        event.preventDefault();
        setSelectedTool("text");
      } else if (hKey && mark === "select-tool-screenshot" && editEnabled) {
        event.preventDefault();
        setSelectedTool("screenshot");
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
        <button
          disabled={!isPDFViewerLoaded}
          className={`enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative ${
            isThumbSidebarOpen
              ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
              : ""
          }`}
          onClick={toggleThumbSidebar}
        >
          <GoBook className="h-4 w-4" />
          <span className="text-xs">
            <Popover x="align-left" y="bottom">
              <span className="space-y-1">
                <span className="opacity-90 text-center block whitespace-nowrap">
                  Toggle Page Preview
                </span>
                <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    ⌘
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    S
                  </span>
                </span>
              </span>
            </Popover>
          </span>
        </button>

        <button
          disabled={!isPDFViewerLoaded}
          className={`enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative ${
            showPageSectionLabel
              ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
              : ""
          }`}
          onClick={toggleShowPageSectionLabel}
        >
          <GoTag className="h-4 w-4" />
          <span className="text-xs">
            <Popover x="align-left" y="bottom">
              <span className="space-y-1">
                <span className="opacity-90 text-center block whitespace-nowrap">
                  Toggle Page Section labels
                </span>
                <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    ⌘
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                    E
                  </span>
                </span>
              </span>
            </Popover>
          </span>
        </button>

        <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />

        {isViewer() ? (
          <div className="h-5 flex items-center space-x-1 text-xs text-gray-300 hover:text-gray-700 transition-colors">
            <img src="/scroobious_logo.png" className="h-full w-auto" />
          </div>
        ) : (
          <Link
            href="/admin/written-feedback"
            className="h-5 group flex items-center space-x-1 text-xs text-gray-300 hover:text-gray-500 transition-colors relative"
          >
            <img src="/scroobious_logo.png" className="h-full w-auto" />
            <span
              className="transition-all ml-1 group-hover:ml-2"
              aria-hidden="true"
            >
              →
            </span>
            <div className="w-40 overflow-hidden">
              <div className="transition-all -ml-2 whitespace-nowrap -translate-x-full group-hover:translate-x-0 group-hover:ml-0">
                Back to All Requests
              </div>
            </div>
          </Link>
        )}
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
            <Popover x="center" y="bottom">
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
        <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />
        {editEnabled ? (
          <>
            <button
              disabled={!isPDFViewerLoaded}
              className={`enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative ${
                isPDFViewerLoaded && selectedTool === "text"
                  ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
                  : ""
              }`}
              onClick={() => setSelectedTool("text")}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z"
                />
              </svg>
              <span className="text-xs">
                <Popover x="align-right" y="bottom">
                  <span className="space-y-1">
                    <span className="opacity-90 text-center block whitespace-nowrap">
                      Highlight Text
                    </span>
                    <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                        ⌘
                      </span>
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                        H
                      </span>
                    </span>
                  </span>
                </Popover>
              </span>
            </button>

            <button
              disabled={!isPDFViewerLoaded}
              className={`enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative ${
                isPDFViewerLoaded && selectedTool === "screenshot"
                  ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
                  : ""
              }`}
              onClick={() => setSelectedTool("screenshot")}
            >
              <GoScreenFull className="w-4 h-4" />

              <span className="text-xs">
                <Popover x="align-right" y="bottom">
                  <span className="space-y-1">
                    <span className="opacity-90 text-center block whitespace-nowrap">
                      Highlight Area
                    </span>
                    <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                        ⌘
                      </span>
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                        J
                      </span>
                    </span>
                  </span>
                </Popover>
              </span>
            </button>
          </>
        ) : (
          <CopyPublicLinkButton />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
