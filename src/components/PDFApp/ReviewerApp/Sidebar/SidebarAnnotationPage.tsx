import { MutableRefObject, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import SidebarAnnotationsByComments from "./SidebarAnnotationsByComment";
import { scrollAnimateTo } from "../../helpers";
import { useStore, type Annotation } from "../../state";

type TSidebarAnnotationPageProps = {
  pageIx: number;
  annotations: Annotation[];
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
};

const SidebarAnnotationPage = ({
  pageIx,
  annotations,
  sidebarScrollWrapperRef,
}: TSidebarAnnotationPageProps) => {
  const selectedAnnotation = useStore((s) => s.selectedAnnotation);
  const currentPageNumber = useStore((s) => s.currentPageNumber);
  const groupAnnotationsByComment = useStore(
    (s) => s.groupAnnotationsByComment
  );
  const sectionTitlePageBelongsTo = useStore(
    (s) => s.sectionTitlePageBelongsTo
  );

  const annotationsByComment = groupAnnotationsByComment(annotations);
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (!selectedAnnotation && currentPageNumber === pageIx + 1) {
      // if (currentPageNumber === pageIx + 1) {
      scrollAnimateTo({
        parent: sidebarScrollWrapperRef.current,
        child: wrapperRef.current,
        offset: {
          top: 0,
        },
      });
    }
  }, [currentPageNumber, selectedAnnotation]);
  return (
    <div id={`sidebar-feedback-page-${pageIx}`} ref={wrapperRef}>
      {annotations.length > 0 ? (
        <div className="relative">
          <div className="sticky top-0 z-20 border-y border-gray-200 bg-gray-100 px-6 py-1 text-xs font-medium text-gray-500 uppercase">
            <div className="flex w-full space-x-2">
              <div className="flex-1 truncate">
                {sectionTitlePageBelongsTo(pageIx + 1)}
              </div>
              <div className="text-right text-gray-400">Page {pageIx + 1}</div>
            </div>
          </div>
          <ul role="list" className="relative divide-y divide-y-gray-200">
            {annotationsByComment.map((annotations) => (
              <SidebarAnnotationsByComments
                key={`${pageIx}-${annotations[0]?.commentVersion.id}`}
                annotations={annotations}
                sidebarScrollWrapperRef={sidebarScrollWrapperRef}
                pageIx={pageIx}
              />
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SidebarAnnotationPage;
