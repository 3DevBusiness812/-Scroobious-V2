import { useRouter } from "next/router";
import { CheckIcon } from "@heroicons/react/24/outline";
import { trpc } from "~/utils/trpc";
import { useStore } from "../../state";
import Spinner from "~/components/PDFApp/Spinner";
import AnnotationDate from "./AnnotationDate";

const CompleteReview = () => {
  const setPitchWrittenFeedback = useStore((s) => s.setPitchWrittenFeedback);
  const pitchWrittenFeedback = useStore((s) => s.pitchWrittenFeedback);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const annotations = useStore((s) => s.annotations);

  const router = useRouter();
  const utils = trpc.useContext();

  const mutation = trpc.pitchWrittenFeedback.completeFeedback.useMutation({
    onSuccess(feedback) {
      setPitchWrittenFeedback(feedback);
      setAnnotation(null);

      utils.pitchWrittenFeedback.byId.invalidate({
        id: pitchWrittenFeedback?.id!,
      });

      setTimeout(() => router.push("/admin/written-feedback"), 250);
    },
  });

  const [lastUpdatedAt] = [
    ...annotations.map((a) => [
      a.commentVersion.createdAt,
      a.commentVersion.updatedAt,
    ]),
    pitchWrittenFeedback?.updatedAt,
  ]
    .filter((a) => !!a)
    .flatMap((a) => a)
    .sort((a, b) => (a!.getTime() > b!.getTime() ? -1 : 1));

  const onComplete = async () => {
    mutation.mutate({
      id: pitchWrittenFeedback?.id!,
    });
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center py-2 border-t border-gray-300">
      <div className="px-4 w-full relative">
        {pitchWrittenFeedback?.status === "COMPLETE" ? (
          <div className="text-sm text-gray-500 px-2 py-2 flex items-center">
            <CheckIcon className="w-4 mr-2 shrink-0" />
            <div>
              Review has been completed.{" "}
              {lastUpdatedAt && (
                <span className="">
                  Updated{" "}
                  <AnnotationDate
                    className="text-sm text-gray-500"
                    createdAt={lastUpdatedAt}
                  />
                </span>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={mutation.isLoading}
            className="flex w-full mx-auto items-center max-w-md justify-center rounded-sm border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-gray-600 shadow enabled:hover:bg-orange-100 enabled:hover:border-orange-300 enabled:hover:text-gray-700 disabled:opacity-70"
          >
            {mutation.isLoading && <Spinner className="w-5 h-5 mx-2" />}
            Complete Review
          </button>
        )}
      </div>
    </div>
  );
};

export default CompleteReview;
