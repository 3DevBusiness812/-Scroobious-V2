import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";

type TSortableHeadButtonProps = {
  title: string;
  disabled: boolean;
  orderDir: -1 | 1;
  onSort: () => void;
  activeOrderCol?: boolean;
};

const SortableTableHeadButton = ({
  title,
  disabled,
  orderDir,
  onSort,
  activeOrderCol = false,
}: TSortableHeadButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onSort}
      className="group inline-flex items-center text-xs font-medium uppercase tracking-wide text-gray-500"
    >
      {title}
      <span
        className={`transition-all ${
          activeOrderCol
            ? "ml-2 flex-none rounded bg-gray-200 text-gray-900 group-enabled:group-hover:visible group-enabled:group-focus:visible group-enabled:group-hover:bg-gray-300"
            : "opacity-0 ml-2 flex-none rounded text-gray-400 group-enabled:group-hover:opacity-100 group-enabled:group-focus:opacity-100"
        }`}
      >
        {activeOrderCol ? (
          orderDir === -1 ? (
            <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          )
        ) : (
          <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
    </button>
  );
};

export default SortableTableHeadButton;
