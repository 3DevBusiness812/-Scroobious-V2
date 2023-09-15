import type { PDFRectExtra, PDFRect } from "../state";
import type { LTWHP, Page } from "../types";
import { optimizeClientRects } from "./optimize-client-rects";

export const createPolygonPoints = (
  left: number,
  top: number,
  width: number,
  height: number,
  currentScale: number
) => {

  const x = left * currentScale;
  const y = top * currentScale;
  const w = width * currentScale;
  const h = height * currentScale;

  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]
    .map((e) => e.join(","))
    .join(" ");
};

export const createRectStyles = (
  left: number,
  top: number,
  width: number,
  height: number,
  currentScale: number
) => {
  const x = left * currentScale;
  const y = top * currentScale;
  const w = width * currentScale;
  const h = height * currentScale;

  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${h}px`,
  }
}

export const boundingPolygonPoints = (
  rects: PDFRectExtra[],
  currentScale: number,
  padding: number = 0
) => {

  const xs = rects.flatMap(({ left, width }) => [left, left + width])
  const ys = rects.flatMap(({ top, height }) => [top, top + height])

  const x1 = Math.min(...xs) - padding;
  const x2 = Math.max(...xs) + padding;
  const y1 = Math.min(...ys) - padding;
  const y2 = Math.max(...ys) + padding;

  return createPolygonPoints(x1, y1, x2 - x1, y2 - y1, currentScale);
};

export const boundingRectStyles = (
  rects: PDFRectExtra[] | PDFRect[],
  currentScale: number,
  padding: number = 0
) => {

  const xs = rects.flatMap(({ left, width }) => [left, left + width])
  const ys = rects.flatMap(({ top, height }) => [top, top + height])

  const x1 = Math.min(...xs) * currentScale - padding;
  const x2 = Math.max(...xs) * currentScale + padding;
  const y1 = Math.min(...ys) * currentScale - padding;
  const y2 = Math.max(...ys) * currentScale + padding;

  return {
    left: `${x1}px`,
    top: `${y1}px`,
    width: `${x2 - x1}px`,
    height: `${y2 - y1}px`,
  }
};



export const normalizeRect = (x: number, y: number, w: number, h: number, parentWidth: number, parentHeight: number) => {
  const x0 = Math.max(0, Math.min(x, x + w));
  const y0 = Math.max(0, Math.min(y, y + h));
  const x1 = Math.min(parentWidth, Math.max(x, x + w));
  const y1 = Math.min(parentHeight, Math.max(y, y + h));

  return {
    left: x0,
    top: y0,
    width: Math.abs(x1 - x0),
    height: Math.abs(y1 - y0),
  }
}

export const createPositionStyle = (
  x: number,
  y: number,
  w: number,
  h: number,
  parentWidth: number,
  parentHeight: number,
) => {
  const x0 = Math.max(0, Math.min(x, x + w));
  const y0 = Math.max(0, Math.min(y, y + h));
  const x1 = Math.min(parentWidth, Math.max(x, x + w));
  const y1 = Math.min(parentHeight, Math.max(y, y + h));

  return {
    left: `${x0}px`,
    top: `${y0}px`,
    width: `${Math.abs(x1 - x0)}px`,
    height: `${Math.abs(y1 - y0)}px`,
  }
}

const isClientRectInsidePageRect = (clientRect: DOMRect, pageRect: DOMRect) => {
  if (clientRect.top < pageRect.top) {
    return false;
  }
  if (clientRect.bottom > pageRect.bottom) {
    return false;
  }
  if (clientRect.right > pageRect.right) {
    return false;
  }
  if (clientRect.left < pageRect.left) {
    return false;
  }

  return true;
};

export const getClientRects = (
  range: Range,
  pages: Page[],
  shouldOptimize: boolean = true
): Array<LTWHP> => {
  const clientRects = Array.from(range.getClientRects());

  const rects: LTWHP[] = [];

  for (const clientRect of clientRects) {
    for (const page of pages) {
      const pageRect = page.node.getBoundingClientRect();

      if (
        isClientRectInsidePageRect(clientRect, pageRect) &&
        clientRect.width > 0 &&
        clientRect.height > 0 &&
        clientRect.width < pageRect.width &&
        clientRect.height < pageRect.height
      ) {
        const highlightedRect = {
          top: clientRect.top + page.node.scrollTop - pageRect.top,
          left: clientRect.left + page.node.scrollLeft - pageRect.left,
          width: clientRect.width,
          height: clientRect.height,
          pageNumber: page.number,
        } as LTWHP;

        rects.push(highlightedRect);
      }
    }
  }

  return shouldOptimize ? optimizeClientRects(rects) : rects;
};
