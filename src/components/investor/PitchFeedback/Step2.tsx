import { RouterOutput } from "~/utils/trpc";
import { FaceSmileIcon, StarIcon } from "@heroicons/react/24/solid";
import { ItemRating } from ".";

type Props = {
  setPitchMaterialsRating: (rating: ItemRating) => void;
  setPitchMaterialsComments: (comments: string) => void;
  setBusinessIdeaRating: (rating: ItemRating) => void;
  setBusinessIdeaComments: (comments: string) => void;

  pitchMaterialsRating: ItemRating;
  pitchMaterialsComments: string | null;
  businessIdeaRating: ItemRating;
  businessIdeaComments: string | null;
};

const Step2 = ({
  setPitchMaterialsRating,
  setPitchMaterialsComments,
  setBusinessIdeaRating,
  setBusinessIdeaComments,

  pitchMaterialsRating,
  pitchMaterialsComments,
  businessIdeaRating,
  businessIdeaComments,
}: Props) => {
  return (
    <ul className="w-full space-y-12">
      <li className="flex items-center space-x-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Rate pitch material
        </label>
        <div
          className="flex items-center flex-row-reverse justify-end text-gray-200 rounded outline-none focus-within:ring-1 focus-within:ring-sky-500"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) {
              setPitchMaterialsRating(parseInt(target.value) as ItemRating);
            }
          }}
        >
          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="pitchmaterialstar5"
            name="pitch-material-star-input"
            value="5"
            defaultChecked={pitchMaterialsRating === 5}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="pitchmaterialstar5"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="pitchmaterialstar4"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="pitchmaterialstar3"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="pitchmaterialstar2"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="pitchmaterialstar1"
            title="1 star"
          >
            <StarIcon className="w-8 h-8" />
          </label>
        </div>
      </li>

      <li>
        <div className="col-span-full max-w-4xl">
          <label
            htmlFor="describepitchmaterials"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Please describe your impression of the pitch materials
          </label>
          <div className="mt-2">
            <textarea
              id="describepitchmaterials"
              name="describepitchmaterials"
              rows={3}
              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm sm:leading-6"
              onChange={(e) => {
                setPitchMaterialsComments(e.target.value);
              }}
              value={pitchMaterialsComments ?? ""}
            />
          </div>
        </div>
      </li>

      <li className="flex items-center space-x-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Rate business idea
        </label>
        <div
          className="flex items-center flex-row-reverse justify-end text-gray-200 rounded outline-none focus-within:ring-1 focus-within:ring-sky-500"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) {
              setBusinessIdeaRating(parseInt(target.value) as ItemRating);
            }
          }}
        >
          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="businessideastar5"
            name="business-idea-star-input"
            value="5"
            defaultChecked={businessIdeaRating === 5}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="businessideastar5"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="businessideastar4"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="businessideastar3"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="businessideastar2"
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
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="businessideastar1"
            title="1 star"
          >
            <StarIcon className="w-8 h-8" />
          </label>
        </div>
      </li>

      <li>
        <div className="col-span-full max-w-4xl">
          <label
            htmlFor="describebusinessidea"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            Please describe your impression of the business idea
          </label>
          <div className="mt-2">
            <textarea
              id="describebusinessidea"
              name="describebusinessidea"
              rows={3}
              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm sm:leading-6"
              onChange={(e) => {
                setBusinessIdeaComments(e.target.value);
              }}
              value={businessIdeaComments ?? ""}
            />
          </div>
        </div>
      </li>
    </ul>
  );
};

export default Step2;
