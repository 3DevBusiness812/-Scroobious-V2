import { Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  isGenerating: boolean;
};

export default function TypingEffectBox({ isGenerating }: Props) {
  return (
    <Transition
      as={Fragment}
      show={isGenerating}
      enter="transform transition duration-300 delay-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 translate-y-0"
      leaveTo="opacity-0 -translate-y-1"
    >
      <div className="relative">
        <div className="animate-bounce px-4 py-2 bg-gray-100 rounded-full inline-block relative">
          <span className="text-4xl inline-flex space-x-0.5">
            <b className="animate-type-dot inline-block">•</b>
            <b className="animate-type-dot inline-block animation-delay-300">
              •
            </b>
            <b className="animate-type-dot inline-block animation-delay-700">
              •
            </b>
          </span>

          <svg
            viewBox="0 0 8 8"
            className="w-8 bottom-0 left-0 absolute fill-gray-100 rotate-90"
          >
            <path d="M8,0 L8,8 L0,8 C4.418278,8 8,4.418278 8,0 L8,0 Z" />
          </svg>
        </div>
      </div>
    </Transition>
  );
}
