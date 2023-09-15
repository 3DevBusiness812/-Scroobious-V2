import { FormEvent, useState } from "react";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";
import { trpc } from "~/utils/trpc";
import { useStore } from "~/components/PDFApp/state";

type TCreateCustomSectionModalProps = {
  setModalOpen: (open: boolean) => void;
  pageNumber: number | null;
};

const CreateCustomSectionModal = ({
  setModalOpen,
  pageNumber,
}: TCreateCustomSectionModalProps) => {
  const pitchDeck = useStore((s) => s.pitchDeck);
  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const numPages = useStore((s) => s.pagesCount);
  const [customSectionName, setCustomSectionName] = useState("");

  const mutation = trpc.pitchDeck.pitchDeckAssignPagesToSection.useMutation({
    onSuccess(pitchDeck) {
      setPitchDeck(pitchDeck);
      setModalOpen(false);
    },
  });

  const onCreateAndAssignSection = async (e: FormEvent) => {
    e.preventDefault();

    if (!customSectionName.trim()) return;

    mutation.mutate({
      numPages,
      id: pitchDeck?.id!,
      items: [
        {
          pageNumber: pageNumber!,
          ...(customSectionName && { customSectionName }),
        },
      ],
    });
  };

  return (
    <form onSubmit={onCreateAndAssignSection}>
      <div className="flex px-4 py-4 bg-gray-100 items-center rounded-t-md space-x-2 text-gray-700 border-b border-gray-300 shadow-sm">
        <SquaresPlusIcon className="w-5 h-5" aria-hidden="true" />
        <h3 className="text-base font-semibold leading-6">
          Add custom section
        </h3>
      </div>

      <div className="px-4 py-8 flex-1 relative text-gray-700 max-w-md w-144 space-y-1">
        <span>Custom Section Name</span>
        <input
          type="text"
          value={customSectionName}
          onChange={(e) => setCustomSectionName(e.currentTarget.value)}
          className="block w-full rounded-sm shadow-sm border border-gray-300 focus:shadow-md focus:border-gray-400 focus:ring-0 text-sm p-2 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
          placeholder="Type your Custom Section Name"
        />
      </div>

      <div className="flex px-4 py-2 items-center rounded-b-md space-x-2 text-gray-700  bg-gray-100 border-t border-gray-300">
        <div className="flex items-center justify-end w-full space-x-2">
          <button
            type="button"
            className="inline-flex justify-center rounded bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:shadow active:text-black active:ring-gray-400 sm:mt-0 sm:w-auto"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>

          <button
            disabled={!customSectionName.trim()}
            type="submit"
            className="inline-flex justify-center rounded border bg-orange-50 border-orange-200 px-3 py-2 text-sm font-medium text-gray-600 enabled:hover:shadow-sm enabled:hover:bg-orange-100 enabled:hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-70"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateCustomSectionModal;
