import { useRef, MutableRefObject } from "react";
import { useSet, useScroll } from "react-use";
import { GoUnfold, GoFold, GoVersions } from "react-icons/go";
import { PlayIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useStore, type AppState } from "~/components/PDFApp/state";
import Popover from "~/components/Popover";
import PitchDeckSidebarWrapper from "./Wrapper";

type TPitchDeckSidebarProps = {
  setModalOpen: (isOpen: boolean) => void;
  setShowSaveInfo: (s: boolean) => void;
  setSelectedStep: (
    step: AppState["pitchDeckCreationSections"][number] | null
  ) => void;
  onVideoSelect: (step: AppState["pitchDeckCreationSections"][number]) => void;
  onSlidesSelectionSelect: (
    step: AppState["pitchDeckCreationSections"][number]
  ) => void;
};

const PitchDeckSidebar = ({
  setModalOpen,
  setSelectedStep,
  setShowSaveInfo,
  onVideoSelect,
  onSlidesSelectionSelect,
}: TPitchDeckSidebarProps) => {
  const isPreparePitchDeckSidebarOpen = useStore(
    (s) => s.isPreparePitchDeckSidebarOpen
  );

  const assignableSections = useStore((s) => s.computed.assignableSections);
  const summaryStep = useStore((s) => s.computed.pitchDeckSummaryStep);
  const marketSizeCalculatorStep = useStore(
    (s) => s.computed.pitchDeckMarketSizeCalculatorStep
  );
  const isSectionEmpty = useStore((s) => s.isSectionEmpty);

  const onSaveInfo =  () => {
      setShowSaveInfo(true);
      setModalOpen(true);
      setSelectedStep(null);
  };

  const [_, { has, toggle }] = useSet(new Set<string>());

  const isSectionOpen = ({
    courseStepDefinition,
    customSectionName,
  }: AppState["pitchDeckCreationSections"][number]) =>
    has((courseStepDefinition?.id ?? customSectionName)!);

  const toggleSectionOpen = ({
    courseStepDefinition,
    customSectionName,
  }: AppState["pitchDeckCreationSections"][number]) =>
    toggle((courseStepDefinition?.id ?? customSectionName)!);

  const sidebarScrollWrapperRef = useRef(
    null
  ) as MutableRefObject<HTMLDivElement | null>;
  const { y: yScroll } = useScroll(sidebarScrollWrapperRef);

  return (
    <>
      <PitchDeckSidebarWrapper>
        <div className="flex-1 relative w-full">
          <div
            ref={sidebarScrollWrapperRef}
            className={`h-full max-h-full w-full absolute overflow-auto ${
              isPreparePitchDeckSidebarOpen ? "visible" : "invisible"
            }`}
          >
            <div
              className={`w-full transition-all duration-200 divide-y divide-gray-300 ${
                isPreparePitchDeckSidebarOpen
                  ? "visible opacity-100 delay-150"
                  : "invisible opacity-0 duration-100"
              }`}
            >
              <div className="w-full flex items-center justify-center">
                <div className="w-full text-gray-600 relative">
                  <h3 className="px-4 py-4 sm:px-6 shadow-sm bg-gray-100 z-20 font-semibold leading-6 border-b border-gray-300 top-0 sticky">
                    Pitch Deck Creation
                  </h3>

                  <div className="bg-gray-50 px-4 py-6 sm:px-6 space-y-4">
                    <div className="sm:flex sm:justify-start">
                      <button
                        type="button"
                        onClick={() => onVideoSelect(summaryStep!)}
                        className="inline-flex items-center rounded bg-orange-50 border border-orange-200 space-x-1 px-1.5 py-1 text-sm text-gray-500 active:text-black enabled:hover:bg-orange-100 enabled:hover:border-orange-300 focus:shadow-sm focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-7 transition-colors"
                      >
                        <PlayIcon className="w-4 h-4" aria-hidden="true" />
                        <span>Watch Summary Details</span>
                      </button>
                    </div>

                    {/* <div className="text-sm text-gray-500">
                      {marketSizeCalculatorStep?.description}
                    </div>

                    <div className="sm:flex sm:justify-start">
                      <a
                        download={true}
                        href={
                          (
                            marketSizeCalculatorStep?.config as {
                              url: string;
                            }
                          ).url
                        }
                        className="inline-flex items-center rounded bg-orange-50 border border-orange-200 space-x-1 px-1.5 py-1 text-sm text-gray-500 active:text-black hover:bg-orange-100 hover:border-orange-300 focus:shadow-sm focus:border-orange-400 focus:ring-0 focus:outline-0 hover:text-gray-700 disabled:opacity-7 transition-colors"
                      >
                        <ArrowDownTrayIcon
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span>Market size calculator</span>
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>

              <div>
                <div
                  className={`border-b ${
                    yScroll > 0 ? "border-transparent" : "border-gray-300"
                  }`}
                >
                  <div role="list" className="divide-y divide-gray-300">
                    {assignableSections.map((step, ix) => (
                      <div
                        key={
                          step.courseStepDefinition?.id ||
                          step.customSectionName
                        }
                        className="relative bg-gray-50"
                      >
                        <div
                          className={`sticky flex top-0 z-20 border-b bg-gray-100 shadow-sm px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-default ${
                            step.courseStepDefinition?.id && isSectionOpen(step)
                              ? "border-gray-300"
                              : "border-transparent"
                          }`}
                        >
                          <h3
                            className="flex flex-1 items-center space-x-2 overflow-hidden uppercase"
                            onClick={() => toggleSectionOpen(step)}
                          >
                            <div
                              className={`flex items-center justify-center w-4 h-4 p-0.5 border rounded-full ${
                                !isSectionEmpty(step)
                                  ? "text-white bg-green-400 border-green-400"
                                  : "border-current"
                              }`}
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </div>
                            <span
                              className={`truncate ${
                                step.courseStepDefinition?.id
                                  ? "cursor-pointer"
                                  : ""
                              }`}
                            >
                              {step.courseStepDefinition?.name ??
                                step.customSectionName}
                            </span>
                          </h3>

                          <div className="flex items-center space-x-0.5">
                            {step.courseStepDefinition?.id && (
                              <div className="group relative">
                                <button
                                  onClick={() => toggleSectionOpen(step)}
                                  className="inline-block relative p-1 border border-transparent rounded hover:bg-gray-200 group-hover:text-gray-700"
                                >
                                  {isSectionOpen(step) ? (
                                    <GoFold className="w-4 h-4" />
                                  ) : (
                                    <GoUnfold className="w-4 h-4" />
                                  )}
                                </button>
                                <span className="text-xs z-50">
                                  <Popover x="center" y="top">
                                    <span className="space-y-1">
                                      <span className="opacity-90 text-center block whitespace-nowrap">
                                        {isSectionOpen(step)
                                          ? "Collapse"
                                          : "Expand"}
                                      </span>
                                    </span>
                                  </Popover>
                                </span>
                              </div>
                            )}
                            <div className="group relative">
                              <button
                                type="button"
                                onClick={() => onSlidesSelectionSelect(step)}
                                className="inline-block relative p-1 border border-transparent rounded hover:bg-gray-200 group-hover:text-gray-700"
                              >
                                <GoVersions
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </button>
                              <span className="text-xs z-50 isolate">
                                <Popover x="align-right" y="top">
                                  <span className="space-y-1">
                                    <span className="opacity-90 text-center block whitespace-nowrap">
                                      Assign slides to{" "}
                                      {step.courseStepDefinition?.name ??
                                        step.customSectionName}
                                    </span>
                                  </span>
                                </Popover>
                              </span>
                            </div>
                          </div>
                        </div>

                        {step.courseStepDefinition?.id && (
                          <div
                            className={`overflow-auto ${
                              isSectionOpen(step) ? "h-auto" : "h-0"
                            }`}
                          >
                            <div className="px-4 py-4 sm:px-6 w-full">
                              <div className="sm:flex sm:justify-between">
                                <button
                                  type="button"
                                  onClick={() => onVideoSelect(step)}
                                  className="inline-flex items-center rounded bg-transparent space-x-1 px-1.5 py-1 text-sm text-gray-500 hover:bg-gray-200 active:text-black disabled:text-gray-300 focus:outline-none focus:ring-0 focus:ring-orange-500 focus:ring-offset-0 group relative transition-colors"
                                >
                                  <PlayIcon
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                  <span>Watch</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-100 flex items-center justify-center py-2 border-t border-gray-300">
          <div className="px-4 w-full">
            <button
              onClick={onSaveInfo}
              className="flex w-full mx-auto items-center max-w-md justify-center rounded-sm border bg-orange-50 border-orange-200 px-4 py-2 text-sm font-medium text-gray-600 enabled:hover:shadow-sm enabled:hover:bg-orange-100 enabled:hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-70"
            >
              Continue
            </button>
          </div>
        </div>
      </PitchDeckSidebarWrapper>
    </>
  );
};

export default PitchDeckSidebar;
