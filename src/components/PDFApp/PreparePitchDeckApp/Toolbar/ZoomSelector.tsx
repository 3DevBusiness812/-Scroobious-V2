import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { GoDash, GoPlus } from "react-icons/go";
import { useStore } from "~/components/PDFApp/state";
import Popover from "~/components/Popover";

const presets = new Map([
  ["auto", "Auto"],
  ["page-actual", "Actual Size"],
  ["page-fit", "Page Fit"],
  ["page-width", "Page Width"],
]);

const zoomVals = new Map([
  [0.5, "50%"],
  [0.75, "75%"],
  [1, "100%"],
  [1.25, "125%"],
  [1.5, "150%"],
  [2, "200%"],
]);

const ZoomSelector = () => {
  const isPDFViewerLoaded = useStore((state) => state.isPDFViewerLoaded);
  const currentScale = useStore((state) => state.currentScale);
  const setCurrentScale = useStore((state) => state.setCurrentScale);
  const currentScaleValue = useStore((state) => state.currentScaleValue);
  const setCurrentScaleValue = useStore((state) => state.setCurrentScaleValue);
  const pdfViewer = useStore((state) => state.pdfViewer);
  const minScale = useStore((state) => state.minScale);
  const maxScale = useStore((state) => state.maxScale);

  return (
    <>
      <button
        disabled={!isPDFViewerLoaded || currentScale <= minScale}
        className="enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative"
        onClick={() => pdfViewer?.decreaseScale()}
      >
        <GoDash className="h-4 w-4" />
        <span className="text-xs">
          <Popover x="center" y="bottom">
            <span className="space-y-1">
              <span className="opacity-90 text-center block whitespace-nowrap">
                Zoom Out
              </span>
              <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                  ⌘
                </span>
                <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                  —
                </span>
              </span>
            </span>
          </Popover>
        </span>
      </button>

      <Menu
        as="div"
        className="text-xs w-32 relative py-1 bg-gray-200/75 rounded hover:bg-gray-200  ui-open:bg-gray-200"
      >
        <Menu.Button disabled={!isPDFViewerLoaded} className="text-left w-full">
          <span className="sr-only">Open zoom options</span>
          <div className="flex px-1">
            <span
              className={`flex-1 px-1 ${
                isPDFViewerLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              {pdfViewer?.currentScaleValue &&
              presets.has(pdfViewer.currentScaleValue)
                ? presets.get(pdfViewer.currentScaleValue)
                : `${~~(currentScale * 100)}%`}
            </span>

            <span className="">
              <ChevronUpDownIcon className="w-4 h-4" />
            </span>
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 left-0 z-30 mt-2 w-full origin-top-right divide-y divide-gray-200 rounded text-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {Array.from(presets.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active, close }) => (
                    <button
                      onClick={() => {
                        pdfViewer!.currentScaleValue = value;
                        setCurrentScaleValue(value);
                      }}
                      className={`block w-full text-left px-2 py-1.5 text-xs ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            <div className="py-1">
              {Array.from(zoomVals.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        pdfViewer!.currentScale = value;
                      }}
                      className={`block w-full text-left px-2 py-1.5 text-xs ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={!isPDFViewerLoaded || currentScale >= maxScale}
        className="enabled:hover:bg-gray-200 enabled:hover:text-black text-gray-500 disabled:text-gray-300 py-1 px-1 rounded transition-all group relative"
        onClick={() => pdfViewer?.increaseScale()}
      >
        <GoPlus className="h-4 w-4" />
        <span className="text-xs">
          <Popover x="center" y="bottom">
            <span className="space-y-1">
              <span className="opacity-90 text-center block whitespace-nowrap">
                Zoom In
              </span>
              <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                  ⌘
                </span>
                <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                  +
                </span>
              </span>
            </span>
          </Popover>
        </span>
      </button>
    </>
  );
};

export default ZoomSelector;
