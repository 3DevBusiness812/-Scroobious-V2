import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useStore, type ConversationMessage } from "../../../state";
import { scrollAnimateTo } from "~/components/PDFApp/helpers";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/PDFApp/Spinner";
import DateFormatter from "../DateFormatter";
import { GoReply, GoEyeClosed } from "react-icons/go";
import Popover from "~/components/Popover";

type SidebarMessageProps = {
  message: ConversationMessage;
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  pageIx: number;
};

const SidebarMessage = ({
  message,
  sidebarScrollWrapperRef,
  pageIx,
}: SidebarMessageProps) => {
  const me = useStore((s) => s.me);
  const conversationMessageId = useStore((s) => s.conversationMessageId);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);
  const setPitchDeck = useStore((s) => s.setPitchDeck);

  const [body, setBody] = useState(message.body);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetTimerId, setResetTimerId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;
  const msgBodyRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const isMine = me?.id === message.createdById;

  // get participants by id
  const participants = new Map(
    message.conversation.conversationParticipants.map((p) => [p.user.id, p])
  );
  const isAnonymous = participants.get(message.createdById)?.messageAnonymously;

  const amIAnonymous = useStore(
    (s) =>
      s.conversation?.conversationParticipants.find(
        (p) => p.userId === message.createdById
      )?.messageAnonymously
  );

  const resetValue = async (message: ConversationMessage, body: string) => {
    const resetTimerId = setTimeout(async () => {
      if (me?.id !== message.createdById) {
        return;
      }

      if (message && !message.body && !body.trim()) {
        const pitchDeck = await utils.client.pitchDeck.deleteMessage.mutate({
          id: message.id,
        });
        setPitchDeck(pitchDeck);
        setConversationMessageId(null);
      } else {
        setBody(message.body);
      }
    }, 100);

    setResetTimerId(resetTimerId);
  };

  const clearTimerId = () => {
    if (resetTimerId) clearTimeout(resetTimerId);
    setResetTimerId(null);
  };

  const utils = trpc.useContext();

  const onUpdate = async () => {
    setIsProcessing(true);

    const { pitchDeck: updatedPitchDeck, conversationMessage } =
      await utils.client.pitchDeck.updateMessage.mutate({
        id: message.id,
        details: message.contextDetails,
        body,
      });

    setPitchDeck(updatedPitchDeck);
    setConversationMessageId(null);

    setIsProcessing(false);
  };

  useEffect(() => {
    if (conversationMessageId && conversationMessageId === message.id) {
      clearTimerId();
      if (isMine) msgBodyRef.current.focus();

      scrollAnimateTo({
        parent: sidebarScrollWrapperRef.current,
        child: wrapperRef.current,
        offset: {
          top: 25,
        },
      });
    } else {
      resetValue(message, body);
    }
  }, [conversationMessageId]);

  return (
    <div
      ref={wrapperRef}
      onClick={(e) => {
        e.preventDefault();
        setConversationMessageId(message.id);
      }}
      className={`px-4 py-6 pb-4 group sm:px-6 transition-colors cursor-pointer border-b border-transparent ${
        conversationMessageId !== message.id
          ? "hover:border-gray-200 hover:[box-shadow:0_-1px_0px_0_rgb(0_0_0/0.07)] hover:bg-gray-100"
          : ""
      }`}
    >
      <div className="text-sm flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {message.rootThreadMessageId && (
            <div className="my-2">
              <GoReply className="w-4 h-4 text-gray-400 rotate-180" />
            </div>
          )}

          {isAnonymous && !isMine ? (
            <>
              <div className="w-10 h-10">
                <svg
                  className="text-gray-200 rounded-full w-full h-full"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="font-medium text-gray-900 flex-1">
                Posted Anonymously
                <span className="block">
                  <DateFormatter dt={message.updatedAt ?? message.createdAt} />
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={message.user.profilePicture.url}
                  alt=""
                />
              </div>
              <div className="font-medium text-gray-900 flex-1">
                <div className="flex items-center space-x-2">
                  <span>{message.user.name}</span>
                </div>

                {isMine && amIAnonymous && (
                  <div className="flex items-center space-x-1 text-gray-400 group-hover:text-gray-600 text-xs py-0.5">
                    <GoEyeClosed />
                    <span className="">sent anonymously</span>
                  </div>
                )}
                <span className="block">
                  <DateFormatter dt={message.updatedAt ?? message.createdAt} />
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {(me?.id !== message.createdById ||
        message?.id !== conversationMessageId) && (
        <div className="mt-1 text-sm text-gray-700">
          <div className={`${message.rootThreadMessageId ? "px-6" : ""}`}>
            <div className="py-4 relative">
              <div className=" whitespace-pre-wrap">{body}</div>
            </div>
          </div>
        </div>
      )}

      {me?.id === message.createdById && (
        <div
          className={`w-full ${
            message?.id === conversationMessageId
              ? "visible space-y-4 py-4"
              : "invisible h-0 overflow-hidden"
          }`}
        >
          {
            <div className="w-full">
              <textarea
                ref={msgBodyRef}
                id={`conversation-message-${message.id}`}
                name={`conversation-message-${message.id}`}
                rows={3}
                placeholder="Add message..."
                className="block w-full min-h-[30px] rounded-sm shadow-sm border border-gray-300 focus:shadow-md focus:border-gray-400 focus:ring-0 text-sm p-2 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onClick={(e) => {
                  setConversationMessageId(message.id);
                  e.stopPropagation();
                }}
              />
            </div>
          }
          <div className="flex w-full justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConversationMessageId(null);
              }}
              className="flex items-center justify-center shadow rounded-sm border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700 enabled:hover:bg-white focus:shadow-md focus:border-gray-400 focus:ring-0 focus:outline-0 disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={!body.trim()}
              className="flex items-center justify-center rounded-sm border bg-orange-100 border-orange-300 px-4 py-2 text-sm font-medium text-gray-600 shadow enabled:hover:bg-orange-50 enabled:hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-70"
            >
              {isProcessing && <Spinner className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMessage;
