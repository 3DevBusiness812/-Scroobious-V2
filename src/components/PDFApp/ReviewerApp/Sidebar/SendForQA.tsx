import { trpc } from "~/utils/trpc";
import { PaperAirplaneIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useStore } from "../../state";
import Spinner from "~/components/PDFApp/Spinner";

const SendForQA = () => {
  const setPitchWrittenFeedback = useStore((s) => s.setPitchWrittenFeedback);
  const pitchWrittenFeedback = useStore((s) => s.pitchWrittenFeedback);
  const isAssigned = useStore((s) => s.isAssigned);
  const isAwaitingQA = useStore((s) => s.isAwaitingQA);
  const isCompleted = useStore((s) => s.isCompleted);
  const setAnnotation = useStore((s) => s.setAnnotation);

  const router = useRouter();
  const utils = trpc.useContext();

  const mutation = trpc.pitchWrittenFeedback.sendFeedbackForQA.useMutation({
    onSuccess(feedback) {
      setPitchWrittenFeedback(feedback);
      setAnnotation(null);

      utils.pitchWrittenFeedback.byId.invalidate({
        id: pitchWrittenFeedback?.id!,
      });

      setTimeout(() => router.push("/admin/written-feedback"), 250);
    },
  });

  const onSendForQA = async () => {
    mutation.mutate({
      id: pitchWrittenFeedback?.id!,
    });
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center py-2 border-t border-gray-300">
      <div className="px-4 w-full">
        {isAssigned() && (
          <button
            onClick={onSendForQA}
            disabled={
              pitchWrittenFeedback?.status !== "ASSIGNED" || mutation.isLoading
            }
            className="flex w-full mx-auto items-center max-w-md justify-center rounded-sm border bg-orange-100 border-orange-300 px-4 py-2 text-sm font-medium text-gray-600 shadow enabled:hover:bg-orange-50 enabled:hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-70"
          >
            {mutation.isLoading && <Spinner className="w-5 h-5 mx-2" />}
            Send for QA
          </button>
        )}

        {isAwaitingQA() && (
          <div className="text-sm text-gray-500 px-2 py-2 flex items-center">
            <PaperAirplaneIcon className="w-4 mr-2" /> The Review has been
            submitted and is awaiting QA
          </div>
        )}
        {isCompleted() && (
          <div className="text-sm text-gray-500 px-2 py-2 flex items-center">
            <CheckIcon className="w-4 mr-2" /> Review has been completed
          </div>
        )}
      </div>
    </div>
  );
};

export default SendForQA;
