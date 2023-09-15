import { useState, useEffect, useRef, MutableRefObject } from "react";
import { GoUnfold, GoFold } from "react-icons/go";
import AnnotationDate from "../AnnotationDate";
import { renderContent, useIsClampable } from "../helpers";
import { useStore, type Annotation } from "../../../state";
import { scrollAnimateTo } from "../../../helpers";

type TAnnotationProps = {
  annotation: Annotation;
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  pageIx: number;
};

const ViewerSidebarAnnotation = ({
  annotation,
  sidebarScrollWrapperRef,
  pageIx,
}: TAnnotationProps) => {
  const selectedAnnotation = useStore((s) => s.selectedAnnotation);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const pitchWrittenFeedback = useStore((s) => s.pitchWrittenFeedback);

  const contentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;

  const isClampable = useIsClampable(contentRef);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (selectedAnnotation?.id === annotation.id) {
      scrollAnimateTo({
        parent: sidebarScrollWrapperRef.current,
        child: wrapperRef.current,
        offset: {
          top: 25,
        },
      });
    }
  }, [selectedAnnotation]);

  return (
    <div
      ref={wrapperRef}
      onClick={(e) => {
        e.preventDefault();
        setAnnotation(annotation);
      }}
      className={`px-4 py-6 pb-4 sm:px-6 transition-colors cursor-pointer ${
        selectedAnnotation?.id === annotation.id
          ? "bg-orange-100 hover:bg-orange-100 scale-100"
          : "hover:bg-orange-50"
      }`}
    >
      <div className="flex space-x-3 w-full">
        <div className="w-full">
          <div className="flex text-sm items-center space-x-2">
            <div className="w-10 h-10">
              <img
                className="w-full h-full object-cover rounded-full"
                src={pitchWrittenFeedback?.reviewer?.profilePicture?.url}
                alt={pitchWrittenFeedback?.reviewer?.name}
              />
            </div>
            <div className="font-medium text-gray-900 flex-1">
              {pitchWrittenFeedback?.reviewer?.name}
              <span className="block">
                <AnnotationDate createdAt={annotation.createdAt} />
              </span>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <div className="py-4 relative">
              <div
                ref={contentRef}
                className={`${isCollapsed ? "line-clamp-6" : ""}`}
              >
                {renderContent(annotation.comment as any)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm flex w-full justify-between">
            {isClampable ? (
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`cursor-pointer flex items-center p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
              >
                {isCollapsed ? (
                  <GoUnfold className="h-4 w-4" />
                ) : (
                  <GoFold className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerSidebarAnnotation;
