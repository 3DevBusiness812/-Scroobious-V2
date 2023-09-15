import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type TOptionItem = {
  name: string;
  description: string;
  value?: string;
};

type TFilterFeedbackStatusProps = {
  selected: TOptionItem;
  setSelected: (v: TOptionItem) => void;
  filterOptions: TOptionItem[];
};

export const feedbackStatusOptions = [
  {
    name: "All",
    description: "All feedback",
  },
  {
    name: "Requested",
    description: "Requested feedback",
    value: "REQUESTED",
  },
  {
    name: "Assigned",
    description: "Assigned feedback",
    value: "ASSIGNED",
  },
  {
    name: "Awaiting QA",
    description: "Awaiting QA",
    value: "AWAITING_QA",
  },
  {
    name: "Completed",
    description: "Completed feedback",
    value: "COMPLETE",
  },
  {
    name: "Draft",
    description: "Draft",
    value: "DRAFT",
  },
];

export const feedbackStatusCodeNameMap: Record<string, string> = feedbackStatusOptions
  .filter(({ value }) => Boolean(value))
  .reduce<Record<string, string>>((acc, { value, name }) => {
    acc[value!] = name;
    return acc;
  }, {});

const DotStatus = ({ value }: TOptionItem) => {
  const color =
    value === "COMPLETE"
      ? "bg-gray-400 border-gray-400"
      : value === "AWAITING_QA"
      ? "bg-yellow-400 border-yellow-400"
      : value === "ASSIGNED"
      ? "bg-blue-400 border-blue-400"
      : value === "REQUESTED"
      ? "bg-green-400 border-green-400"
      : value === "DRAFT"
      ? "bg-rose-400 border-rose-200"
      : "bg-transparent border-gray-200";
  return (
    <div
      className={`flex-shrink-0 w-2.5 h-2.5 rounded-full border ${color}`}
      aria-hidden="true"
    />
  );
};

export default function FilterFeedbackStatusDropdown({
  selected,
  filterOptions,
  setSelected,
}: TFilterFeedbackStatusProps) {
  return (
    <Listbox
      as="div"
      value={selected}
      onChange={(v) => setSelected(v)}
      className="sm:ml-inline-flex rounded shadow-sm"
    >
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            {" "}
            Filter by feedback status{" "}
          </Listbox.Label>
          <div className="inline-flex rounded-md shadow-sm">
            <span className="relative inline-flex items-center rounded-l border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:z-10 cursor-default w-32">
              {selected.name}
            </span>
            <div className="relative -ml-px block">
              <Listbox.Button
                className="relative inline-flex items-center rounded-r border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              "
              >
                <span className="sr-only">Open options</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Listbox.Options className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {filterOptions.map((option: any) => (
                      <Listbox.Option key={option.name} value={option}>
                        {({ active, selected }) => (
                          <div
                            className={`flex w-full items-center space-x-2 px-4 py-2 text-sm cursor-pointer ${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } ${
                              selected
                                ? active
                                  ? "bg-gray-100 text-gray-900"
                                  : "bg-gray-50 text-gray-800"
                                : ""
                            }`}
                          >
                            <DotStatus {...option} />
                            <span>{option.name}</span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        </>
      )}
    </Listbox>
  );
}
