import { GoCheck } from "react-icons/go";
import { env } from "~/env.mjs";

const FeedbackRequestedInfoModal = () => {
  return (
    <>
      <div className="flex px-4 py-4 bg-gray-100 items-center rounded-t-md space-x-2 text-gray-700 border-b border-gray-300 shadow-sm">
        <GoCheck className="text-green-500 w-5 h-5" aria-hidden="true" />
        <h3 className="text-base font-semibold leading-6">
          Written Feedback Coming Up
        </h3>
      </div>

      <div className="px-4 py-8 flex-1 relative text-gray-700 max-w-md space-y-4">
        <p>
          Your request has been sent to our professional team of Reviewers. Once
          they complete the review, you will receive an email notification that
          your feedback is ready.
        </p>
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700  bg-gray-100 border-t border-gray-300">
        <div className="sm:flex sm:flex-row-reverse w-full">
          <a
            href={`${env.NEXT_PUBLIC_V1_BASE_URL}/founder/pitches`}
            target="_top"
            className="inline-flex w-full justify-center rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:shadow active:text-black active:ring-gray-400 sm:mt-0 sm:w-auto"
          >
            Got it!
          </a>
        </div>
      </div>
    </>
  );
};

export default FeedbackRequestedInfoModal;
