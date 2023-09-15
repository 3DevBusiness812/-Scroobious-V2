import { useEffect } from "react";
import { trpc } from "~/utils/trpc";
import { useStore, type Annotation } from "./state";

type TInitialAnnotationLoaderProps = {
  pitchWrittenFeedbackId: string;
};

const InitialAnnotationLoader = ({
  pitchWrittenFeedbackId,
}: TInitialAnnotationLoaderProps) => {
  const setAnnotation = useStore((s) => s.setAnnotation);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const setIsFeedbackSidebar = useStore((state) => state.setIsFeedbackSidebar);

  const utils = trpc.useContext();

  const loadInitialComments = async () => {
    const feedback =
      await utils.client.pitchWrittenFeedback.feedbackComments.query({
        pitchWrittenFeedbackId,
      });

    setIsFeedbackSidebar(true);

    const annotations =
      feedback?.pitchWrittenFeedbackComments.map(
        (comment) =>
          ({
            ...(comment.details as any),
            commentVersion: comment,
          } as Annotation)
      ) ?? [];

    try {
      annotations.map((annotation) => addAnnotation(annotation, true));
    } catch (err) {}
    setAnnotation(null);
  };

  useEffect(() => {
    loadInitialComments();
  }, []);

  return <></>;
};

export default InitialAnnotationLoader;
