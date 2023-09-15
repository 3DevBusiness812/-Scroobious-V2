import { useEffect, useRef, MutableRefObject } from "react";
import { useStore } from "../state";
import type { TEventBusEvent } from "../PDFViewerBase";

const ThumbSidebar = () => {
  const isThumbSidebarOpen = useStore((s) => s.isThumbSidebarOpen);
  const isPDFPagesLoaded = useStore((s) => s.isPDFPagesLoaded);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const eventBus = useStore((s) => s.eventBus);
  const currentPageNumber = useStore((s) => s.currentPageNumber);
  const linkService = useStore((s) => s.linkService);
  const pageThumbnails = useStore((s) => s.pageThumbnails);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );
  const pagesCount = useStore((s) => s.pagesCount);

  let sections: [string, number[]][] = [];
  let currSection: string | undefined;
  for (let ix = 0; ix < pagesCount; ix++) {
    const pageSection = sectionTitlePageBelongsTo(ix + 1);

    if (pageSection !== currSection) {
      sections.push([pageSection, [ix]]);
      currSection = pageSection;
    } else {
      const [pageSection, items] = sections.at(-1)!;
      sections = [...sections.slice(0, -1), [pageSection, [...items, ix]]];
    }
  }

  const hasSections = Array(pagesCount)
    .fill(0)
    .some((_, ix) => !!sectionTitlePageBelongsTo(ix + 1));

  const pagesRef = useRef(new Array()) as MutableRefObject<HTMLLIElement[]>;
  const scrollContainerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const onPageChanging = ({ pageNumber }: TEventBusEvent) => {
    pagesRef.current[pageNumber - 1]?.scrollIntoView({ block: "center" });
  };

  useEffect(() => {
    eventBus?.on("pagechanging", onPageChanging);

    return () => {
      eventBus?.off("pagechanging", onPageChanging);
    };
  }, [isPDFPagesLoaded]);

  return (
    <div
      className={`h-full border-r border-r-gray-300 bg-gray-100 relative transition-all duration-200 scale-100 ${
        isThumbSidebarOpen
          ? "visible w-48"
          : "invisible border-r-0 border-l-0 overflow-hidden w-0"
      }`}
    >
      <div
        ref={scrollContainerRef}
        className={`h-full max-h-full absolute inset-0 overflow-auto scale-100 ${
          isThumbSidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`transition-all bg-gray-50 duration-200 delay-100 ${
            isThumbSidebarOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {sections.map(([title, pages], sectionIx) => (
            <div className="relative" key={`${title}-${sectionIx}`}>
              {hasSections && (
                <div className="sticky -top-px z-20 max-w-full border-y border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                  <h3 className="truncate">{title ? title : "​"}</h3>
                </div>
              )}
              <ul className="flex flex-col items-center py-4 space-y-4 text-gray-500">
                {isPDFPagesLoaded &&
                  pages.map((ix) => (
                    <li
                      key={ix}
                      ref={(el) => pagesRef.current.push(el!)}
                      onClick={() => {
                        linkService?.goToPage(ix + 1);
                        setAnnotation(null);
                      }}
                    >
                      <div
                        className={`p-2 relative ${
                          currentPageNumber === ix + 1
                            ? "bg-gray-300"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <div className="w-36 min-h-[30px] cursor-pointer border border-gray-300 shadow bg-white">
                          <img
                            className="w-full"
                            src={pageThumbnails.get(ix)}
                          />
                        </div>
                      </div>
                      <div className="text-center w-full py-1.5 text-xs">
                        {ix + 1}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbSidebar;
