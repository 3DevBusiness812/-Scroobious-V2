import type { RouterOutput } from '~/utils/trpc';
import type { Descendant } from "slate";


export type PDFRect = {
  id: string;
  top: number,
  left: number,
  width: number,
  height: number,
  pageNumber: number,
}

export type PDFRectExtra = PDFRect & {
  comment: Descendant[],
  text: string,
  annotation: Annotation
}

export type PageAnnotationRects = {
  annotation: Annotation,
  pageNumber: number,
  rects: PDFRectExtra[]
}

export type PageWithRects = {
  pageNumber: number,
  rects: PDFRectExtra[]
}

export type PageWithAnnotationRects = {
  pageNumber: number,
  rects: PageAnnotationRects[]
}

export type CreateAnnotationScreenshotInputType = {
  id: string;
  rects: PDFRect[],
  type: "text" | "screenshot",
}

export type Annotation = {
  id: string;
  comment: Descendant[],
  text: string,
  imgSrc?: string,
  rects: PDFRect[],
  createdAt: string,
  type: "text" | "screenshot",
  commentVersion: Comment,
  reviewedCommentVersion?: Comment | null
}

export type NewAnnotation = {
  id?: string;
  comment: Descendant[],
  text: string,
  imgSrc?: string,
  // rects: Omit<PDFRect, "id">[],
  rects: PDFRect[],
  createdAt: string,
  type: "text" | "screenshot",
  commentVersion: Comment,
  reviewedCommentVersion?: Comment | null
}

export type Comment = RouterOutput['pitchWrittenFeedback']['addFeedbackComment'];

/**
 * Pitch Deck Founder/Investor Conversation
 */
export type Message = {
  id: string;
  body: string,
  text: string,
  rects: PDFRect[],
  createdAt: string,
  type: "text" | "screenshot",
}
