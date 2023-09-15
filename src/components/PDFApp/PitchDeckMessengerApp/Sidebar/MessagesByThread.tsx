import { MutableRefObject } from "react";
import {
  GoTrashcan,
  GoPencil,
  GoReply,
  GoUnfold,
  GoFold,
  GoX,
  GoComment,
} from "react-icons/go";
import { useStore, type ConversationMessage } from "../../state";
import SidebarMessage from "./SidebarMessage";
import Spinner from "../../Spinner";
import { trpc } from "~/utils/trpc";

type SidebarMessagesByThreadProps = {
  messages: ConversationMessage[];
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  pageIx: number;
};

const SidebarMessagesByThread = ({
  sidebarScrollWrapperRef,
  pageIx,
  messages,
}: SidebarMessagesByThreadProps) => {
  const conversationMessageId = useStore((s) => s.conversationMessageId);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);
  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const pitchDeck = useStore((s) => s.pitchDeck);

  const [rootMsg] = messages;
  const rootThreadMessageId = rootMsg?.rootThreadMessageId ?? rootMsg?.id!;

  const mutation = trpc.pitchDeck.addMessage.useMutation({
    onSuccess({ pitchDeck, conversationMessage }) {
      setPitchDeck(pitchDeck);
      setConversationMessageId(conversationMessage.id);
    },
  });

  const onAddReply = async () => {
    mutation.mutate({
      id: pitchDeck?.id!,
      conversationId: rootMsg?.conversation.id,
      body: "",
      details: rootMsg?.contextDetails,
      rootThreadMessageId,
    });
  };

  return (
    <div
      className={`transition-colors cursor-pointer border-b border-gray-200 ${
        conversationMessageId &&
        messages.map(({ id }) => id).includes(conversationMessageId)
          ? // ? "bg-gray-100/50 hover:bg-gray-100/50"
            // : ""
            "bg-orange-50 hover:bg-orange-50 scale-100"
          : "bg-gray-50"
      }`}
    >
      {messages.map((msg) => (
        <SidebarMessage
          message={msg}
          key={`${msg.id}.${pageIx}`}
          sidebarScrollWrapperRef={sidebarScrollWrapperRef}
          pageIx={pageIx}
        />
      ))}
      <div className="px-4 py-3 sm:px-6">
        <div className="space-x-1 flex items-center justify-end">
          <button
            type="button"
            disabled={mutation.isLoading}
            onClick={onAddReply}
            className={`cursor-pointer flex items-center p-2 rounded text-gray-500 text-xs space-x-1 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
          >
            {mutation.isLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <GoReply className="h-4 w-4" />
            )}
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMessagesByThread;
