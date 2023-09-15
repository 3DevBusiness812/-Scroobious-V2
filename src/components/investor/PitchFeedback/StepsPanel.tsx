import { type RouterOutput } from "~/utils/trpc";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import type { ItemRating, Step } from ".";

type StepsPanelProps = {
  steps: Step[];
  pitch: RouterOutput["pitch"]["byId"];
  setFounderImpressionRating: (rating: ItemRating) => void;
  setFounderImpressionComments: (comments: string) => void;
  founderImpressionRating: ItemRating;
  founderImpressionComments: string | null;
  setPitchMaterialsRating: (rating: ItemRating) => void;
  setPitchMaterialsComments: (comments: string) => void;
  setBusinessIdeaRating: (rating: ItemRating) => void;
  setBusinessIdeaComments: (comments: string) => void;
  pitchMaterialsRating: ItemRating;
  pitchMaterialsComments: string | null;
  businessIdeaRating: ItemRating;
  businessIdeaComments: string | null;
  setShareReviewWithFounder: (share: boolean) => void;
  setShareReviewDirectly: (share: boolean) => void;
  shareReviewWithFounder: boolean;
  shareReviewDirectly: boolean;
  isFeedbackValid: boolean;
};

export default function StepsPanel({
  steps,
  pitch,
  setFounderImpressionRating,
  setFounderImpressionComments,
  founderImpressionRating,
  founderImpressionComments,
  setPitchMaterialsRating,
  setPitchMaterialsComments,
  setBusinessIdeaRating,
  setBusinessIdeaComments,
  pitchMaterialsRating,
  pitchMaterialsComments,
  businessIdeaRating,
  businessIdeaComments,
  setShareReviewWithFounder,
  setShareReviewDirectly,
  shareReviewWithFounder,
  shareReviewDirectly,
  isFeedbackValid,
}: StepsPanelProps) {

  return (
    <>
      {steps.map((step, stepIdx) => (
        <div
          key={stepIdx}
          className={`my-10 px-6 pb-12 ${
            step.status === "current" ? "block" : "hidden"
          }`}
        >
          {stepIdx === 0 && step.status === "current" && (
            <Step1
              {...{
                pitch,
                setFounderImpressionRating,
                setFounderImpressionComments,
                founderImpressionRating,
                founderImpressionComments,
              }}
            />
          )}
          {stepIdx === 1 && step.status === "current" && (
            <Step2
              {...{
                setPitchMaterialsRating,
                setPitchMaterialsComments,
                setBusinessIdeaRating,
                setBusinessIdeaComments,
                pitchMaterialsRating,
                pitchMaterialsComments,
                businessIdeaRating,
                businessIdeaComments,
              }}
            />
          )}
          {stepIdx === 2 && step.status === "current" && (
            <Step3
              {...{
                setShareReviewWithFounder,
                setShareReviewDirectly,
                shareReviewWithFounder,
                shareReviewDirectly,

                pitchMaterialsRating,
                pitchMaterialsComments,
                businessIdeaRating,
                businessIdeaComments,

                isFeedbackValid,
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}
