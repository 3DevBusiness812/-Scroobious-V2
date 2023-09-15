import { GoVersions } from "react-icons/go";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { GoCheck } from "react-icons/go";
import { useStore, type AppState } from "~/components/PDFApp/state";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";

type TSlidesSelectionModalProps = {
  onSlidesSelectionSelect: (
    s: AppState["computed"]["assignableSections"][number]
  ) => void;
  selectedStep: AppState["computed"]["assignableSections"][number];
};

const SlidesSelectionModal = ({
  onSlidesSelectionSelect,
  selectedStep,
}: TSlidesSelectionModalProps) => {
  const pdfViewer = useStore((s) => s.pdfViewer);
  const isPDFPagesLoaded = useStore((s) => s.isPDFPagesLoaded);
  const pageThumbnails = useStore((s) => s.pageThumbnails);
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );

  const isPageAssignedToSection = useStore((s) => s.isPageAssignedToSection);
  const isPageAssignedToAnySection = useStore(
    (s) => s.isPageAssignedToAnySection
  );
  const isSectionFirst = useStore((s) => s.isSectionFirst);
  const isSectionLast = useStore((s) => s.isSectionLast);
  const previousSection = useStore((s) => s.previousSection);
  const nextSection = useStore((s) => s.nextSection);
  const pitchDeck = useStore((s) => s.pitchDeck);
  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const numPages = useStore((s) => s.pagesCount);

  const assignMutation = trpc.pitchDeck.pitchDeckAssignPagesToSection.useMutation({
    onSuccess(pitchDeck) {
      setPitchDeck(pitchDeck);
    },
  });

  const unassignMutation =
    trpc.pitchDeck.pitchDeckUnassignPagesFromSection.useMutation({
      onSuccess(pitchDeck) {
        setPitchDeck(pitchDeck);
      },
    });

  const onTogglePageSection = async ({
    pageNumber,
    courseStepDefinitionId,
    customSectionName,
  }: {
    pageNumber: number;
    courseStepDefinitionId?: string | null;
    customSectionName?: string | null;
  }) => {
    if (!isPageAssignedToSection(pageNumber, selectedStep)) {
      assignMutation.mutate({
        numPages,
        id: pitchDeck?.id!,
        items: [
          {
            pageNumber,
            ...(courseStepDefinitionId && { courseStepDefinitionId }),
            ...(customSectionName && { customSectionName }),
          },
        ],
      });
    } else {
      unassignMutation.mutate({
        numPages,
        id: pitchDeck?.id!,
        items: [{ pageNumber }],
      });
    }
  };

  const isProcessing = assignMutation.isLoading || unassignMutation.isLoading;
  const processingPages = new Set(
    [
      ...(assignMutation.isLoading
        ? assignMutation.variables?.items ?? []
        : unassignMutation.variables?.items ?? []),
    ].map(({ pageNumber }) => pageNumber)
  );

  return (
    <>
      <div className="flex px-4 py-4 bg-gray-100 items-center rounded-t-md space-x-2 shadow-sm text-gray-700 border-b border-gray-300">
        <GoVersions className="w-5 h-5" aria-hidden="true" />
        <h3 className="text-base font-normal leading-6">
          Assign slides to{" "}
          <span className="font-semibold">
            {selectedStep?.courseStepDefinition?.name ??
              selectedStep?.customSectionName}
          </span>{" "}
          Section
        </h3>
      </div>

      <div className="px-4 pt-5 pb-4 flex-1 relative overflow-auto">
        <div className="max-h-full h-full">
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
            {isPDFPagesLoaded &&
              pdfViewer?.getPagesOverview().map((_, ix) => (
                <div key={ix}>
                  <div
                    className={`p-2 relative ${
                      isPageAssignedToAnySection(ix + 1) &&
                      !isPageAssignedToSection(ix + 1, selectedStep)
                        ? ""
                        : isPageAssignedToSection(ix + 1, selectedStep)
                        ? "bg-green-100"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <button
                      disabled={
                        isProcessing ||
                        (isPageAssignedToAnySection(ix + 1) &&
                          !isPageAssignedToSection(ix + 1, selectedStep))
                      }
                      onClick={() =>
                        onTogglePageSection({
                          pageNumber: ix + 1,
                          courseStepDefinitionId:
                            selectedStep.courseStepDefinition?.id,
                          customSectionName: selectedStep.customSectionName,
                        })
                      }
                      className={`w-64 block text-left relative max-w-full min-h-[30px] border border-gray-300 shadow bg-white ${
                        isPageAssignedToAnySection(ix + 1) &&
                        !isPageAssignedToSection(ix + 1, selectedStep)
                          ? ""
                          : "cursor-pointer"
                      }`}
                    >
                      <img className="w-full" src={pageThumbnails.get(ix)} />
                      {isPageAssignedToAnySection(ix + 1) &&
                        !isPageAssignedToSection(ix + 1, selectedStep) && (
                          <div
                            className={`absolute inset-0 max-w-full p-1 w-full bg-white/50 backdrop-blur-sm hover:backdrop-blur-none hover:bg-transparent transition-all`}
                          >
                            <div className="rounded-sm inline-block text-xs text-gray-700 max-w-full truncate bg-gray-50 border border-gray-400 shadow-sm px-1.5 py-0.5">
                              {sectionTitlePageBelongsTo(ix + 1)}
                            </div>
                          </div>
                        )}

                      {(!isPageAssignedToAnySection(ix + 1) ||
                        isPageAssignedToSection(ix + 1, selectedStep)) && (
                        <div className="absolute top-1 right-1 cursor-pointer">
                          {isProcessing && processingPages.has(ix + 1) ? (
                            <div
                              className={`flex items-center justify-end p-px border rounded-full text-gray-400 bg-white border-gray-400`}
                            >
                              <Spinner className="h-4 w-4" />
                            </div>
                          ) : (
                            <div
                              className={`flex items-center justify-end p-px border ring-1 rounded-full ${
                                isPageAssignedToSection(ix + 1, selectedStep)
                                  ? "text-white bg-green-400 border-green-400 ring-green-400"
                                  : "text-gray-400 bg-white border-white ring-gray-400"
                              }`}
                            >
                              <GoCheck className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      )}
                    </button>

                    {/* <div className="absolute bottom-4 left-4 text-gray-500 cursor-default text-xs w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded-full">
                      {ix + 1}
                    </div> */}
                  </div>
                  <div className="text-center w-full py-1.5 text-sm text-gray-500">
                    {ix + 1}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700  bg-gray-100 border-t border-gray-300">
        <div className="sm:flex items-center justify-between w-full">
          <button
            disabled={isSectionFirst(selectedStep)}
            type="button"
            className="inline-flex items-center w-full justify-center rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 active:shadow active:text-black active:ring-gray-400 sm:mt-0 sm:w-auto disabled:opacity-70 disabled:text-gray-500"
            onClick={() =>
              onSlidesSelectionSelect(previousSection(selectedStep))
            }
          >
            <ChevronLeftIcon className="w-4 mr-1" />
            Previous
          </button>

          <button
            disabled={isSectionLast(selectedStep)}
            type="button"
            className="inline-flex items-center w-full justify-center rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 active:shadow active:text-black active:ring-gray-400 sm:mt-0 sm:w-auto disabled:opacity-70 disabled:text-gray-500"
            onClick={() => onSlidesSelectionSelect(nextSection(selectedStep))}
          >
            Next
            <ChevronRightIcon className="w-4 ml-1" />
          </button>
        </div>
      </div>
    </>
  );
};

export default SlidesSelectionModal;
