import { useState, useRef, MutableRefObject, useEffect, ReactNode } from "react";
import interact from "interactjs";
import { useStore } from "~/components/PDFApp/state";

type TPitchDeckSidebarWrapperProps = {
  children: ReactNode
}

const PitchDeckSidebarWrapper = ({ children }: TPitchDeckSidebarWrapperProps) => {
  const isPreparePitchDeckSidebarOpen = useStore(
    (s) => s.isPreparePitchDeckSidebarOpen
  );

  const sidebarRef = useRef() as MutableRefObject<HTMLDivElement>;
  const bodyRef = useRef(document.body) as MutableRefObject<HTMLBodyElement>;
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);


  useEffect(() => {
    interact(sidebarRef.current)
      .resizable({
        edges: { left: true, right: false, bottom: false, top: false },
        inertia: {
          resistance: 30,
          minSpeed: 200,
          endSpeed: 100,
        },
        listeners: {
          move(event) {
            setWidth(event.rect.width);
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 300, height: 1 },
            max: { width: 800, height: 1 },
          }),
        ],
      })
      .on("resizestart", () => {
        setIsResizing(true);
        bodyRef.current.style.userSelect = "none";
        bodyRef.current.style.touchAction = "none";
      })
      .on("resizeend", () => {
        setIsResizing(false);
        bodyRef.current.style.userSelect = "";
        bodyRef.current.style.touchAction = "";
      });
  }, []);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`h-full border-l border-l-gray-300 relative flex flex-col duration-200 bg-gray-100 ${
          isPreparePitchDeckSidebarOpen
            ? "visible w-96"
            : "invisible border-l-0 overflow-hidden w-0"
        } ${isResizing ? "transition-none" : "transition-all"}`}
        style={{
          width: `${isPreparePitchDeckSidebarOpen ? width : 0}px`,
        }}
      >
        {children}

        <div className="group absolute left-0 top-0 h-full w-1 z-50 group">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute z-50 top-1/2 -left-px text-black/0 group-hover:text-black/20 transition-all duration-200"
          >
            <path
              d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default PitchDeckSidebarWrapper;
