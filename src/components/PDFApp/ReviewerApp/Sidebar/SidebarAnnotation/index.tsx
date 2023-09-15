import { MutableRefObject } from "react";
import { useStore, type Annotation } from "../../../state";
import ViewerSidebarAnnotation from "./Viewer";
import ReviewerSidebarAnnotation from "./Reviewer";

type TAnnotationProps = {
  annotation: Annotation;
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  annotations: Annotation[];
  pageIx: number;
};

const SidebarAnnotation = ({
  annotation,
  sidebarScrollWrapperRef,
  annotations,
  pageIx,
}: TAnnotationProps) => {
  const isViewer = useStore((s) => s.isViewer);

  return isViewer() ? (
    annotation.commentVersion.isActive ? (
      <ViewerSidebarAnnotation
        annotation={annotation}
        sidebarScrollWrapperRef={sidebarScrollWrapperRef}
        pageIx={pageIx}
      />
    ) : (
      <span />
    )
  ) : (
    <ReviewerSidebarAnnotation
      annotation={annotation}
      annotations={annotations}
      sidebarScrollWrapperRef={sidebarScrollWrapperRef}
      pageIx={pageIx}
    />
  );
};

export default SidebarAnnotation;
