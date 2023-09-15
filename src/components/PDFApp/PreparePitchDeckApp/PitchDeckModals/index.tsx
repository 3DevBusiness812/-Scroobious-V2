import { XMarkIcon } from "@heroicons/react/24/outline";
import { type AppState } from "~/components/PDFApp/state";
import PitchDeckModalWrapper from "./Wrapper";
import SaveInfoModal from "./SaveInfoModal";
import VideoModal from "./VideoModal";
import SlidesSelectionModal from "./SlidesSelectionModal";
import CreateCustomSectionModal from "./CreateCustomSection";

type TPitchDeckModalsprops = {
  showSaveInfo: boolean;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onSlidesSelectionSelect: (
    s: AppState["computed"]["assignableSections"][number]
  ) => void;
  selectedStep: AppState["computed"]["assignableSections"][number] | null;
  videoOrSlidesSelection: "video" | "slides" | null;
  showCustomSectionForm: boolean;
  customSectionCreatePageNumber: number | null;
};

const PitchDeckModals = ({
  isModalOpen,
  showSaveInfo,
  setModalOpen,
  onSlidesSelectionSelect,
  selectedStep,
  videoOrSlidesSelection,
  showCustomSectionForm,
  customSectionCreatePageNumber: pageNumber,
}: TPitchDeckModalsprops) => {
  return (
    <PitchDeckModalWrapper open={isModalOpen} setOpen={setModalOpen}>
      <div className="flex flex-col h-full justify-center">
        <div className="relative transform mx-auto max-w-full max-h-full rounded-md bg-white text-left shadow-lg border border-gray-300 transition-all">
          <div className="flex flex-col w-full h-full max-h-full">
            {selectedStep && videoOrSlidesSelection === "video" && (
              <VideoModal {...{ setModalOpen, selectedStep }} />
            )}

            {selectedStep && videoOrSlidesSelection === "slides" && (
              <SlidesSelectionModal
                {...{
                  onSlidesSelectionSelect,
                  selectedStep,
                }}
              />
            )}
            {showSaveInfo && <SaveInfoModal {...{ setModalOpen }} />}

            {showCustomSectionForm && (
              <CreateCustomSectionModal {...{ pageNumber, setModalOpen }} />
            )}
          </div>

          <div className="absolute top-0 right-0 hidden sm:block h-6 items-center px-4 py-4">
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-0 focus:ring-orange-500"
              onClick={() => setModalOpen(false)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </PitchDeckModalWrapper>
  );
};

export default PitchDeckModals;
