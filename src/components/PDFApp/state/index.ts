import { create } from "zustand";
import { nanoid } from "nanoid";
import { PDFPageView } from "pdfjs-dist/web/pdf_viewer";
import { PDFPageProxy, PixelsPerInch } from "pdfjs-dist";
import { type Descendant } from "slate";
import type { Annotation } from "./types";
import { AppState, ConversationMessage } from "./AppState";

export * from "./types"
export * from "./AppState";

export const useStore = create<AppState>((set, get) => ({
  computed: {
    get editEnabled() {
      return !!get().pitchWrittenFeedback && ((!get().isViewer() && get().isAssigned()) || get().isL2Reviewer())
    },
    get isSelectedAnnotationMineAndNotDeleted() {
      const annotation = get().selectedAnnotation
      return annotation?.commentVersion.author.id === get().me?.id && !annotation?.commentVersion.deletedAt
    },

    /**
     * Computed state for Prepare Pitch Deck
     */
    get assignableSections() {
      const hideSteps = ["pitch deck summary", "optional content", "marketplaces"]
      const steps = get().pitchDeckCreationSections
        .filter(p => (p.courseStepDefinition?.type === "VIDEO" && !hideSteps.includes(p.courseStepDefinition?.name?.toLowerCase())))

      const customDeckSections = new Map(
        (get().pitchDeck?.pitchDeckSections ?? [])
          .filter(p => p.customSectionName)
          .map(({ customSectionName }) => [customSectionName, { customSectionName }])
      )

      return [...steps, ...customDeckSections.values()];
    },
    get pitchDeckSummaryStep() {
      return get().pitchDeckCreationSections.find(p => p.courseStepDefinition?.name === "Pitch deck summary")!
    },
    get pitchDeckMarketSizeCalculatorStep() {
      return get().pitchDeckCreationSections.find(p => p.courseStepDefinition?.name === "Market size calculator")?.courseStepDefinition!
    },

    /**
     * Pitch Deck Founder/Investor Conversations
     */
    get conversationMessages() {
      return (get().pitchDeck?.conversationMessages ?? [])
        .filter(msg => msg.conversation.conversationParticipants.some(s => s.user.id === get().me?.id)) as ConversationMessage[]
    },
    get conversationMessage() {
      const { pitchDeck, conversationMessageId: msgId } = get()
      return pitchDeck?.conversationMessages?.find(m => m.id === msgId) ?? null
    },
    get messagesByPage() {
      const { pitchDeck, pagesCount, me } = get();
      const messages = pitchDeck?.conversationMessages ?? [];
      const m: Map<number, ConversationMessage[]> = new Map();

      for (let ix = 0; ix < pagesCount; ix++) m.set(ix, []);

      const filteredMessages = messages
        .filter(msg => msg.conversation.conversationParticipants.some(s => s.user.id === me?.id)) as ConversationMessage[]

      for (const msg of filteredMessages) {
        const { pageNumber } = msg.contextDetails?.rects[0]!;
        const pageIx = pageNumber - 1;

        m.set(pageIx, [...m.get(pageIx) ?? [], msg]);
      }

      return Array.from(m.entries())
        .sort(([pageIx1], [pageIx2]) => pageIx1 - pageIx2)
        .map(([ix, items]) => ([
          ix,
          items.sort((a, b) => +(new Date(a.createdAt)) - +(new Date(b.createdAt)))
        ])) as [number, ConversationMessage[]][]
    },
  },

  me: null,
  pitchWrittenFeedback: null,
  setMe: (me) => set({ me }),
  setPitchWrittenFeedback: (pitchWrittenFeedback) => set({ pitchWrittenFeedback }),
  role: () => {
    const me = get().me;

    if (me?.capabilities?.includes("ADMIN") || me?.capabilities?.includes("L2_REVIEWER")) return "L2_REVIEWER"
    if (me?.capabilities?.includes("REVIEWER")) return "REVIEWER"

    return "VIEWER";
  },

  isReviewer: () => get().role() === "REVIEWER" && get().pitchWrittenFeedback?.reviewer?.id === get().me?.id,
  isL2Reviewer: () => get().role() === "L2_REVIEWER",
  isViewer: () => !get().isReviewer() && !get().isL2Reviewer(),
  isAssigned: () => get().pitchWrittenFeedback?.status === "ASSIGNED",
  isAwaitingQA: () => get().pitchWrittenFeedback?.status === "AWAITING_QA",
  isCompleted: () => get().pitchWrittenFeedback?.status === "COMPLETE",

  // editEnabled: () => (!get().isViewer() && get().isAssigned()) || get().isL2Reviewer(),

  resetState: () => {
    set({
      pdfDocument: null,
      pdfViewer: null,
      isPDFViewerLoaded: false,
      isPDFPagesLoaded: false,
      annotations: [],
      selectedAnnotation: null,
      isFeedbackSidebarOpen: false,
      isThumbSidebarOpen: false,

      isPDFDocumentLoaded: false,
      isAddMenuOpen: false,
      selection: null,
      pdfFileUrl: '',
      pdfFile: '',
      eventBus: null,
      linkService: null,
      pagesCount: 0,
      currentPageNumber: 0,
      currentScale: 0,
      pageThumbnails: new Map<number, string>(),
    })
  },

  getAnnotationsByPage: () => {
    const { annotations, pagesCount, isViewer } = get();
    const m: Map<number, Annotation[]> = new Map();

    for (let ix = 0; ix < pagesCount; ix++) m.set(ix, []);

    const filteredAnnotations = annotations.filter(annotation => !isViewer() || (annotation.commentVersion.isActive && !annotation.commentVersion.deletedAt))

    for (const annotation of filteredAnnotations) {
      const { pageNumber } = annotation.rects[0]!;
      const pageIx = pageNumber - 1;

      m.set(pageIx, [...m.get(pageIx) ?? [], annotation]);
    }

    return Array.from(m.entries())
      .sort(([pageIx1], [pageIx2]) => pageIx1 - pageIx2)
      .map(([ix, items]) => ([
        ix,
        items.sort((a, b) => +(new Date(a.commentVersion.createdAt)) - +(new Date(b.commentVersion.createdAt)))
      ]))
  },

  groupAnnotationsByComment: (annotations: Annotation[]) => {
    const m: Map<string, Annotation[]> = new Map()

    for (const annotation of annotations) {
      const { commentVersion } = annotation;
      const { id } = commentVersion;
      m.set(id, [...m.get(id) ?? [], annotation]);
    }

    return Array.from(m.values()).
      map((annotations) => (annotations.sort((a, b) => a.commentVersion.v - b.commentVersion.v)));
  },

  selectedTool: "screenshot",
  setSelectedTool: (selectedTool) => {
    set({ selectedTool })
  },

  isDraggingResizingScreenshot: false,
  setIsDraggingResizingScreenshot: (isDraggingResizingScreenshot) => set({ isDraggingResizingScreenshot }),

  isPDFViewerLoaded: false,
  isPDFDocumentLoaded: false,
  isPDFPagesLoaded: false,
  isFeedbackSidebarOpen: false,
  isThumbSidebarOpen: false,
  isAddMenuOpen: false,
  showPageSectionLabel: true,

  pageThumbnails: new Map<number, string>(),

  selectedAnnotation: null,
  selection: null,

  pdfFileUrl: "",
  pdfFile: "", // Link to the PDF file https://s3....pdf

  pdfViewer: null,
  pdfDocument: null,
  eventBus: null,
  linkService: null,

  annotations: [],
  currentScale: 0,
  viewportScale: 0,
  minScale: 0.1,
  maxScale: 10,
  currentPageNumber: 0,
  pagesCount: 0,

  setPdfFileUrl: (pdfFileUrl) => set({ pdfFileUrl }),
  setPdfFile: (pdfFile) => set({ pdfFile }),
  setPagesCount: (pagesCount) => set({ pagesCount }),
  setCurrentScale: (currentScale) => {
    const viewportScale = currentScale * PixelsPerInch.PDF_TO_CSS_UNITS;
    set({ currentScale, viewportScale })
  },
  setCurrentScaleValue: (currentScaleValue) => {
    set({ currentScaleValue })
  },
  setMinScale: (minScale) => set({ minScale }),
  setMaxScale: (maxScale) => set({ maxScale }),
  setCurrentPageNumber: (currentPageNumber) => set({ currentPageNumber }),
  setIsPDFViewerLoaded: (isPDFViewerLoaded) => set({ isPDFViewerLoaded }),
  setIsPDFDocumentLoaded: (isPDFDocumentLoaded) => set({ isPDFDocumentLoaded }),
  setIsPDFPagesLoaded: (isPDFPagesLoaded) => set({ isPDFPagesLoaded }),
  setPDFViewer: (pdfViewer) => set({ pdfViewer }),
  setPDFDocument: (pdfDocument) => set({ pdfDocument }),
  setEventBus: (eventBus) => set({ eventBus }),
  setLinkService: (linkService) => set({ linkService }),
  addAnnotation: async ({ rects, type, imgSrc, ...rest }, noSelect = false, noEditorFocus = false) => {
    const selectedAnnotation = {
      ...rest,
      type,
      imgSrc: imgSrc ?? "",
      id: rest.id ?? nanoid(),
      rects: rects.map(({ top, left, width, height, ...rest }) => ({
        ...rest,
        id: rest.id ?? nanoid(),
        top: top,
        left: left,
        width: width,
        height: height,
      }))
    }

    set({
      annotations: [...(get().annotations ?? []), selectedAnnotation],
      ...!noSelect && { selectedAnnotation }
    });
  },
  createAnnotationScreenshot: async ({ rects, type, id }) => {
    if (type !== "screenshot") return "";

    const { currentScale } = get();

    const [rect0] = rects;
    const { pageNumber, left, top, width, height } = rect0!;
    const { pdfViewer } = get();

    const SCALE_FACTOR = 1;

    const pageView = (pdfViewer?.getPageView(pageNumber - 1) as PDFPageView)
    const pdfPage = pageView.pdfPage as PDFPageProxy;
    const viewport = pdfPage.getViewport({ scale: SCALE_FACTOR });

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = viewport.width;
    tempCanvas.height = viewport.height;

    const canvasContext = tempCanvas.getContext("2d")!;
    await pdfPage.render({ canvasContext, viewport }).promise

    tempCanvas.width = width * SCALE_FACTOR;
    tempCanvas.height = height * SCALE_FACTOR;
    canvasContext.drawImage(
      pageView.canvas!,
      left * currentScale * SCALE_FACTOR,
      top * currentScale * SCALE_FACTOR,
      width * currentScale * SCALE_FACTOR,
      height * currentScale * SCALE_FACTOR,
      0,
      0,
      width * SCALE_FACTOR,
      height * SCALE_FACTOR
    );

    const imgSrc = tempCanvas.toDataURL("image/png");
    tempCanvas.remove()

    return imgSrc;
  },
  updateAnnotation: async ({ rects, type, ...rest }) => {
    const selectedAnnotation = {
      ...rest,
      type,
      rects: rects.map(({ top, left, width, height, ...rest }) => ({
        ...rest,
        top: top,
        left: left,
        width: width,
        height: height,
      }))
    }
    const annotations = (get().annotations ?? [])
      .map((annotation) => annotation.id === selectedAnnotation.id ? selectedAnnotation : annotation)
    set({ annotations, selectedAnnotation })
  },
  setAnnotation: async (selectedAnnotation, noSelect = false, noEditorFocus = false) => {
    const currentAnnotation = get().selectedAnnotation;
    set({ selectedAnnotation });

    // get().clearEditor();
    // if (!selectedAnnotation || noSelect) return;

    // get().editor.children = selectedAnnotation?.comment?.length ? selectedAnnotation.comment : initialEditorValue;

    // if (noEditorFocus) return;
    // get().focusEditor()
  },
  setAnnotationComment: (comment: Descendant[]) => {
    const annotation = get().selectedAnnotation;

    if (!annotation) return;

    annotation.comment = comment;

    set({
      selectedAnnotation: annotation,
      annotations: get().annotations.map((a) => a.id === annotation.id ? annotation : a)
    })
  },
  deleteAnnotation: (annotation) => {
    set({
      annotations: get().annotations.filter((a) => a.id !== annotation?.id),
      ...get().selectedAnnotation?.id === annotation?.id && { selectedAnnotation: null }
    })
  },
  setSelection: (selection) => set({ selection }),
  setIsAddMenuOpen: (isAddMenuOpen) => set({ isAddMenuOpen }),
  toggleFeedbackSidebar: () => set({ isFeedbackSidebarOpen: !get().isFeedbackSidebarOpen }),
  toggleThumbSidebar: () => set({ isThumbSidebarOpen: !get().isThumbSidebarOpen }),
  setIsFeedbackSidebar: (isFeedbackSidebarOpen) => set({ isFeedbackSidebarOpen }),
  toggleShowPageSectionLabel: () => set({ showPageSectionLabel: !get().showPageSectionLabel }),

  createPageThumbnails: async () => {
    const { pdfViewer, pagesCount, pageThumbnails } = get();
    const tempCanvas = document.createElement("canvas");

    for (let ix = 0; ix < pagesCount; ix++) {
      const pageView = (pdfViewer?.getPageView(ix) as PDFPageView)
      const pdfPage = pageView.pdfPage as PDFPageProxy;
      const viewport = pdfPage.getViewport({ scale: .5 })

      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      const canvasContext = tempCanvas.getContext("2d")!;

      await pdfPage.render({ canvasContext, viewport }).promise

      const imgSrc = tempCanvas.toDataURL("image/png");
      pageThumbnails.set(ix, imgSrc);
    }

    tempCanvas.remove()
    set({ isThumbSidebarOpen: true })
  },

  /**
   * Prepare Pitch Deck
   */
  pitchDeck: null,
  setPitchDeck: (pitchDeck) => set({ pitchDeck }),

  isPreparePitchDeckSidebarOpen: true,
  setIsPreparePitchDeckSidebarOpen: (isPreparePitchDeckSidebarOpen) => set({ isPreparePitchDeckSidebarOpen }),
  pitchDeckCreationSections: [],
  setPitchDeckCreationSections: (pitchDeckCreationSections) => set({ pitchDeckCreationSections }),
  sectionTitlePageBelongsTo: (page: number) => {
    const { customSectionName, courseStepDefinition } = get().pitchDeck?.pitchDeckSections.find(p => p.pageNumber === page) ?? {}

    return customSectionName ?? courseStepDefinition?.name ?? ""
  },
  sectionPageBelongsTo: (page: number) => get().pitchDeck?.pitchDeckSections.find(p => p.pageNumber === page),
  isPageAssignedToSection: (page, section) => {
    const { courseStepDefinition, customSectionName: name } = section;
    const { id } = courseStepDefinition ?? {}
    const pageSection = get().pitchDeck?.pitchDeckSections.find(p => p.pageNumber === page)
    const { courseStepDefinition: ecourseStepDefinition, customSectionName: ename } = pageSection ?? {};
    const { id: eid } = ecourseStepDefinition ?? {}

    return !!pageSection && ((!!eid && eid === id) || (!!ename && ename === name))
  },
  isPageAssignedToAnySection: (page) => !!get().pitchDeck?.pitchDeckSections.some(p => p.pageNumber === page),
  isSectionEmpty: ({ courseStepDefinition, customSectionName }) => !get().pitchDeck?.pitchDeckSections
    .some(s => s.courseStepDefinition?.id === courseStepDefinition?.id || customSectionName === s.customSectionName),
  isSectionFirst: ({ courseStepDefinition, customSectionName }) => {
    const first = get().computed.assignableSections.at(0)!;

    return first.courseStepDefinition?.id === courseStepDefinition?.id ||
      (!!customSectionName && first.customSectionName === customSectionName)
  },
  isSectionLast: ({ courseStepDefinition, customSectionName }) => {
    const last = get().computed.assignableSections.at(-1)!;

    return last.courseStepDefinition?.id === courseStepDefinition?.id ||
      (!!customSectionName && last.customSectionName === customSectionName)
  },
  previousSection: ({ courseStepDefinition, customSectionName }) => {
    const ix = get().computed.assignableSections
      .findIndex(s =>
        (!!customSectionName && s.customSectionName === customSectionName) ||
        s.courseStepDefinition?.id === courseStepDefinition?.id
      );

    return get().computed.assignableSections.at(ix - 1)!
  },
  nextSection: ({ courseStepDefinition, customSectionName }) => {
    const ix = get().computed.assignableSections
      .findIndex(s => s.courseStepDefinition?.id === courseStepDefinition?.id || (!!customSectionName && s.customSectionName === customSectionName));
    return get().computed.assignableSections.at(ix + 1)!
  },
  allSectionsAssigned: () => {
    const { pitchDeck, pagesCount, computed: { assignableSections } } = get();

    const reqSections = new Set(assignableSections
      .filter(s => !!s.courseStepDefinition?.id && s.courseStepDefinition?.name.toLowerCase() !== "optional content")
      .map(s => s.courseStepDefinition?.id)
    );
    const assignedSections = new Set(pitchDeck?.pitchDeckSections.map(s => s.courseStepDefinition?.id ?? s.customSectionName) ?? [])
    const allPages = new Set(Array(pagesCount).fill(0).map((_, ix) => ix + 1));
    const assignedPages = new Set(pitchDeck?.pitchDeckSections.map(s => s.pageNumber) ?? [])

    return [
      [...reqSections].every((x) => x && assignedSections.has(x)),
      [...allPages].every((x) => x && assignedPages.has(x)),
    ].every(s => !!s)
  },

  /**
   * PDF Deck Founder/Investor Messenger
   */
  isPitchOwner: () => !!get().me && get().me?.id === get().pitchDeck?.createdById,
  isInvestor: () => !!get().me?.capabilities?.includes("INVESTOR"),
  isFounder: () => {
    const capabilities = get().me?.capabilities ?? []
    return capabilities.includes("FOUNDER_FULL") || capabilities.includes("FOUNDER_MEDIUM") || capabilities.includes("FOUNDER_LITE")
  },
  setConversationMessageId: (conversationMessageId: string | null) => set({ conversationMessageId }),
  getMessageById: (id: string) => {
    return get().pitchDeck?.conversationMessages?.find(m => m.id === id) as ConversationMessage ?? null
  },
  groupMessagesByThread: (messages: ConversationMessage[]) => {
    const m: Map<string, ConversationMessage[]> = new Map()

    for (const msg of messages) {
      const id = msg.rootThreadMessageId ?? msg.id
      m.set(id, [...m.get(id) ?? [], msg]);
    }

    return Array.from(m.values()).
      map((messages) => (
        messages.sort((a, b) => +(new Date(a.createdAt)) - +(new Date(b.createdAt))))
      )
  },
  conversation: null,
  setConversation: (conversation) => set({ conversation }),
}))

