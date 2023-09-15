import { trpc, type RouterOutput } from "~/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/router";
import ActionButtons from "./ActionButtons";
import { feedbackStatusCodeNameMap } from "./FilterFeedbackStatusDropdown";

type TFeedbackItem =
  RouterOutput["pitchWrittenFeedback"]["list"]["items"][number];

type TReviewerTableRowProps = {
  feedback: TFeedbackItem;
  me: RouterOutput["user"]["me"];
};

const FeedbackStatus = ({ status }: TFeedbackItem) => {
  const colors =
    status === "COMPLETE"
      ? "bg-gray-100 text-gray-800"
      : status === "AWAITING_QA"
      ? "bg-yellow-100 text-yellow-800"
      : status === "ASSIGNED"
      ? "bg-blue-100 text-blue-800"
      : status === "REQUESTED"
      ? "bg-green-100 text-green-800"
      : status === "DRAFT"
      ? "bg-rose-100 text-rose-800"
      : "bg-transparent";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors}`}
    >
      {feedbackStatusCodeNameMap[status] ?? ""}
    </span>
  );
};

export default function FeedbackTableRow({
  feedback,
  me,
}: TReviewerTableRowProps) {
  const [isMutating, setIsMutating] = useState(false);

  const utils = trpc.useContext();
  const router = useRouter();

  const assignWrittenFeedbackMutation =
    trpc.pitchWrittenFeedback.assignWrittenFeedback.useMutation({
      onSuccess(feedback) {
        utils.pitchWrittenFeedback.list.invalidate();
        setIsMutating(false);

        if (feedback?.reviewer?.id === me?.id) {
          router.push(`/written-feedback/${feedback?.id}`);
        }
      },
    });

  const completeFeedbackMutation =
    trpc.pitchWrittenFeedback.completeFeedback.useMutation({
      onSuccess() {
        utils.pitchWrittenFeedback.list.invalidate();
        setIsMutating(false);
      },
    });

  const onReviewerAssign = (reviewerId: string) => async () => {
    setIsMutating(true);

    assignWrittenFeedbackMutation.mutate({
      id: feedback.id,
      reviewerId,
    });
  };

  const onCompleteFeedback = async () => {
    setIsMutating(true);

    completeFeedbackMutation.mutate({
      id: feedback.id,
    });
  };

  return (
    <tr key={feedback.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <div className="flex items-center">
          <div className="flex shrink-0 w-12 h-12">
            <img
              className="w-full h-full object-cover rounded-full"
              src={feedback.pitch.user.profilePicture.url}
              alt={feedback.pitch.user.name}
            />
          </div>
          <div className="min-w-0 flex-1 px-4">{feedback.pitch.user.name}</div>
        </div>
      </td>
      <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}>
        <FeedbackStatus {...feedback} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {feedback.status === "REQUESTED" ? (
          <span className="text-gray-400 italic text-sm">Unassigned</span>
        ) : (
          feedback.reviewer?.name ?? (
            <span className="text-gray-400 italic text-sm">N/A</span>
          )
        )}
      </td>
      <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex items-center space-x-2 justify-end w-full">
          <ActionButtons
            {...{
              feedback,
              me,
              onReviewerAssign,
              onCompleteFeedback,
              isMutating,
            }}
          />
        </div>
      </td>
    </tr>
  );
}
