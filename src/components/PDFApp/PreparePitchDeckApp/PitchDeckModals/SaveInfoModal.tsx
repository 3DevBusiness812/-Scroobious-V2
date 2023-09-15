import { env } from "~/env.mjs";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useStore } from "~/components/PDFApp/state";
type TSaveInfoModalProps = {
  setModalOpen: (open: boolean) => void;
};

const SaveInfoModal = ({ setModalOpen }: TSaveInfoModalProps) => {
  const allSectionsAssigned = useStore((s) => s.allSectionsAssigned);
  return (
    <>
      <div className="flex px-4 py-4 bg-gray-100 items-center rounded-t-md space-x-2 text-gray-700 border-b border-gray-300 shadow-sm">
        <CheckCircleIcon className="w-6 h-6" aria-hidden="true" />
        <h3 className="text-base font-semibold leading-6">
          {!allSectionsAssigned() ? "Your work has been saved" : "Great job!"}
        </h3>
      </div>

      <div className="px-4 py-8 flex-1 relative text-gray-700 max-w-md">
        {!allSectionsAssigned()
          ? "You can continue categorizing your pitch deck slides, or come back later and continue from here."
          : "You have finished categorizing your slides.   You can now request written feedback, or skip that step and move directly to uploading your 1 minute video."}
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700">
        <div className="sm:flex sm:flex-row-reverse w-full" />
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700  bg-gray-100 border-t border-gray-300">
        <div className="flex w-full items-center justify-end space-x-2">
          {!allSectionsAssigned() ? (
            <>
              <a
                href={`${env.NEXT_PUBLIC_V1_BASE_URL}/founder/pitches/categorize-slides`}
                target="_top"
                className="mt-3 inline-flex w-full justify-center border border-gray-300 rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-0 ring-inset ring-gray-300 hover:bg-gray-50 active:shadow active:text-black active:border-gray-400 sm:mt-0 sm:w-auto"
              >
                Upload new Deck
              </a>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded border bg-orange-50 border-orange-200 px-4 py-2 text-sm font-medium text-gray-900 hover:shadow-sm hover:bg-orange-100 hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 hover:text-black"
                onClick={() => setModalOpen(false)}
              >
                Continue categorizing
              </button>
            </>
          ) : (
            <a
              href={`${env.NEXT_PUBLIC_V1_BASE_URL}/founder/pitches/pitch-deck-feedback`}
              target="_top"
              className="inline-flex items-center justify-center rounded border bg-orange-50 border-orange-200 px-4 py-2 text-sm font-medium text-gray-900 hover:shadow-sm hover:bg-orange-100 hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 hover:text-black"
            >
              Got it
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default SaveInfoModal;
