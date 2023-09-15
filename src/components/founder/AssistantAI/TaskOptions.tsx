import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { Message } from ".";

type Props = {
  isWorking: boolean;
  messages: Message[];
  onInitGenerateDescription: () => void;
};

export default function TaskOptions({
  isWorking,
  messages,
  onInitGenerateDescription,
}: Props) {
  return (
    <>
      <Transition
        as={Fragment}
        show={!isWorking && messages.length < 1}
        enter="transform transition duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transform duration-200 transition ease-in-out delay-200"
        leaveFrom="opacity-100 rotate-0 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs leading-6">
            <span className="bg-white px-2 text-gray-400">Get started</span>
          </div>
        </div>
      </Transition>

      <div className="text-sm font-medium space-y-2 text-gray-700">
        <Transition
          as={Fragment}
          show={!isWorking && messages.length < 1}
          enter="transform transition duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-200 transition ease-in-out delay-150"
          leaveFrom="opacity-100 rotate-0 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <button
            onClick={onInitGenerateDescription}
            className="px-6 py-2.5 flex items-center justify-between rounded-md bg-white border border-gray-200 w-full enabled:hover:bg-gray-50 enabled:hover:text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <span className="text-left">
              Improve my startup's short description for the investors
            </span>
            <span>→</span>
          </button>
        </Transition>

        <Transition
          as={Fragment}
          show={!isWorking && messages.length < 1}
          enter="transform transition duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-200 transition ease-in-out delay-75"
          leaveFrom="opacity-100 rotate-0 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <button
            disabled={true}
            className="px-6 py-2.5 flex items-center justify-between rounded-md bg-white border border-gray-200 w-full enabled:hover:bg-gray-50 enabled:hover:text-gray-900 disabled:bg-white disabled:text-gray-400 disabled:font-normal"
          >
            <span className="flex items-baseline space-x-1">
              <span className="text-left">
                Analyze and improve my Pitch Deck
              </span>
              <span className="text-xs font-light">
                <sup>coming soon</sup>
              </span>
            </span>
            <span>→</span>
          </button>
        </Transition>

        <Transition
          as={Fragment}
          show={!isWorking && messages.length < 1}
          enter="transform transition duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <button
            disabled={true}
            className="px-6 py-2.5 flex items-center justify-between rounded-md bg-white border border-gray-200 w-full enabled:hover:bg-gray-50 enabled:hover:text-gray-900 disabled:bg-white disabled:text-gray-400 disabled:font-normal"
          >
            <span className="flex items-baseline space-x-1">
              <span className="text-left">
                Analyze and improve my 1 min pitch video
              </span>
              <span className="text-xs font-light">
                <sup>coming soon</sup>
              </span>
            </span>
            <span>→</span>
          </button>
        </Transition>
      </div>
    </>
  );
}
