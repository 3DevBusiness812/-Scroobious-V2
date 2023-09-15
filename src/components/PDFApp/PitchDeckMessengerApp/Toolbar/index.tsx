import isHotkey from "is-hotkey";
import { useEffect } from "react";
import Link from "next/link";
import {
  GoArrowUp,
  GoArrowDown,
  GoBook,
  GoScreenFull,
  GoSettings,
  GoEyeClosed,
  GoEye,
} from "react-icons/go";
import { env } from "~/env.mjs";
import ZoomSelector from "./ZoomSelector";
import { useStore } from "../../state";
import Popover from "~/components/Popover";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";

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
  const utils = trpc.useContext();

  const toggleThumbSidebar = useStore((s) => s.toggleThumbSidebar);
  const isThumbSidebarOpen = useStore((s) => s.isThumbSidebarOpen);
  const isPDFViewerLoaded = useStore((state) => state.isPDFViewerLoaded);

  const pagesCount = useStore((state) => state.pagesCount);
  const currentScale = useStore((state) => state.currentScale);
  const currentPageNumber = useStore((state) => state.currentPageNumber);
  const selectedTool = useStore((state) => state.selectedTool);
  const setSelectedTool = useStore((state) => state.setSelectedTool);
  const isInvestor = useStore((state) => state.isInvestor);
  const me = useStore((state) => state.me);
  const isFounder = useStore((state) => state.isFounder);
  const isL2Reviewer = useStore((state) => state.isL2Reviewer);

  const pdfViewer = useStore((state) => state.pdfViewer);
  const linkService = useStore((state) => state.linkService);
  const editEnabled = useStore((state) => state.computed.editEnabled);
  const pitchDeck = useStore((state) => state.pitchDeck);
  const conversation = useStore((s) => s.conversation);
  const setConversation = useStore((s) => s.setConversation);

  const conversationMessages = useStore((s) => s.computed.conversationMessages);

  const messageAnonymously = conversation?.conversationParticipants.find(
    (p) => p.userId === me?.id
  )?.messageAnonymously;

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
      } else if (hKey && mark === "select-tool-text" && editEnabled) {
        event.preventDefault();
        setSelectedTool("text");
      } else if (hKey && mark === "select-tool-screenshot" && editEnabled) {
        event.preventDefault();
        setSelectedTool("screenshot");
      }
    }
  };

  const stopMessagingAnonymouslyMutation =
    trpc.pitchDeck.updateMessagingAnonymously.useMutation({
      onSuccess(conversation) {
        setConversation(conversation);
      },
    });

  const onStopMessagingAnonymously = async () => {
    stopMessagingAnonymouslyMutation.mutate({
      id: pitchDeck?.id!,
      conversationId: conversation?.id,
      messageAnonymously: !messageAnonymously,
    });
  };

  useEffect(() => {
    if (pdfViewer && pagesCount) {
      document.addEventListener("keydown", onKeyDown);

      if (isInvestor()) {
        setSelectedTool("screenshot");
      } else {
        setSelectedTool(null);
      }

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

        <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />

        <div className="h-5 group flex items-center space-x-1 text-xs text-gray-300 hover:text-gray-500 transition-colors relative">
          <img src="/scroobious_logo.png" className="h-full w-auto" />
          {isInvestor() ? (
            <nav className="flex" aria-label="Breadcrumb">
              <ol role="list" className="flex text-xs items-center space-x-1">
                <li>
                  <div>
                    <Link
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches`}
                      className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                    >
                      All Pitches
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <Link
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches/${pitchDeck?.pitch.id}`}
                      className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                    >
                      {pitchDeck?.pitch.organization.startup?.name}
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span className="ml-2 font-medium text-gray-500">
                      Pitch Deck
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          ) : (
            <nav className="flex" aria-label="Breadcrumb">
              <ol role="list" className="flex text-xs items-center space-x-1">
                <li>
                  <div>
                    <Link
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/founder/publish-pitch`}
                      className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                    >
                      Publish Pitch
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <Link
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/messages`}
                      className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                    >
                      Reach Investors
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span className="ml-2 font-medium text-gray-500">
                      Messages
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          )}
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

        {(isInvestor() || isL2Reviewer()) && (
          <>
            <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />

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

            <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />
            
            <button
              disabled={
                stopMessagingAnonymouslyMutation.isLoading ||
                (!messageAnonymously && conversationMessages.length > 0)
              }
              className={`flex items-center text-xs space-x-1.5 enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-2 rounded transition-all group relative`}
              onClick={() => {
                onStopMessagingAnonymously();
              }}
            >
              <>
                {stopMessagingAnonymouslyMutation.isLoading ? (
                  <Spinner className="w-4 h-4" />
                ) : messageAnonymously ? (
                  <GoEyeClosed className="w-4 h-4" />
                ) : (
                  <GoEye className="w-4 h-4" />
                )}
              </>
              {messageAnonymously ? (
                <span>Anonymous messaging is on</span>
              ) : (
                <span>Anonymous messaging is off</span>
              )}

              {messageAnonymously && conversationMessages.length > 0 && (
                <span className="text-xs">
                  <Popover x="align-right" y="bottom">
                    <span className="space-y-1">
                      <span className="opacity-90 block w-64 text-left">
                        You're currently messaging anonymously. <br />
                        <br />
                        Click to share your name with the founder.{" "}
                        <i>
                          (once you do this, you can't go back to anonymous
                          messaging for this pitch deck)
                        </i>
                      </span>
                    </span>
                  </Popover>
                </span>
              )}
            </button>
            {/* )} */}
          </>
        )}

        {isFounder() && (
          <>
            <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />

            <button
              className={`enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative`}
              // onClick={() => setSelectedTool("screenshot")}
            >
              <GoSettings className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
