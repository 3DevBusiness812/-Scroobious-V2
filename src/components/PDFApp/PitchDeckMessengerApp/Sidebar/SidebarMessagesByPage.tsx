import { MutableRefObject, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import MessagesByThread from "./MessagesByThread";
import { scrollAnimateTo } from "../../helpers";
import { useStore, type ConversationMessage } from "../../state";

type TSidebarMessagesByPageProps = {
  messages: ConversationMessage[];
  pageIx: number;
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
};

const SidebarMessagesByPage = ({
  messages,
  pageIx,
  sidebarScrollWrapperRef,
}: TSidebarMessagesByPageProps) => {
  const conversationMessageId = useStore((s) => s.conversationMessageId);
  const currentPageNumber = useStore((s) => s.currentPageNumber);
  const groupMessagesByThread = useStore((s) => s.groupMessagesByThread);
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );

  const messagesByThread = groupMessagesByThread(messages);
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (!conversationMessageId && currentPageNumber === pageIx + 1) {
      scrollAnimateTo({
        parent: sidebarScrollWrapperRef.current,
        child: wrapperRef.current,
        offset: {
          top: 0,
        },
      });
    }
  }, [currentPageNumber, conversationMessageId]);
  return (
    <div id={`sidebar-conversation-page-${pageIx}`} ref={wrapperRef}>
      {messages.length > 0 ? (
        <div className="relative">
          <div className="sticky top-0 z-20 border-b border-gray-200 bg-gray-100 px-6 py-1 text-xs font-medium text-gray-500 uppercase">
            <div className="flex w-full space-x-2">
              <div className="flex-1 truncate">
                {sectionTitlePageBelongsTo(pageIx + 1)}
              </div>
              <div className="text-right text-gray-400">Page {pageIx + 1}</div>
            </div>
          </div>
          {messagesByThread.map((messages) => (
            <MessagesByThread
              key={`${pageIx}-${messages[0]?.id}`}
              messages={messages}
              sidebarScrollWrapperRef={sidebarScrollWrapperRef}
              pageIx={pageIx}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SidebarMessagesByPage;
