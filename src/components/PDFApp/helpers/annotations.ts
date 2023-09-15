import type { PageWithRects, PDFRectExtra, Annotation, PageWithAnnotationRects } from "../state";
export const getRectsByPage = (
  annotations: Annotation[],
  pagesCount: number
): PageWithRects[] => {
  const m = new Map<number, PDFRectExtra[]>();

  for (const annotation of annotations) {
    const { rects, comment, text, id } = annotation;
    for (const rect of rects) {
      const { pageNumber } = rect;
      const val = m.get(pageNumber) ?? [];

      m.set(pageNumber, [
        ...val,
        {
          ...rect,
          comment,
          text,
          annotation,
        },
      ]);
    }
  }

  return Array(pagesCount)
    .fill(0)
    .map((_, ix) => ({
      pageNumber: ix + 1,
      rects: m.get(ix + 1) ?? [],
    }));
};

export const getRectsByAnnotationByPage = (
  annotations: Annotation[],
  pagesCount: number,
  activeOnly?: boolean
): PageWithAnnotationRects[] => {
  const m = new Map<number, Map<string, PDFRectExtra[]>>();
  const a = new Map<string, Annotation>();

  const filteredAnnotations = annotations.filter(annotation => !activeOnly || annotation.commentVersion.isActive)

  for (const annotation of filteredAnnotations) {
    const { rects, comment, text, id } = annotation;
    a.set(id, annotation);
    for (const rect of rects) {
      const { pageNumber } = rect;
      const page = m.get(pageNumber) ?? new Map<string, PDFRectExtra[]>();
      const ann = page.get(id) ?? [];

      ann.push({
        ...rect,
        comment,
        text,
        annotation,
      })

      page.set(id, ann);
      m.set(pageNumber, page);
    }
  }

  const result: PageWithAnnotationRects[] = [];

  for (let ix = 0; ix < pagesCount; ix++) {
    const page = m.get(ix + 1);
    const pageNumber = ix + 1;
    const pageItems: PageWithAnnotationRects = {
      pageNumber,
      rects: []
    }

    if (page) {
      for (const [annotationId, rects] of Array.from(page.entries())) {
        pageItems.rects.push({
          pageNumber,
          annotation: a.get(annotationId)!,
          rects
        })
      }
    }

    result.push(pageItems)
  }

  return result;
};

export const getAnnotationLinksByPage = (
  annotations: Annotation[]
): Map<number, PDFRectExtra[]> => {
  const m = new Map<number, PDFRectExtra[]>();

  for (const annotation of annotations) {
    const { rects, comment, text, id } = annotation;
    const [rect] = rects;
    const { pageNumber } = rect!;

    m.set(pageNumber, [
      ...(m.get(pageNumber) ?? []),
      {
        ...rect!,
        comment,
        text,
        annotation,
      },
    ]);
  }

  return m;
};


export const getAnnotationScrollOffset = (rawEl: any) => {
  const el = rawEl as HTMLElement;
  const parent = el.offsetParent as HTMLElement;
  const offsetParent = parent.offsetParent as HTMLElement;
  const top = el.offsetTop + parent.offsetTop + offsetParent.offsetTop;
  const left = el.offsetLeft + parent.offsetLeft + offsetParent.offsetTop;

  return {
    top,
    left
  }
}

type TScrollAnimateArgs = {
  parent: HTMLElement | null | undefined,
  child: HTMLElement | null | undefined,
  offset?: { top?: number, left?: number },
  behavior?: "smooth" | "auto"
}
export const scrollAnimateTo = ({ parent, child, offset = {}, behavior = "smooth" }: TScrollAnimateArgs) => {
  if (!parent || !child) return;

  const { top: offsetTop = 100, left: offsetLeft = 50 } = offset ?? {};
  const { top, left } = getAnnotationScrollOffset(child)

  parent?.scrollTo({
    top: top - offsetTop,
    left: left - offsetLeft,
    behavior
  });
}
