import {
  ReactNode,
  useEffect,
  useRef,
  MutableRefObject,
  useState,
} from "react";
import {
  GlobalWorkerOptions,
  getDocument,
  AnnotationEditorType,
  AnnotationMode,
  version,
} from "pdfjs-dist";
// import workerUrl from "/node_modules/pdfjs-dist/build/pdf.worker.js?url";

import {
  EventBus,
  PDFViewer,
  PDFLinkService,
  NullL10n,
} from "pdfjs-dist/web/pdf_viewer";

import { useStore, type AppState } from "./state";
import Spinner from "./Spinner";
import InitialAnnotationLoader from "./InitialAnnotationLoader";
import ViewerResizeObserver from "./ViewerResizeObserver";

GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;

export type TEventBusEvent = {
  source: PDFViewer;
  pagesCount: number;
  pageNumber: number;
  pageLabel: string;
  previous: number;
  scale: number;
  presetValue: string | undefined;
};

type TPDFJSReviewerProps = {
  fileUrl: string;
  me: AppState["me"];
  pitchWrittenFeedback: AppState["pitchWrittenFeedback"];
  pitchDeck: AppState["pitchDeck"];
  pitchDeckCreationSections?: AppState["pitchDeckCreationSections"];
  minScale?: number;
  maxScale?: number;
  messageId?: string | null;
  onBeforeLoad?: () => void;
  children?: ReactNode;
};

