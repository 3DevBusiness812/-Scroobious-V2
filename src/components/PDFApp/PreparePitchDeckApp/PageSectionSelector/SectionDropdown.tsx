import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { GoCheck, GoPlus } from "react-icons/go";
import { trpc } from "~/utils/trpc";
import { useStore } from "~/components/PDFApp/state";
import Spinner from "~/components/Spinner";

type TSectionDropdownProps = {
  pageNumber: number;
  onCreateCustomSectionSelect: (pageNumber: number) => void;
};

export default function SectionDropdown({
  pageNumber,
  onCreateCustomSectionSelect,
}: TSectionDropdownProps) {
  const assignableSections = useStore((s) => s.computed.assignableSections);
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );
  const isPageAssignedToSection = useStore((s) => s.isPageAssignedToSection);
  const pitchDeck = useStore((s) => s.pitchDeck);
  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const numPages = useStore((s) => s.pagesCount);

  const mutation = trpc.pitchDeck.pitchDeckAssignPagesToSection.useMutation({
    onSuccess(pitchDeck) {
      setPitchDeck(pitchDeck);
    },
  });

  const onAssignPageToSection = async ({
    courseStepDefinitionId,
    customSectionName,
  }: {
    courseStepDefinitionId?: string | null;
    customSectionName?: string | null;
  }) => {
    mutation.mutate({
      numPages,
      id: pitchDeck?.id!,
      items: [
        {
          pageNumber,
          ...(courseStepDefinitionId && { courseStepDefinitionId }),
          ...(customSectionName && { customSectionName }),
        },
      ],
    });
  };

  return (
    <div className="inline-flex items-center">
      {mutation.isLoading && <Spinner className="w-5 h-5 mx-2" />}
      <div className="inline-flex rounded shadow-sm">
        <Menu as="div" className="relative -ml-px block flex-1">
          <Menu.Button
            disabled={mutation.isLoading}
            className="relative inline-flex items-center max-w-full truncate rounded space-x-1 bg-white px-3 py-2 text-sm font-normal text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:bg-white disabled:opacity-75"
          >
            <span className="sr-only">Open options</span>
            {sectionTitlePageBelongsTo(pageNumber) ? (
              <div className="inline-flex space-x-1 items-center">
                <GoCheck className="text-green-500 w-5 h-5" />
                <span>{sectionTitlePageBelongsTo(pageNumber)}</span>
              </div>
            ) : (
              <span>Assign to Section</span>
            )}
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-50 scale-100 mt-1 divide-y divide-gray-200 -mr-1 w-56 origin-top-right rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {assignableSections
                  .filter(
                    ({ courseStepDefinition }) => courseStepDefinition?.id
                  )
                  .map(({ courseStepDefinition, customSectionName }) => (
                    <Menu.Item
                      key={courseStepDefinition?.id || customSectionName}
                    >
                      <button
                        onClick={() =>
                          onAssignPageToSection({
                            customSectionName,
                            courseStepDefinitionId: courseStepDefinition?.id,
                          })
                        }
                        className="relative flex space-x-2 items-center w-full text-left px-2 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700"
                      >
                        <span className="flex items-center text-green-500 w-4">
                          {isPageAssignedToSection(pageNumber, {
                            courseStepDefinition,
                            customSectionName,
                          }) && (
                            <GoCheck className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <span>
                          {courseStepDefinition?.name || customSectionName}
                        </span>
                      </button>
                    </Menu.Item>
                  ))}
              </div>
              <div className="py-1">
                {assignableSections
                  .filter(({ customSectionName }) => customSectionName)
                  .map(({ courseStepDefinition, customSectionName }) => (
                    <Menu.Item
                      key={courseStepDefinition?.id || customSectionName}
                    >
                      <button
                        onClick={() =>
                          onAssignPageToSection({
                            customSectionName,
                            courseStepDefinitionId: courseStepDefinition?.id,
                          })
                        }
                        className="relative flex space-x-2 items-center w-full text-left px-2 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700"
                      >
                        <span className="flex items-center text-green-500 w-4">
                          {isPageAssignedToSection(pageNumber, {
                            courseStepDefinition,
                            customSectionName,
                          }) && (
                            <GoCheck className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <span>
                          {courseStepDefinition?.name || customSectionName}
                        </span>
                      </button>
                    </Menu.Item>
                  ))}
                <Menu.Item>
                  <button
                    onClick={() => onCreateCustomSectionSelect(pageNumber)}
                    className="flex items-center space-x-2 w-full text-left px-2 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700"
                  >
                    <span className="flex items-center w-4 text-gray-500">
                      <GoPlus className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>Custom Section</span>
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
