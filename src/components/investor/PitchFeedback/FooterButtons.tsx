import { useEffect, useRef } from "react";
import { type RouterOutput } from "~/utils/trpc";
import Link from "next/link";
import { env } from "~/env.mjs";
import { Step } from ".";
import Spinner from "~/components/Spinner";

type FooterButtonsProps = {
  pitch: NonNullable<RouterOutput["pitch"]["byId"]>;
  steps: Step[];
  setNextStep: () => void;
  isFeedbackValid: boolean;
  onSubmitFeedback: () => void;
  isSubmitting: boolean;
};

export default function FooterButtons({
  pitch,
  steps,
  setNextStep,
  isFeedbackValid,
  onSubmitFeedback,
  isSubmitting,
}: FooterButtonsProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.blur();
  }, [steps]);
  return (
    <div className="py-4 px-6 border-t border-gray-900/10 absolute bottom-0 w-full flex items-center justify-between gap-x-6 flex-row-reverse bg-gray-50">
      <button
        ref={btnRef}
        onClick={() => {
          if (steps[2]?.status === "current") {
            onSubmitFeedback();
          } else {
            setNextStep();
          }
        }}
        disabled={isSubmitting || (steps[2]?.status === "current" && !isFeedbackValid)}
        className="transition space-x-2 inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium enabled:hover:text-gray-600 focus:text-gray-600 shadow-sm enabled:hover:shadow enabled:hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 text-white"
      >
        {steps[2]?.status === "current" ? "Submit my feedback" : "Next"}
        {isSubmitting && <Spinner className="ml-1 w-5 h-5 fill-current" />}
      </button>
      {steps[2]?.status === "current" ? (
        <span />
      ) : (
        <Link
          className="text-gray-500 text-sm rounded hover:text-gray-900 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2"
          href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches/${pitch?.id}`}
        >
          « Back to pitch
        </Link>
      )}
    </div>
  );
}