const PDFViewerBase = ({
  fileUrl,
  me,
  pitchWrittenFeedback,
  pitchDeck,
  pitchDeckCreationSections = [],
  minScale = 0.1,
  maxScale = 10,
  messageId = null,
  onBeforeLoad,
  children,
}: TPDFJSReviewerProps) => {
  const [error, setError] = useState(null);

  const isPDFViewerLoaded = useStore((s) => s.isPDFViewerLoaded);
  const pdfFileUrl = useStore((s) => s.pdfFileUrl);
  const setPagesCount = useStore((s) => s.setPagesCount);
  const setCurrentScale = useStore((s) => s.setCurrentScale);
  const setMinScale = useStore((s) => s.setMinScale);
  const setMaxScale = useStore((s) => s.setMaxScale);
  const setCurrentPageNumber = useStore((s) => s.setCurrentPageNumber);
  const setIsPDFViewerLoaded = useStore((s) => s.setIsPDFViewerLoaded);
  const setPDFViewer = useStore((s) => s.setPDFViewer);
  const setPDFDocument = useStore((s) => s.setPDFDocument);
  const setIsPDFDocumentLoaded = useStore((s) => s.setIsPDFDocumentLoaded);
  const setIsPDFPagesLoaded = useStore((s) => s.setIsPDFPagesLoaded);
  const setEventBus = useStore((s) => s.setEventBus);
  const setLinkService = useStore((s) => s.setLinkService);
  const setPdfFileUrl = useStore((s) => s.setPdfFileUrl);
  const setPdfFile = useStore((s) => s.setPdfFile);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const pdfViewer = useStore((s) => s.pdfViewer);
  const createPageThumbnails = useStore((s) => s.createPageThumbnails);
  const setPitchWrittenFeedback = useStore((s) => s.setPitchWrittenFeedback);
  const setPitchDeck = useStore((s) => s.setPitchDeck);
  const resetState = useStore((s) => s.resetState);
  const setMe = useStore((s) => s.setMe);
  const editEnabled = useStore((s) => s.computed.editEnabled);
  const existingPdfDocument = useStore((s) => s.pdfDocument);
  const isViewer = useStore((state) => state.isViewer);
  const setSelectedTool = useStore((state) => state.setSelectedTool);
  const setConversationMessageId = useStore((s) => s.setConversationMessageId);

  const setPitchDeckCreationSections = useStore(
    (s) => s.setPitchDeckCreationSections
  );

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const viewerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const eventBusRef = useRef() as MutableRefObject<EventBus>;
  const linkServiceRef = useRef() as MutableRefObject<PDFLinkService>;
  const pdfViewerRef = useRef() as MutableRefObject<PDFViewer>;

  const onTextLayerRendered = ({ source, pageNumber }: TEventBusEvent) => {};

  const onDocumentReady = ({ source }: TEventBusEvent) => {
    source._setScale("auto", {}); // auto, page-actual
    setPDFViewer(source);
    setIsPDFViewerLoaded(true);
    if (isViewer()) {
      setSelectedTool(null);
    }
  };

  const onScaleChanging = ({ scale, presetValue, source }: TEventBusEvent) => {
    const zoom = Math.max(minScale, Math.min(maxScale, scale));
    setCurrentScale(zoom);
    if (!presetValue) {
      source._setScale(zoom, {});
    }
  };

  const onPagesLoaded = async ({ pagesCount, source }: TEventBusEvent) => {
    setPagesCount(pagesCount);
    setCurrentPageNumber(1);
    setIsPDFPagesLoaded(true);

    await createPageThumbnails();
  };

  const onPageChanging = ({ pageNumber }: TEventBusEvent) =>
    setCurrentPageNumber(pageNumber);

  const onPageClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".textLayer")) setAnnotation(null);
    // if ((e.target as HTMLElement).closest("#viewer")) setAnnotation(null);
  };

  useEffect(() => {
    setMe(me);
    setPitchWrittenFeedback(pitchWrittenFeedback);
    setPitchDeck(pitchDeck);
    setPitchDeckCreationSections(pitchDeckCreationSections);
    setMinScale(minScale);
    setMaxScale(maxScale);
    setConversationMessageId(messageId);

    if (onBeforeLoad) onBeforeLoad();

    if (!eventBusRef?.current) {
      eventBusRef.current = new EventBus();
      linkServiceRef.current = new PDFLinkService({
        eventBus: eventBusRef.current,
        externalLinkTarget: 2,
      });

      pdfViewerRef.current = new PDFViewer({
        container: containerRef.current,
        viewer: viewerRef.current,
        eventBus: eventBusRef.current,
        linkService: linkServiceRef.current,
        // textLayerMode: role() !== "FOUNDER" ? 2 : 0,
        textLayerMode: 2,
        removePageBorders: true,
        l10n: NullL10n,
        annotationMode: AnnotationMode.DISABLE,
        annotationEditorMode: AnnotationEditorType.NONE,
      });

      linkServiceRef.current.setViewer(pdfViewerRef.current);
      setEventBus(eventBusRef.current);
      setLinkService(linkServiceRef.current);
    }

    const loadDocument = async () => {
      const file = fileUrl;
      setPdfFile(fileUrl);

      const url = await fetch(file)
        .then((r) => r.blob())
        .then((file) => {
          if (pdfFileUrl) URL.revokeObjectURL(pdfFileUrl);

          return URL.createObjectURL(file);
        });

      const pdfDocument = await getDocument({ url }).promise;

      for (let i = 0; i < pdfDocument.numPages; i++) {
        await pdfDocument.getPage(i + 1);
      }

      setPdfFileUrl(url);
      setPDFDocument(pdfDocument);
      setIsPDFDocumentLoaded(true);

      linkServiceRef.current.setDocument(pdfDocument);
      pdfViewerRef.current.setDocument(pdfDocument!);
    };

    loadDocument().catch((err) => setError(err));

    eventBusRef.current.on("textlayerrendered", onTextLayerRendered);
    eventBusRef.current.on("pagesinit", onDocumentReady);
    eventBusRef.current.on("pagesloaded", onPagesLoaded);
    eventBusRef.current.on("scalechanging", onScaleChanging);
    eventBusRef.current.on("pagechanging", onPageChanging);

    document.addEventListener("mousedown", onPageClick);

    return () => {
      existingPdfDocument?.destroy();
      pdfViewer?.cleanup();
      resetState();

      eventBusRef.current.off("textlayerrendered", onTextLayerRendered);
      eventBusRef.current.off("pagesinit", onDocumentReady);
      eventBusRef.current.off("pagesloaded", onPagesLoaded);
      eventBusRef.current.off("scalechanging", onScaleChanging);
      eventBusRef.current.off("pagechanging", onPageChanging);

      document.removeEventListener("mousedown", onPageClick);
    };
  }, []);

  if (error) throw error;

  return (
    <>
      <div ref={containerRef} id="viewerContainer" className="absolute">
        <div ref={viewerRef} id="viewer" className="pdfViewer">
          {children}
        </div>
      </div>

      {!isPDFViewerLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="w-9 h-9" />
        </div>
      )}

      {isPDFViewerLoaded && pdfViewer && (
        <>
          {pitchWrittenFeedback && (
            <InitialAnnotationLoader
              pitchWrittenFeedbackId={pitchWrittenFeedback?.id!}
            />
          )}
          <ViewerResizeObserver target={containerRef} />
        </>
      )}
    </>
  );
};

export default PDFViewerBase;
