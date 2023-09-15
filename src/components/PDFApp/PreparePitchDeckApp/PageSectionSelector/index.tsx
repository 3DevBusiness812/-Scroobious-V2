import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { useStore } from "~/components/PDFApp/state";
import SectionDropdown from "./SectionDropdown";

type TPageSectionSelectorProps = {
  onCreateCustomSectionSelect: (pageNumber: number) => void;
};

const PageSectionSelector = ({
  onCreateCustomSectionSelect,
}: TPageSectionSelectorProps) => {
  const pagesCount = useStore((s) => s.pagesCount);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const currentScale = useStore((state) => state.currentScale); // causes to re-render properly on zoom/in out

  const pages = Array(pagesCount)
    .fill(0)
    .map((_, ix) => pdfViewer?.getPageView(ix) as PDFPageView);

  return (
    <div className="absolute z-10 w-full h-full inset-0">
      {pages.map((page, ix) => (
        <div
          className="relative my-[10px] max-w-full mx-auto bg-white/20 hover:bg-white/0 focus-within:z-50"
          key={ix}
          style={{
            width: `${page.width}px`,
            height: `${page.height}px`,
          }}
        >
          <div className="w-full max-w-full sticky -top-px bg-gray-50/95 backdrop-blur-sm border-b border-gray-300 shadow p-2 px-4 flex items-center justify-between space-x-2">
            <span className="text-gray-500 cursor-default text-sm w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded shadow-sm">
              {ix + 1}
            </span>
            <SectionDropdown onCreateCustomSectionSelect={onCreateCustomSectionSelect} pageNumber={ix + 1} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageSectionSelector;
