import { useState, useEffect } from "react";
import { trpc, type RouterOutput } from "~/utils/trpc";

import Toolbar from "./Toolbar";
import StepsNav from "./StepsNav";
import StepsPanel from "./StepsPanel";
import FooterButtons from "./FooterButtons";
import ModalSuccessStatus from "./ModalSuccessStatus";
import ErrorMessage from "./ErorrMessage";

export type ItemRating = 1 | 2 | 3 | 4 | 5 | null;
export type Step = {
  id: string;
  name: string;
  status: "current" | "complete" | "upcoming";
};

type InvestorPitchFeedbackProps = {
  pitch: RouterOutput["pitch"]["byId"];
  pitchFeedback: RouterOutput["pitch"]["getInvestorPitchFeedback"];
};

export default function InvestorPitchFeedback({ pitch, pitchFeedback }: InvestorPitchFeedbackProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "1",
      name: "Founder Impression",
      status: "current",
    },
    {
      id: "2",
      name: "Rate Pitch: " + pitch?.organization.startup?.name,
      status: "upcoming",
    },
    {
      id: "3",
      name: "Help founders learn by sharing feedback",
      status: "upcoming",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const utils = trpc.useContext();

  const [isFeedbackValid, setIsFeedbackValid] = useState(false);
  const [founderImpressionRating, setFounderImpressionRating] = useState<ItemRating>(pitchFeedback?.founderImpressionRating as ItemRating);
  const [pitchMaterialsRating, setPitchMaterialsRating] = useState<ItemRating>(pitchFeedback?.pitchMaterialsRating as ItemRating);
  const [businessIdeaRating, setBusinessIdeaRating] = useState<ItemRating>(pitchFeedback?.businessIdeaRating as ItemRating);
  const [founderImpressionComments, setFounderImpressionComments] = useState<string | null>(pitchFeedback?.founderImpressionComments ?? null);
  const [pitchMaterialsComments, setPitchMaterialsComments] = useState<string | null>(pitchFeedback?.pitchMaterialsComments ?? null);
  const [businessIdeaComments, setBusinessIdeaComments] = useState<string | null>(pitchFeedback?.businessIdeaComments ?? null);
  const [shareReviewWithFounder, setShareReviewWithFounder] = useState(pitchFeedback?.shareReviewWithFounder ?? true);
  const [shareReviewDirectly, setShareReviewDirectly] = useState(pitchFeedback?.shareReviewDirectly ?? false);

  const onSubmitFeedback = async () => {
    setIsSubmitting(true);

    await utils.client.pitch.submitInvestorPitchFeedback.mutate({
      id: pitch!.id,
      data: {
        founderImpressionRating,
        founderImpressionComments,
        pitchMaterialsRating,
        pitchMaterialsComments,
        businessIdeaRating,
        businessIdeaComments,
        shareReviewWithFounder,
        shareReviewDirectly,
      },
    });

    setIsSubmitting(false);
    setFeedbackSubmitted(true);
  };

  const setActiveStep = (stepId: string) => {
    setSteps((steps) =>
      steps.map((step) => {
        if (step.id === stepId) {
          step.status = "current";
        } else if (step.id < stepId || step.status !== "upcoming") {
          step.status = "complete";
        } else {
          step.status = "upcoming";
        }
        return step;
      })
    );
  };

  const setNextStep = () => {
    const currentStep = steps.find((step) => step.status === "current");
    if (currentStep) {
      const nextStep = steps.find((step) => parseInt(step.id) === parseInt(currentStep.id) + 1);
      if (nextStep) {
        setActiveStep(nextStep.id);
      }
    }
  };

  useEffect(() => {
    setIsFeedbackValid(
      [
        founderImpressionRating !== null,
        pitchMaterialsRating !== null,
        businessIdeaRating !== null,
        pitchMaterialsComments && pitchMaterialsComments?.length > 0,
        businessIdeaComments && businessIdeaComments?.length > 0,
        founderImpressionComments && founderImpressionComments?.length > 0,
      ].some(Boolean)
    );
  }, [
    founderImpressionRating,
    pitchMaterialsRating,
    businessIdeaRating,
    pitchMaterialsComments,
    businessIdeaComments,
    founderImpressionComments,
  ]);

  if (!pitch) return <ErrorMessage />;

  return (
    <>
      <div className="w-full min-h-[calc(100dvh-0px)] flex flex-col bg-gray-100">
        <Toolbar pitch={pitch} />

        <div className="w-full min-h-full flex-1 flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 z-0 m-auto">
          <div className="py-4 sm:py-6 lg:py-8 w-full">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Investor Pitch Feedback</h1>
              </div>
            </div>
          </div>

          <div className="w-full relative flex-1 pb-12 bg-white rounded-sm shadow-sm border border-gray-300">
            <StepsNav {...{ steps, setActiveStep }} />

            <StepsPanel
              {...{
                steps,
                pitch,
                setShareReviewWithFounder,
                setShareReviewDirectly,
                shareReviewWithFounder,
                shareReviewDirectly,
                pitchMaterialsRating,
                pitchMaterialsComments,
                businessIdeaRating,
                businessIdeaComments,
                isFeedbackValid,
                setPitchMaterialsRating,
                setPitchMaterialsComments,
                setBusinessIdeaRating,
                setBusinessIdeaComments,
                setFounderImpressionRating,
                setFounderImpressionComments,
                founderImpressionRating,
                founderImpressionComments,
              }}
            />

            <FooterButtons
              {...{
                steps,
                isFeedbackValid,
                pitch,
                setNextStep,
                onSubmitFeedback,
                isSubmitting,
              }}
            />
          </div>
        </div>
      </div>
      <ModalSuccessStatus isOpen={feedbackSubmitted} closeModal={() => {}} pitch={pitch} />
    </>
  );
}
