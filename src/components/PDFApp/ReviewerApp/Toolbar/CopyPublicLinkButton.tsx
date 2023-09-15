import { useEffect, useRef, useState, Fragment } from "react";
import { GoLink } from "react-icons/go";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";
import { useCopyToClipboard, useOnClickOutside } from "usehooks-ts";
import { useStore } from "../../state";

const CopyPublicLinkButton = () => {
  const isPDFViewerLoaded = useStore((state) => state.isPDFViewerLoaded);
  const [isOpen, setIsOpen] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const ref = useRef(null);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClose = () => {
    if (timerIdRef.current) clearTimeout(timerIdRef.current);
    setIsOpen(false);
  };

  const onCopy = () => {
    if (timerIdRef.current) clearTimeout(timerIdRef.current);

    copy(window.location.href);
    setIsOpen(true);
    timerIdRef.current = setTimeout(onClose, 3000);
  };

  useOnClickOutside(ref, onClose);
  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, []);

  return (
    <span className="relative" ref={ref}>
      <button
        type="button"
        disabled={!isPDFViewerLoaded}
        onClick={onCopy}
        className="inline-flex items-center rounded bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 active:text-black disabled:text-gray-300 focus:outline-none focus:ring-0 focus:ring-orange-500 focus:ring-offset-0 group relative transition-colors"
      >
        <GoLink className="-ml-0.5 mr-2 w-4 h-4" aria-hidden="true" />
        Copy Link
      </button>

      <div className="flex w-72 absolute right-0 mt-1 z-50 flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={isOpen}
          as={Fragment}
          enter="ease-in-out duration-100 transition origin-top-right"
          enterFrom="-translate-y-2 translate-x-2 opacity-0"
          enterTo="-translate-y-0 translate-x-0 scale-100 opacity-100"
          leave="transition ease-in duration-100 origin-top-right"
          leaveFrom="opacity-100 scale-100 translate-y-0 translate-x-0"
          leaveTo="opacity-0 -translate-y-2 translate-x-2"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-4 py-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    Link successfully copied!
                  </p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-sm bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </span>
  );
};

export default CopyPublicLinkButton;
