import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore } from "../state";
import { GoCheck } from "react-icons/go";

type TPageSectionsRendererProps = {
  pdfViewer: PDFViewer;
};

const PageSectionsRenderer = ({ pdfViewer }: TPageSectionsRendererProps) => {
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );
  const pagesCount = useStore((s) => s.pagesCount);
  const showPageSectionLabel = useStore((s) => s.showPageSectionLabel);
  const currentScale = useStore((s) => s.currentScale);

  const pages = Array(pagesCount)
    .fill(0)
    .map((_, ix) => pdfViewer.getPageView(ix) as PDFPageView);

  return (
    <div className="absolute z-20 w-full h-full inset-0 pointer-events-none">
      {pages.map((page, ix) => (
        <div
          className="relative my-[10px] mx-auto pointer-events-none"
          key={ix}
          style={{
            width: `${page.width}px`,
            height: `${page.height}px`,
          }}
        >
          {showPageSectionLabel && sectionTitlePageBelongsTo(ix + 1) && (
            <div className="w-full max-w-full sticky -top-px p-2 px-4 flex items-center justify-between space-x-2">
              <div className="flex w-full justify-end">
                <div className="relative inline-flex items-center max-w-full truncate rounded space-x-1 bg-white/75 backdrop-blur shadow-md px-3 py-2 text-sm font-normal text-gray-600 ring-1 ring-inset ring-gray-300">
                  <div className="inline-flex space-x-1 items-center">
                    <GoCheck className="text-green-500 w-5 h-5" />
                    <span>{sectionTitlePageBelongsTo(ix + 1)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PageSectionsRenderer;
