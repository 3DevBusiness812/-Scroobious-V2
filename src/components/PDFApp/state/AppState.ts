import { PDFViewer, EventBus, PDFLinkService } from "pdfjs-dist/web/pdf_viewer";
import { type PDFDocumentProxy } from "pdfjs-dist";
import { type Descendant } from "slate";
import type { CreateAnnotationScreenshotInputType, Annotation, NewAnnotation, PDFRect } from "./types";
import type { RouterOutput } from '~/utils/trpc';

type PitchDeck = NonNullable<RouterOutput['pitchDeck']['byId']>
type PitchDeckCourseStepDefinition = NonNullable<PitchDeck>['pitchDeckSections'][number]["courseStepDefinition"]
type PitchDeckCustomSection = NonNullable<PitchDeck>['pitchDeckSections'][number]["customSectionName"]

export type PitchDeckSection = {
  courseStepDefinition?: PitchDeckCourseStepDefinition;
  customSectionName?: PitchDeckCustomSection;
}

export type ConversationMessage = NonNullable<RouterOutput['pitchDeck']['byId']>['conversationMessages'][number] & {
  contextDetails: {
    id: string;
    text: string,
    rects: PDFRect[],
    createdAt: string,
    pageNumber: number,
    type: "text" | "screenshot",
  }
}

export interface AppState {
  computed: {
    editEnabled: boolean,
    isSelectedAnnotationMineAndNotDeleted: boolean,
    assignableSections: PitchDeckSection[],
    pitchDeckSummaryStep?: PitchDeckSection,
    pitchDeckMarketSizeCalculatorStep?: PitchDeckSection["courseStepDefinition"],
    conversationMessages: PitchDeck["conversationMessages"],
    conversationMessage: PitchDeck["conversationMessages"][number] | null,
    messagesByPage: [number, ConversationMessage[]][],
  },
  me: RouterOutput['user']['me'],
  pitchWrittenFeedback: RouterOutput['pitchWrittenFeedback']['byId'],

  role: () => "REVIEWER" | "L2_REVIEWER" | "VIEWER",
  isReviewer: () => boolean,
  isViewer: () => boolean,
  isL2Reviewer: () => boolean,
  isAssigned: () => boolean,
  isAwaitingQA: () => boolean,
  isCompleted: () => boolean,

  setMe: (me: RouterOutput['user']['me']) => void,
  setPitchWrittenFeedback: (pitchWrittenFeedback: RouterOutput['pitchWrittenFeedback']['byId']) => void,

  getAnnotationsByPage: () => [number, Annotation[]][],
  groupAnnotationsByComment: (annotations: Annotation[]) => Annotation[][],

  resetState: () => void,

  selectedTool: "text" | "screenshot" | null,

  isDraggingResizingScreenshot: boolean,
  setIsDraggingResizingScreenshot: (isDraggingResizingScreenshot: boolean) => void,

  isPDFViewerLoaded: boolean,
  isPDFDocumentLoaded: boolean,
  isPDFPagesLoaded: boolean,
  isFeedbackSidebarOpen: boolean,
  isThumbSidebarOpen: boolean,
  isAddMenuOpen: boolean,
  showPageSectionLabel: boolean,

  selection: Selection | null,

  pdfFileUrl: string,
  pdfFile: string,

  pdfViewer: PDFViewer | null,
  pdfDocument: PDFDocumentProxy | null,
  eventBus: EventBus | null,
  linkService: PDFLinkService | null,

  pagesCount: number,
  currentPageNumber: number,
  currentScale: number,
  currentScaleValue?: string | undefined,
  viewportScale: number,
  minScale: number,
  maxScale: number,
  annotations: Annotation[],
  selectedAnnotation: Annotation | null,
  pageThumbnails: Map<number, string>,

  setPdfFileUrl: (pdfFileUrl: string) => void,
  setPdfFile: (pdfFile: string) => void,
  setPagesCount: (pagesCount: number) => void,
  setCurrentPageNumber: (currentPageNumber: number) => void,
  setCurrentScale: (currentScale: number) => void,
  setCurrentScaleValue: (currentScaleValue: string | undefined) => void,
  setMinScale: (minScale: number) => void,
  setMaxScale: (maxScale: number) => void,
  setIsPDFViewerLoaded: (isPDFViewerLoaded: boolean) => void,
  setIsPDFDocumentLoaded: (isPDFDocumentLoaded: boolean) => void,
  setIsPDFPagesLoaded: (isPDFPagesLoaded: boolean) => void,
  addAnnotation: (newAnnotation: NewAnnotation, noSelect?: boolean, noEditorFocus?: boolean) => void,
  updateAnnotation: (annotation: Annotation) => void,
  createAnnotationScreenshot: (annotation: CreateAnnotationScreenshotInputType) => Promise<string>,
  setAnnotation: (selectedAnnotation: Annotation | null | undefined, noSelect?: boolean, noEditorFocus?: boolean) => void,
  deleteAnnotation: (annotation: Annotation | null) => void,

  setAnnotationComment: (comment: Descendant[]) => void,

  setPDFDocument: (pdfDocument: PDFDocumentProxy | null) => void,
  setPDFViewer: (pdfViewer: PDFViewer | null) => void,
  setEventBus: (eventBus: EventBus) => void,
  setLinkService: (linkService: PDFLinkService) => void,
  setSelection: (selection: Selection | null) => void,

  setIsAddMenuOpen: (isAddMenuOpen: boolean) => void,

  toggleFeedbackSidebar: () => void,
  toggleThumbSidebar: () => void,
  setIsFeedbackSidebar: (isFeedbackSidebar: boolean) => void,
  toggleShowPageSectionLabel: () => void,

  createPageThumbnails: () => Promise<void>,

  setSelectedTool: (selectedTool: "text" | "screenshot" | null) => void,


  /**
   * Prepare Pitch Deck
   */
  pitchDeck: RouterOutput['pitchDeck']['byId'],
  setPitchDeck: (pitchDeck: RouterOutput['pitchDeck']['byId']) => void,
  isPreparePitchDeckSidebarOpen: boolean,
  setIsPreparePitchDeckSidebarOpen: (isPreparePitchDeckSidebarOpen: boolean) => void,
  pitchDeckCreationSections: PitchDeckSection[],
  setPitchDeckCreationSections: (i: PitchDeckSection[]) => void,
  isPageAssignedToSection: (page: number, section: PitchDeckSection) => boolean,
  isPageAssignedToAnySection: (page: number) => boolean,
  isSectionEmpty: (section: PitchDeckSection) => boolean,
  sectionTitlePageBelongsTo: (page: number) => string,
  isSectionFirst: (section: PitchDeckSection) => boolean,
  isSectionLast: (section: PitchDeckSection) => boolean,
  previousSection: (section: PitchDeckSection) => PitchDeckSection,
  nextSection: (section: PitchDeckSection) => PitchDeckSection,
  allSectionsAssigned: () => boolean,

  /**
   * PDF Deck Founder/Investor Messenger
   */
  isPitchOwner: () => boolean,
  isInvestor: () => boolean,
  isFounder: () => boolean,
  conversationMessageId?: string | null, // active (selected) conversation message id
  setConversationMessageId: (conversationMessageId: string | null) => void,
  getMessageById: (id: string) => ConversationMessage | null,
  groupMessagesByThread: (messages: ConversationMessage[]) => ConversationMessage[][],

  conversation: RouterOutput['pitchDeck']['conversation'],
  setConversation: (conversation: RouterOutput['pitchDeck']['conversation']) => void,
}
