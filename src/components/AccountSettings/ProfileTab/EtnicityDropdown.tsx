import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, type MutableRefObject } from "react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

const etnicityItems = [
  { id: "BLACK", description: "African-American/Black" },
  { id: "E_A", description: "East Asian" },
  { id: "SE_A", description: "Southeast Asian" },
  { id: "S_A", description: "South Asian" },
  { id: "PACIFIC", description: "Pacific Islander" },
  { id: "HISP", description: "Hispanic/Latinx" },
  { id: "MIDEAST", description: "Middle Eastern/North African" },
  { id: "NATIVE", description: "Native American/Alaskan Native" },
  { id: "WHITE", description: "White" },
  { id: "OTHER", description: "Other" },
  { id: "NOC", description: "Prefer not to say" },
] as const;

export default function EtnicityDropdown() {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [selected, setSelected] = useState<
    { id: string; description: string }[]
  >([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredItems =
    query === ""
      ? etnicityItems
      : etnicityItems.filter((item) =>
          item.description
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="col-span-12 sm:col-span-6">
      <div className="flex space-x-1">
        <label
          htmlFor="race"
          className="text-sm font-medium text-gray-700"
        >
          Race/Ethnicity
        </label>
      </div>

      <Combobox
        value={selected}
        onChange={(items) => {
          setSelected(items);
          setQuery("");
        }}
        multiple
      >
        {({ open }) => (
          <div className={`relative mt-1 ${open ? "z-10" : ""}`}>
            {!isFocused && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden py-1 px-2">
                <div className="w-full">
                  {selected.map((item) => (
                    <span key={item.id} className="group mr-1">
                      <div className="inline-flex cursor-default relative items-center space-x-1 py-0.5 rounded-sm text-xs capitalize bg-gray-100 group-hover:bg-gray-200 text-gray-700 group-hover:text-gray-900">
                        <span className="flex-1 px-1 pr-0 truncate">
                          {item.description}
                        </span>
                        <button
                          type="button"
                          className="shrink-0 pointer-events-auto text-gray-500 hover:text-gray-900 hover:bg-gray-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelected(
                              selected.filter((i) => i.id !== item.id)
                            );
                          }}
                          tabIndex={-1}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-1 block w-full rounded-sm border border-gray-300  shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm">
              <Combobox.Input
                ref={inputRef}
                placeholder={`${
                  (open || selected.length > 0) 
                    ? ""
                    // : selected.length > 0
                    // ? `${selected.length} ${
                    //     selected.length === 1 ? "item" : "items"
                    //   } selected`
                    : "Start typing or select items..."
                }`}
                autoComplete="off"
                type="text"
                id="race"
                name="race"
                className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-sky-500 ${
                  selected.length > 0
                    ? "placeholder:text-gray-900"
                    : "placeholder:italic placeholder:text-gray-400"
                }`}
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
              <Combobox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                static
              >
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

      {/* <div className="my-1">
        <div className="w-full items-center">
          {selected.map((item) => (
            <span key={item.id} className="group mr-1">
              <div className="inline-flex cursor-default relative items-center space-x-1 py-0.5 rounded-sm text-xs capitalize bg-gray-100 group-hover:bg-gray-200 text-gray-700 group-hover:text-gray-900">
                <span className="flex-1 px-1 pr-0 truncate">
                  {item.description}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(selected.filter((i) => i.id !== item.id));
                    inputRef.current.focus();
                  }}
                  tabIndex={-1}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </span>
          ))}
        </div>
      </div> */}
    </div>
  );
}
