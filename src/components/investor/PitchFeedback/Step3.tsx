import { RouterOutput } from "~/utils/trpc";
import { FaceSmileIcon, StarIcon } from "@heroicons/react/24/solid";
import { ItemRating } from ".";
import { Switch } from "@headlessui/react";

type Props = {
  setShareReviewWithFounder: (share: boolean) => void;
  setShareReviewDirectly: (share: boolean) => void;
  shareReviewWithFounder: boolean;
  shareReviewDirectly: boolean;

  pitchMaterialsRating: ItemRating;
  pitchMaterialsComments: string | null;
  businessIdeaRating: ItemRating;
  businessIdeaComments: string | null;

  isFeedbackValid: boolean;
};

const Step3 = ({
  setShareReviewWithFounder,
  setShareReviewDirectly,
  shareReviewWithFounder,
  shareReviewDirectly,

  pitchMaterialsRating,
  pitchMaterialsComments,
  businessIdeaRating,
  businessIdeaComments,

  isFeedbackValid,
}: Props) => {
  return (
    <ul className="w-full space-y-12">
      <li className="flex items-center space-x-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Rate pitch material
        </label>
        <div className="flex items-center flex-row-reverse justify-end text-gray-200">
          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar5"
            name="pitch-material-star-input"
            value="5"
            defaultChecked={pitchMaterialsRating === 5}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="5 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar4"
            name="pitch-material-star-input"
            value="4"
            defaultChecked={pitchMaterialsRating === 4}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="4 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar3"
            name="pitch-material-star-input"
            value="3"
            defaultChecked={pitchMaterialsRating === 3}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="3 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar2"
            name="pitch-material-star-input"
            value="2"
            defaultChecked={pitchMaterialsRating === 2}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="2 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar1"
            name="pitch-material-star-input"
            value="1"
            defaultChecked={pitchMaterialsRating === 1}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="1 star"
          >
            <StarIcon className="w-8 h-8" />
          </label>
        </div>
      </li>

      {pitchMaterialsComments && (
        <li>
          <div className="col-span-full">
            <blockquote className="p-4 my-4 border-l-4 border-gray-300 bg-gray-50">
              <p className="text-md italic leading-relaxed text-gray-90">
                "{pitchMaterialsComments}"
              </p>
            </blockquote>
          </div>
        </li>
      )}

      <li className="flex items-center space-x-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Rate business idea
        </label>
        <div className="flex items-center flex-row-reverse justify-end text-gray-200">
          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar5"
            name="business-idea-star-input"
            value="5"
            defaultChecked={businessIdeaRating === 5}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="5 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar4"
            name="business-idea-star-input"
            value="4"
            defaultChecked={businessIdeaRating === 4}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="4 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar3"
            name="business-idea-star-input"
            value="3"
            defaultChecked={businessIdeaRating === 3}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="3 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar2"
            name="business-idea-star-input"
            value="2"
            defaultChecked={businessIdeaRating === 2}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="2 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar1"
            name="business-idea-star-input"
            value="1"
            defaultChecked={businessIdeaRating === 1}
          />
          <label
            className="cursor-default peer-checked:text-green-600"
            title="1 star"
          >
            <StarIcon className="w-8 h-8" />
          </label>
        </div>
      </li>

      {businessIdeaComments && (
        <li>
          <div className="col-span-full">
            <blockquote className="p-4 my-4 border-l-4 border-gray-300 bg-gray-50">
              <p className="text-md italic leading-relaxed text-gray-90">
                "{businessIdeaComments}"
              </p>
            </blockquote>
          </div>
        </li>
      )}

      <li className="space-y-6 pt-8">
        <div className="font-medium text-lg">
          <label className="inline-flex items-center space-x-4 cursor-pointer">
            <Switch
              checked={shareReviewWithFounder}
              disabled={!isFeedbackValid}
              onChange={setShareReviewWithFounder}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ornge-600 focus:ring-offset-2 disabled:opacity-50 ${
                shareReviewWithFounder ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`"pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  shareReviewWithFounder ? "translate-x-6" : "translate-x-0"
                }`}
              >
                <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                    shareReviewWithFounder
                      ? "opacity-0 duration-100 ease-out"
                      : "opacity-100 duration-200 ease-in"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                    shareReviewWithFounder
                      ? "opacity-100 duration-200 ease-in"
                      : "opacity-0 duration-100 ease-out"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
            <div className="flex space-x-2">
              <span>Share with founder</span>
              <span className="font-normal text-md">
                (only info shown above)
              </span>
            </div>
          </label>
        </div>

        <div className="font-medium text-lg">
          <label className="inline-flex items-center space-x-4 cursor-pointer">
            <Switch
              checked={shareReviewDirectly}
              disabled={!isFeedbackValid}
              onChange={setShareReviewDirectly}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ornge-600 focus:ring-offset-2 disabled:opacity-50 ${
                shareReviewDirectly ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`"pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  shareReviewDirectly ? "translate-x-6" : "translate-x-0"
                }`}
              >
                <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                    shareReviewDirectly
                      ? "opacity-0 duration-100 ease-out"
                      : "opacity-100 duration-200 ease-in"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                    shareReviewDirectly
                      ? "opacity-100 duration-200 ease-in"
                      : "opacity-0 duration-100 ease-out"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
            <div className="flex space-x-2">
              <span>Share my name</span>
            </div>
          </label>
        </div>
      </li>
    </ul>
  );
};

export default Step3;
