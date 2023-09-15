import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, type MutableRefObject } from "react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

const pronounsItems = [
  { id: "SHE", description: "She/her/hers" },
  { id: "HE", description: "He/him/his" },
  { id: "THEY", description: "They/them/theirs" },
  { id: "OTHER", description: "Other" },
];

export default function PreferredPronounsDropdown() {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [selected, setSelected] = useState<{
    id: string;
    description: string;
  }>();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredItems =
    query === ""
      ? pronounsItems
      : pronounsItems.filter((item) =>
          item.description
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="col-span-12 sm:col-span-6">
      <div className="flex space-x-1">
        <label
          htmlFor="preferred-pronouns"
          className="text-sm font-medium text-gray-700"
        >
          Preferred pronouns
        </label>
      </div>

      <Combobox
        value={selected}
        onChange={(item) => {
          setSelected(item);
          setQuery("");
        }}
      >
        {({ open }) => (
          <div className={`relative mt-1 ${open ? "z-10" : ""}`}>
            <div className="mt-1 block w-full rounded-sm border border-gray-300  shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm">
              <Combobox.Input
                ref={inputRef}
                autoComplete="off"
                type="text"
                id="preferred-pronouns"
                name="preferred-pronouns"
                displayValue={(item: any) => item?.description}
                className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-sky-500`}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredItems.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Combobox.Option
                      key={item.id}
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 ui-active:bg-orange-400 text-white ui-not-active:text-gray-900"
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {item.description}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-orange-400"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
}
