import { RouterOutput } from "~/utils/trpc";
import { StarIcon } from "@heroicons/react/24/solid";
import type { ItemRating } from ".";

type Props = {
  pitch: RouterOutput["pitch"]["byId"];
  setFounderImpressionRating: (rating: ItemRating) => void;
  setFounderImpressionComments: (comments: string) => void;
  founderImpressionRating: ItemRating;
  founderImpressionComments: string | null;
};

const Step1 = ({
  pitch,
  setFounderImpressionRating,
  setFounderImpressionComments,
  founderImpressionRating,
  founderImpressionComments,
}: Props) => {
  return (
    <ul className="w-full space-y-12">
      <li className="flex items-center">
        <div
          className="inline-block h-20 w-20 flex-shrink-0 overflow-hidden rounded-full shadow ring-1 ring-gray-200"
          aria-hidden="true"
        >
          {pitch?.user?.profilePicture?.url ? (
            <img
              className="w-full h-full object-cover rounded-full"
              src={pitch.user?.profilePicture?.url}
              alt={pitch.user?.name}
            />
          ) : (
            <svg
              className="text-gray-200 rounded-full w-full h-full dark:text-gray-700"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-4 text-lg font-medium leading-6 text-gray-900">
          <div>{pitch?.user?.name}</div>
          <div className="text-sm font-normal text-gray-600">{pitch?.organization.startup?.name}</div>
        </div>
      </li>

      <li className="flex items-center space-x-4">
        <label className="block text-lg font-medium leading-6 text-gray-900">
          Rate founder impression
        </label>
        <div
          className="flex items-center flex-row-reverse justify-end text-gray-200 rounded outline-none focus-within:ring-1 focus-within:ring-sky-500"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) {
              setFounderImpressionRating(parseInt(target.value) as ItemRating);
            }
          }}
        >
          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="founderimpressionstar5"
            name="founder-impression-star-input"
            value="5"
            defaultChecked={founderImpressionRating === 5}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="founderimpressionstar5"
            title="5 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="founderimpressionstar4"
            name="founder-impression-star-input"
            value="4"
            defaultChecked={founderImpressionRating === 4}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="founderimpressionstar4"
            title="4 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="founderimpressionstar3"
            name="founder-impression-star-input"
            value="3"
            defaultChecked={founderImpressionRating === 3}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="founderimpressionstar3"
            title="3 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="founderimpressionstar2"
            name="founder-impression-star-input"
            value="2"
            defaultChecked={founderImpressionRating === 2}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="founderimpressionstar2"
            title="2 stars"
          >
            <StarIcon className="w-8 h-8" />
          </label>

          <input
            className="fixed opacity-0 pointer-events-none peer"
            type="radio"
            id="founderimpressionstar1"
            name="founder-impression-star-input"
            value="1"
            defaultChecked={founderImpressionRating === 1}
          />
          <label
            className="cursor-pointer peer-hover:text-green-800 peer-checked:text-green-600 transition duration-150"
            htmlFor="founderimpressionstar1"
            title="1 star"
          >
            <StarIcon className="w-8 h-8" />
          </label>
        </div>
      </li>

      <li>
        <div className="col-span-full max-w-4xl">
          <label
            htmlFor="describefounder"
            className="block text-md font-medium leading-6 text-gray-900"
          >
            What words or phrases would you use to describe this founder?
          </label>
          <div className="mt-2">
            <textarea
              id="describefounder"
              name="describefounder"
              rows={3}
              className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm sm:leading-6"
              onChange={(e) => {
                setFounderImpressionComments(e.target.value);
              }}
              value={founderImpressionComments ?? ""}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Note: The founder will not see the information above. This
            information is only used to improve recommendations for you and
            other investors.
          </p>
        </div>
      </li>
    </ul>
  );
};

export default Step1;
