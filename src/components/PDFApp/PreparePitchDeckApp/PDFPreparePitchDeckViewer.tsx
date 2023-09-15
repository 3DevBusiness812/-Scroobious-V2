import { useStore, type AppState } from "../state";
import PDFViewerBase from "../PDFViewerBase";
import Toolbar from "./Toolbar";
import PitchDeckSidebar from "./PitchDeckSidebar";
import PageSectionSelector from "./PageSectionSelector";
import { useState } from "react";
import PitchDeckModals from "./PitchDeckModals";

type TPDFPreparePitchDeckViewerProps = {
  fileUrl: string;
  me: AppState["me"];
  pitchWrittenFeedback: AppState["pitchWrittenFeedback"];
  pitchDeck: AppState["pitchDeck"];
  pitchDeckCreationSections: AppState["pitchDeckCreationSections"];
};

function PDFPreparePitchDeckViewer({
  fileUrl,
  me,
  pitchWrittenFeedback,
  pitchDeck,
  pitchDeckCreationSections,
}: TPDFPreparePitchDeckViewerProps) {
  const pdfViewer = useStore((s) => s.pdfViewer);
  const isPDFViewerLoaded = useStore((s) => s.isPDFViewerLoaded);
  const assignableSections = useStore((s) => s.computed.assignableSections);

  const [isModalOpen, setIsModalOpen] = useState(false); // useState(pitchWrittenFeedback?.status !== "DRAFT");
  const [showSaveInfo, setShowSaveInfo] =
    useState(false);
  const [showFeedbackRequestedInfo, setShowFeedbackRequestedInfo] = useState(false);
  const [showCustomSectionForm, setShowCustomSectionForm] = useState(false);
  const [customSectionCreatePageNumber, setCustomSectionCreatePageNumber] = useState<number | null>(null)

  const setModalOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setShowSaveInfo(false);
      setShowCustomSectionForm(false);
    }
    setIsModalOpen(isOpen);
  };

  const [selectedStep, setSelectedStep] = useState<
    typeof assignableSections[number] | null
  >(null);
  const [videoOrSlidesSelection, setVideoOrSlidesSelection] = useState<
    "video" | "slides" | null
  >(null);

  const onVideoSelect = (step: typeof assignableSections[number]) => {
    setSelectedStep(step);
    setVideoOrSlidesSelection("video");
    setModalOpen(true);
  };

  const onSlidesSelectionSelect = (step: typeof assignableSections[number]) => {
    setSelectedStep(step);
    setVideoOrSlidesSelection("slides");
    setModalOpen(true);
  };

  const onCreateCustomSectionSelect = (pageNumber: number) => {
    setShowSaveInfo(false);
    setSelectedStep(null);
    setCustomSectionCreatePageNumber(pageNumber);
    setShowCustomSectionForm(true);
    setModalOpen(true);
  }

  return (
    <>
      <div
        className="flex flex-1 flex-col bg-gray-100 relative"
        id="pdf-reviewer-app"
      >
        <Toolbar />

        <div className="h-full w-full flex flex-1 relative">
          <div className="h-full w-full flex flex-1 flex-col relative">
            <div className="flex-1 relative w-full">
              <PDFViewerBase
                {...{
                  fileUrl,
                  me,
                  pitchWrittenFeedback,
                  pitchDeck,
                  pitchDeckCreationSections,
                  minScale: 0.25,
                  maxScale: 5,
                }}
              >
                {isPDFViewerLoaded && pdfViewer && <PageSectionSelector {...{ onCreateCustomSectionSelect }} />}
              </PDFViewerBase>
            </div>
          </div>

          {isPDFViewerLoaded && (
            <PitchDeckSidebar
              {...{
                setModalOpen,
                setShowSaveInfo,
                setSelectedStep,
                onVideoSelect,
                onSlidesSelectionSelect,
              }}
            />
          )}
        </div>
      </div>

      <PitchDeckModals
        {...{
          isModalOpen,
          showCustomSectionForm,
          customSectionCreatePageNumber,
          showSaveInfo,
          setModalOpen,
          onSlidesSelectionSelect,
          selectedStep,
          videoOrSlidesSelection,
        }}
      />
    </>
  );
}

export default PDFPreparePitchDeckViewer;
