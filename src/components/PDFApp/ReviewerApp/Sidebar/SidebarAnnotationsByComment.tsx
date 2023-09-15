import { MutableRefObject } from "react";
import { type Annotation } from "../../state";
import SidebarAnnotation from "./SidebarAnnotation";

type TAnnotationProps = {
  annotations: Annotation[];
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  pageIx: number;
};

const SidebarAnnotationsByComments = ({
  annotations,
  sidebarScrollWrapperRef,
  pageIx,
}: TAnnotationProps) => {
  return (
    <li className={`transition-colors cursor-pointer bg-gray-50`}>
      {annotations.map((annotation) => (
        <SidebarAnnotation
          annotation={annotation}
          key={`${annotation.id}.${annotation.commentVersion.v}.${pageIx}`}
          sidebarScrollWrapperRef={sidebarScrollWrapperRef}
          pageIx={pageIx}
          annotations={annotations}
        />
      ))}
    </li>
  );
};

export default SidebarAnnotationsByComments;
