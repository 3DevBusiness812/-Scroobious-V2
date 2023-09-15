import ReactPlayer from "react-player";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { type AppState } from "~/components/PDFApp/state";
import Spinner from "~/components/Spinner";

type TPitchDeckModalsprops = {
  setModalOpen: (open: boolean) => void;
  selectedStep: AppState["computed"]["assignableSections"][number] | null;
};

const VideoModal = ({
  setModalOpen,
  selectedStep,
}: TPitchDeckModalsprops) => {
  return (
    <>
      <div className="flex px-4 py-4 bg-gray-100 items-center rounded-t-md space-x-2 text-gray-700 border-b border-gray-300 shadow-sm">
        <VideoCameraIcon className="w-5 h-5" aria-hidden="true" />
        <h3 className="text-base font-semibold leading-6">
          {selectedStep?.courseStepDefinition?.name}
        </h3>
      </div>

      <div className="px-4 pt-5 pb-4 flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="w-8 h-8" />
        </div>
        <ReactPlayer
          height={360}
          url={(selectedStep?.courseStepDefinition?.config as { url: string })?.url}
          controls
        />
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700  bg-gray-100 border-t border-gray-300">
        <div className="sm:flex sm:flex-row-reverse w-full">
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:shadow active:text-black active:ring-gray-400 sm:mt-0 sm:w-auto"
            onClick={() => setModalOpen(false)}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoModal;
