import { useState, useRef, MutableRefObject, useEffect } from "react";
import { useClickAway } from "react-use";
import interact from "interactjs";
import { useStore } from "../../state";
import SidebarMessagesByPage from "./SidebarMessagesByPage";
import { GoScreenFull, GoQuestion } from "react-icons/go";
import InvestorExplainerModal from "../InvestorExplainerModal";

const Sidebar = () => {
  const [showInvestorExplainer, setShowInvestorExplainer] = useState(false);
  const isInvestor = useStore((s) => s.isInvestor);
  const messagesByPage = useStore((s) => s.computed.messagesByPage);

  const conversationMessages = useStore((s) => s.computed.conversationMessages);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);

  const setSelectedTool = useStore((s) => s.setSelectedTool);
  const selectedTool = useStore((s) => s.selectedTool);

  const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
  const sidebarScrollWrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
  const messageUnselectorRef = useRef(null);
  const bodyRef = useRef(document.body) as MutableRefObject<HTMLBodyElement>;
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  useClickAway(messageUnselectorRef, () => {
    setConversationMessageId(null);
  });

  useEffect(() => {
    interact(sidebarRef.current)
      .resizable({
        edges: { left: true, right: false, bottom: false, top: false },
        inertia: {
          resistance: 30,
          minSpeed: 200,
          endSpeed: 100,
        },
        listeners: {
          move(event) {
            setWidth(event.rect.width);
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 300, height: 1 },
            max: { width: 800, height: 1 },
          }),
        ],
      })
      .on("resizestart", () => {
        setIsResizing(true);
        bodyRef.current.style.userSelect = "none";
        bodyRef.current.style.touchAction = "none";
      })
      .on("resizeend", () => {
        setIsResizing(false);
        bodyRef.current.style.userSelect = "";
        bodyRef.current.style.touchAction = "";
      });
  }, []);

  useEffect(() => {
    const isSet = localStorage.getItem("dontShowInvestorExplainer");

    setShowInvestorExplainer(isSet ? false : conversationMessages.length < 1);
  }, []);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`h-full border-l border-l-gray-300 relative flex flex-col duration-200 bg-gray-100 visible w-96 ${
          isResizing ? "transition-none" : "transition-all"
        }`}
        style={{
          width: `${width}px`,
        }}
      >
        <div className="flex-1 relative w-full">
          <div
            ref={sidebarScrollWrapperRef}
            className={`h-full max-h-full w-full absolute overflow-auto visible`}
          >
            <div
              ref={messageUnselectorRef}
              className={`divide-y divide-gray-200 w-full transition-all duration-200 visible opacity-100 delay-150`}
            >
              <div>
                {conversationMessages.length < 1 && (
                  <div className="text-gray-500 text-sm px-4 py-6 space-y-4">
                    <h2 className="font-medium text-base">
                      No messages for this pitch deck yet
                    </h2>
                    {isInvestor() ? (
                      <>
                        <p>
                          Start by selecting text or highlighting an area on any
                          page of the pitch deck, and then adding your message.
                        </p>
                        <div className="flex space-x-2 justify-center py-4">
                          <button
                            className={`flex items-center space-x-1 enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-2 rounded transition-all group relative ${
                              selectedTool === "text"
                                ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
                                : ""
                            }`}
                            onClick={() => setSelectedTool("text")}
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="w-4 h-4"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z"
                              />
                            </svg>
                            <span className="text-xs opacity-70">
                              Highlight Text
                            </span>
                          </button>

                          <button
                            className={`flex items-center space-x-1 enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-2 rounded transition-all group relative ${
                              selectedTool === "screenshot"
                                ? "bg-gray-300 enabled:hover:bg-gray-300 text-black"
                                : ""
                            }`}
                            onClick={() => setSelectedTool("screenshot")}
                          >
                            <GoScreenFull className="w-4 h-4" />
                            <span className="text-xs opacity-70">
                              Highlight Area
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center justify-center text-xs">
                          <button
                            onClick={() => setShowInvestorExplainer(true)}
                            className="flex items-center space-x-1 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-2 transition-all"
                          >
                            <GoQuestion className="w-4 h-4" />
                            <span className="">Learn more</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>
                        We'll let you know once an investor starts a
                        conversation on your pitch deck.
                      </p>
                    )}
                  </div>
                )}
                {messagesByPage.map(([pageIx, messages]) => (
                  <SidebarMessagesByPage
                    key={pageIx}
                    pageIx={pageIx}
                    messages={messages}
                    sidebarScrollWrapperRef={sidebarScrollWrapperRef}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute z-20 top-1/2 -left-px text-black/0 group-hover:text-black/20 transition-all duration-200"
        >
          <path
            d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {isInvestor() && (
        <InvestorExplainerModal
          open={showInvestorExplainer}
          setOpen={setShowInvestorExplainer}
        />
      )}
    </>
  );
};

export default Sidebar;
