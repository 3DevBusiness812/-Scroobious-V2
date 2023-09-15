import React, { Ref, PropsWithChildren } from "react";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      className={`cursor-pointer flex items-center p-1 text-gray-500 rounded ${
        reversed
          ? active
            ? "text-white"
            : "text-gray-50"
          : active
          ? "bg-gray-200 hover:bg-gray-300"
          : "hover:bg-gray-200"
      }`}
    />
  )
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      className="text-lg flex items-center align-text-center"
    />
  )
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => (
    <div
      {...props}
      ref={ref}
      className="p-2 flex items-center space-x-1 bg-gray-50 rounded-t z-10 absolute top-0 left-0 w-full pointer-events-none"
    />
  )
);

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => <Menu {...props} ref={ref} />
);
