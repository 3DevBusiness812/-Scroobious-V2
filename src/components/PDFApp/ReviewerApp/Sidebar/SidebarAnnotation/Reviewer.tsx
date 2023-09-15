import { useState, useEffect, useRef, MutableRefObject, useMemo } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { withReact, ReactEditor } from "slate-react";
import {
  GoTrashcan,
  GoPencil,
  GoReply,
  GoUnfold,
  GoFold,
  GoX,
  GoComment,
} from "react-icons/go";
import { trpc } from "~/utils/trpc";
import { nanoid } from "nanoid";
import AnnotationDate from "../AnnotationDate";
import { renderContent, useIsClampable } from "../helpers";
import { useStore, type Annotation, type NewAnnotation } from "../../../state";
import Spinner from "~/components/PDFApp/Spinner";
import { scrollAnimateTo } from "../../../helpers";
import Popover from "~/components/Popover";
import CommentEditor from "./CommentEditor";

type TAnnotationProps = {
  annotation: Annotation;
  sidebarScrollWrapperRef: MutableRefObject<HTMLDivElement>;
  annotations: Annotation[];
  pageIx: number;
};

const emptyEditor = [
  {
    // @ts-ignore
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ReviewerSidebarAnnotation = ({
  annotation,
  sidebarScrollWrapperRef,
  annotations,
  pageIx,
}: TAnnotationProps) => {
  const selectedAnnotation = useStore((s) => s.selectedAnnotation);
  const setAnnotation = useStore((s) => s.setAnnotation);
  const currentScale = useStore((s) => s.currentScale);
  const isReviewer = useStore((s) => s.isReviewer);
  const isL2Reviewer = useStore((s) => s.isL2Reviewer);
  const deleteAnnotation = useStore((s) => s.deleteAnnotation);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const editEnabled = useStore((s) => s.computed.editEnabled);
  const me = useStore((s) => s.me);
  const updateAnnotation = useStore((s) => s.updateAnnotation);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [deletingIdV, setDeletingIdV] = useState<string | null>(null);
  const [updatingIdV, setUpdatingIdV] = useState<string | null>(null);
  const [addingIdV, setAddingIdV] = useState<string | null>(null);

  const changeReasonRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const updateMutation =
    trpc.pitchWrittenFeedback.updateFeedbackComment.useMutation({
      onSuccess(comment) {
        setUpdatingIdV(null);
        const { details, ...rest } = comment;
        const commentDetails = details as any as Annotation;

        updateAnnotation({
          ...annotation,
          ...commentDetails,
          // @ts-ignore
          commentVersion: rest,
        });

        setAnnotation(null);
      },
    });

  const isMine = annotation.commentVersion.author.id === me?.id;
  const showAsReviewerFeedback =
    annotation.commentVersion.v > 1 ||
    (!isMine && isReviewer()) ||
    (isMine && isL2Reviewer());

  const contentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>;

  const utils = trpc.useContext();

  const onUpdate = async () => {
    const { commentVersion, ...rest } = annotation;
    setUpdatingIdV(commentVersion.id + commentVersion.v);

    const data = {
      details: { ...rest, comment: editor.children },
      ...(changeReasonRef.current?.value && {
        changeReason: changeReasonRef.current.value,
      }),
    };

    updateMutation.mutate({
      id: commentVersion.id,
      v: commentVersion.v,
      data,
    });
  };

  const deleteComment = async (annotation: Annotation) => {
    try {
      const { id, v } = annotation.commentVersion;
      setDeletingIdV(id + v);
      await utils.client.pitchWrittenFeedback.deleteFeedbackComment.mutate({
        id,
        v,
      });
      deleteAnnotation(annotation);
    } catch (e) {}

    setDeletingIdV(null);
  };

  const addCommentVersion = async (
    { rects, text, imgSrc, comment, commentVersion: { id, v } }: Annotation,
    isDelete = false
  ) => {
    const details = {
      // comment: [],
      comment,
      id: nanoid(),
      text,
      imgSrc,
      type: "text",
      createdAt: new Date().toISOString(),
      rects: rects.map((rect) => ({
        ...rect,
        id: nanoid(),
      })),
    };

    try {
      if (isDelete) setDeletingIdV(id + v);
      else setAddingIdV(id + v);

      const commentVersion =
        await utils.client.pitchWrittenFeedback.reviewFeedbackCommentVersion.mutate(
          {
            id,
            v,
            isDelete,
            data: { details },
          }
        );

      addAnnotation({
        ...details,
        commentVersion,
      } as NewAnnotation);
    } catch (e) {}

    if (isDelete) setDeletingIdV(null);
    else setAddingIdV(null);
  };

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

    if (
      selectedAnnotation?.id === annotation.id &&
      editEnabled &&
      isMine &&
      !selectedAnnotation?.commentVersion.deletedAt
    ) {
      editor.children = selectedAnnotation?.comment?.length
        ? selectedAnnotation.comment
        : emptyEditor;

      // setTimeout(() => {
      //   try {
      //     ReactEditor.focus(editor);
      //     Transforms.select(editor, Editor.end(editor, []));
      //   } catch (e) {}
      // }, 50);
      try {
        ReactEditor.focus(editor);
        Transforms.select(editor, Editor.end(editor, []));
      } catch (e) {}
    }
  }, [selectedAnnotation]);

  return (
    <>
      {showAsReviewerFeedback && annotations.length > 1 && (
        <div className="w-full">
          <div className="w-full h-px bg-gray-200" />
        </div>
      )}
      <div
        ref={wrapperRef}
        onClick={(e) => {
          e.preventDefault();
          setAnnotation(annotation);
        }}
        className={`px-4 py-6 pb-4 sm:px-6 transition-colors cursor-pointer ${
          selectedAnnotation?.id === annotation.id
            ? "bg-gray-100 hover:bg-gray-100 scale-100"
            : "hover:bg-gray-100"
        }`}
      >
        <div className={`flex space-x-1 w-full items-start`}>
          <div className={`w-full`}>
            <div className="text-sm flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {showAsReviewerFeedback && annotations.length > 1 && (
                  <div className="my-2">
                    <GoReply className="w-4 h-4 text-gray-400 rotate-180" />
                  </div>
                )}
                <div className="w-10 h-10">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={annotation.commentVersion.author.profilePicture.url}
                    alt={annotation.commentVersion.author.name}
                  />
                </div>
                <div className="font-medium text-gray-900 flex-1">
                  {annotation.commentVersion.author.name}
                  <span className="block">
                    <AnnotationDate createdAt={annotation.createdAt} />
                  </span>
                </div>
              </div>

              {isMine && (
                <div className="space-x-1 flex items-center">
                  {(editEnabled || isL2Reviewer()) && (
                    <button
                      type="button"
                      disabled={
                        deletingIdV ===
                        annotation.commentVersion.id +
                          annotation.commentVersion.v
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteComment(annotation);
                      }}
                      className={`cursor-pointer flex items-center p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
                    >
                      {deletingIdV ===
                      annotation.commentVersion.id +
                        annotation.commentVersion.v ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <GoTrashcan className="h-4 w-4" />
                          <span className="text-xs">
                            <Popover x="align-right" y="top">
                              <span className="space-y-1">
                                <span className="opacity-90 text-center block whitespace-nowrap">
                                  Delete comment
                                </span>
                              </span>
                            </Popover>
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-1 text-sm text-gray-700">
              {annotation.commentVersion.deletedAt && (
                <small
                  title={annotation.text}
                  className="text-sm block text-gray-500 italic pt-4"
                >
                  Deleted
                </small>
              )}

              <div ref={contentRef}>
                {(!isMine ||
                  selectedAnnotation?.id !== annotation.id ||
                  !editEnabled) && (
                  <div className="py-4 relative">
                    <div className={`${isCollapsed ? "line-clamp-6" : ""}`}>
                      {!annotation.commentVersion.deletedAt &&
                        renderContent(annotation.comment as any)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm flex w-full justify-between">
              {isClampable ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCollapsed(!isCollapsed);
                  }}
                  className={`cursor-pointer flex items-center p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
                >
                  {isCollapsed ? (
                    <>
                      <GoUnfold className="h-4 w-4" />
                      <span className="text-xs">
                        <Popover x="align-left" y="top">
                          <span className="space-y-1">
                            <span className="opacity-90 text-center block whitespace-nowrap">
                              Expand comment
                            </span>
                          </span>
                        </Popover>
                      </span>
                    </>
                  ) : (
                    <>
                      <GoFold className="h-4 w-4" />
                      <span className="text-xs">
                        <Popover x="align-left" y="top">
                          <span className="space-y-1">
                            <span className="opacity-90 text-center block whitespace-nowrap">
                              Collapse comment
                            </span>
                          </span>
                        </Popover>
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <span />
              )}

              {isL2Reviewer() && annotations.length < 2 && !isMine && (
                <div className="space-x-1 flex items-center">
                  <button
                    type="button"
                    disabled={
                      deletingIdV ===
                      annotation.commentVersion.id + annotation.commentVersion.v
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addCommentVersion(annotation, true);
                    }}
                    className={`cursor-pointer flex items-center p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
                  >
                    {deletingIdV ===
                    annotation.commentVersion.id +
                      annotation.commentVersion.v ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <>
                        <GoX className="h-4 w-4" />
                        <span className="text-xs">
                          <Popover x="align-right" y="top">
                            <span className="space-y-1">
                              <span className="opacity-90 text-center block whitespace-nowrap">
                                Remove Reviewer's comment
                              </span>
                            </span>
                          </Popover>
                        </span>
                      </>
                    )}
                  </button>

                  <div className="space-x-1 flex items-center">
                    <button
                      type="button"
                      disabled={
                        addingIdV ===
                        annotation.commentVersion.id +
                          annotation.commentVersion.v
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addCommentVersion(annotation);
                      }}
                      className={`cursor-pointer flex items-center p-1 rounded text-gray-500 hover:bg-white border border-transparent hover:border-orange-200 hover:text-gray-700 group relative focus:ring-0 focus:outline-0 focus:border-orange-200 focus:bg-white`}
                    >
                      {addingIdV ===
                      annotation.commentVersion.id +
                        annotation.commentVersion.v ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <GoPencil className="h-4 w-4" />
                          <span className="text-xs">
                            <Popover x="align-right" y="top">
                              <span className="space-y-1">
                                <span className="opacity-90 text-center block whitespace-nowrap">
                                  Change Reviewer's comment
                                </span>
                              </span>
                            </Popover>
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {editEnabled && isMine && (
              <div
                className={`w-full ${
                  annotation.id === selectedAnnotation?.id
                    ? "visible space-y-4 py-2"
                    : "invisible h-0 overflow-hidden"
                }`}
              >
                {!annotation.commentVersion.deletedAt && (
                  <CommentEditor editor={editor} />
                )}

                {isL2Reviewer() && (
                  <div className="w-full">
                    <textarea
                      ref={changeReasonRef}
                      id={`change-reason-${annotation.id}`}
                      name={`change-reason-${annotation.id}`}
                      rows={3}
                      placeholder="Provide details for changing Reviewer's comment..."
                      className="block w-full rounded-sm shadow-sm border border-gray-300 focus:shadow-md focus:border-gray-400 focus:ring-0 text-sm p-2 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
                      defaultValue={
                        annotation.commentVersion.changeReason ?? ""
                      }
                      onClick={(e) => {
                        setAnnotation(annotation, false, true);
                        e.stopPropagation();
                      }}
                    />
                  </div>
                )}
                <div className="flex w-full justify-end space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAnnotation(null);
                    }}
                    className="flex items-center justify-center shadow rounded-sm border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700 enabled:hover:bg-white focus:shadow-md focus:border-gray-400 focus:ring-0 focus:outline-0 disabled:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onUpdate}
                    disabled={
                      updatingIdV ===
                      annotation.commentVersion.id + annotation.commentVersion.v
                    }
                    className="flex items-center justify-center rounded-sm border bg-orange-100 border-orange-300 px-4 py-2 text-sm font-medium text-gray-600 shadow enabled:hover:bg-orange-50 enabled:hover:border-orange-300 focus:shadow-md focus:border-orange-400 focus:ring-0 focus:outline-0 enabled:hover:text-gray-700 disabled:opacity-70"
                  >
                    {updatingIdV ===
                      annotation.commentVersion.id +
                        annotation.commentVersion.v && (
                      <Spinner className="h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            )}

            {isReviewer() &&
              !isMine &&
              annotation.commentVersion.changeReason && (
                <div className="w-full mt-4 flex items-start space-x-2 text-xs text-gray-500 mr-2 italic">
                  <GoComment className="w-4 h-4" />
                  <span className="flex-1">
                    {annotation.commentVersion.changeReason}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewerSidebarAnnotation;
