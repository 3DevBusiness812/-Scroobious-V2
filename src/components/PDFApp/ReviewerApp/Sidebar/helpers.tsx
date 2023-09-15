import { useState, useLayoutEffect, MutableRefObject } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export const useSize = (target: MutableRefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRectReadOnly | undefined>();

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

export const useIsClampable = (target: MutableRefObject<HTMLElement>) => {
  const [isClampable, setIsClampable] = useState<boolean>();
  const CLAMPABLE_HEIGHT = 124;

  useLayoutEffect(() => {
    setIsClampable(target.current.scrollHeight > CLAMPABLE_HEIGHT);
  }, [target]);

  useResizeObserver(target, (entry) =>
    setIsClampable(entry.target.scrollHeight > CLAMPABLE_HEIGHT)
  );
  return isClampable;
};

export const renderLeaves = (children = []) => {
  return (
    <>
      {children.map(({ bold, text, code, italic, strikethrough }: any, ix) =>
        text ? (
          <span
            key={ix}
            className={`${bold ? "font-bold" : ""}${italic ? " italic" : ""}${
              strikethrough ? " line-through" : ""
            }${code ? " font-mono" : ""}`}
          >
            {text}
          </span>
        ) : (
          <span className="py-0.5 block h-5"></span>
        )
      )}
    </>
  );
};

export const renderContent = (children = []) => {
  return children.map(({ type, children = [] }, ix) => {
    switch (type) {
      case "bulleted-list":
        return (
          <ul key={ix} className="py-0.5 pl-4 ml-2 list-disc">
            {renderContent(children)}
          </ul>
        );
      case "numbered-list":
        return (
          <ol key={ix} className="py-0.5 pl-4 ml-2 list-decimal">
            {renderContent(children)}
          </ol>
        );
      case "list-item":
        return <li key={ix}>{renderLeaves(children)}</li>;
      default:
        return (
          <p key={ix} className="py-0.5">
            {renderLeaves(children)}
          </p>
        );
    }
  });
};

export const isClamped = (el: HTMLElement | null) => {
  return el && el.scrollHeight > el.clientHeight;
};
