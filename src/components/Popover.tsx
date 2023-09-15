import { FC } from "react";

export type TPopoverXPos =
  | "left"
  | "right"
  | "center"
  | "align-right"
  | "align-left";
export type TPopoverYPos = "top" | "bottom" | "center";
export type TPopoverProps = {
  x?: TPopoverXPos;
  y?: TPopoverYPos;
  className?: string;
  children: React.ReactNode;
};

const Popover: FC<TPopoverProps> = ({
  x = "right",
  y = "center",
  className = "",
  children,
}) => {
  return (
    <div
      className={`focus:ring-0 focus-within:ring-0 focus:border-transparent focus-within:border-transparent focus:outline-0 origin-top-right absolute py-1 px-2.5 rounded shadow-md bg-neutral-800 border border-neutral-900 text-gray-100 z-30 transition duration-0 delay-0 group-hover:ease-in group-hover:duration-100 group-hover:delay-300 group-hover:visible group-hover:scale-100 ease-out duration-100 opacity-0 group-hover:opacity-100 scale-95 invisible ${
        x === "right"
          ? "left-full"
          : x === "left"
          ? "right-full mr-1"
          : x === "center"
          ? "left-1/2 -translate-x-1/2"
          : x === "align-right"
          ? "right-0"
          : "left-0"
      } ${
        y === "center"
          ? "top-1/2 -translate-y-1/2"
          : y === "top"
          ? "bottom-full mb-1"
          : "top-full mt-2"
      } ${className}`}
    >
      <div className="py-1 cursor-default" role="none">
        {children}
      </div>
    </div>
  );
};

export default Popover;
