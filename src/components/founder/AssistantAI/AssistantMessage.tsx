import { Transition } from "@headlessui/react";
import { GoPlus } from "react-icons/go";
import type { Message } from ".";

const AssistantMessage = ({
  msg,
  isWorking,
  setMessage,
  description,
}: {
  msg: Message;
  description: string;
  isWorking: boolean;
  setMessage: (msg: Message) => void;
}) => {
  return (
    <Transition show={true} appear={true}>
      <Transition.Child
        enter="transform transition-all ease-in-out duration-500"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out delay-150"
        leaveFrom="opacity-100 rotate-0 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="p-4 pb-2 bg-gray-50 hover:bg-gray-100 group text-base text-gray-700 rounded-3xl rounded-bl-none relative whitespace-pre-wrap shadow-sm border transition-all">
          {msg.text}
          <div className="space-x-2 pt-2 w-full text-gray-700 relative text-sm flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {msg.text.length} characters
            </span>
            <button
              disabled={isWorking}
              onClick={() => setMessage(msg)}
              className="inline-flex items-center p-2 px-4 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full space-x-1 disabled:text-gray-400 transition-all"
            >
              <GoPlus className="w-4" />
              <span>Use for short description</span>
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default AssistantMessage;
