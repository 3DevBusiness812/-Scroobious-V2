import { type RouterOutput } from "~/utils/trpc";
import Link from "next/link";
import ReviewerDropdown from "../ReviewerDropdown";
import Spinner from "../../Spinner";
// import AdminExtraActionsMenu from "./AdminExtraActionsMenu";

type TActionButtonsProps = {
  isMutating: boolean;
  feedback: RouterOutput["pitchWrittenFeedback"]["list"]["items"][number];
  me: RouterOutput["user"]["me"];
  onReviewerAssign: (reviewerId: string) => () => Promise<void>;
  onCompleteFeedback: () => void;
};

const ActionButtons = ({
  feedback,
  me,
  isMutating,
  onReviewerAssign,
  onCompleteFeedback,
}: TActionButtonsProps) => {
  const { status, id, reviewer } = feedback;

  if (status === "REQUESTED" && me?.capabilities?.includes("REVIEWER")) {
    return (
      <button
        disabled={isMutating}
        className="bg-gray-100 px-4 py-2 rounded enabled:hover:bg-gray-200 disabled:opacity-70 flex items-center space-x-1"
        onClick={onReviewerAssign(me.id!)}
      >
        {isMutating && <Spinner className="w-6 h-6" />}
        <span>Claim for Review</span>
      </button>
    );
  }

  // Assign/Reassign feedback to
  if (
    ["ASSIGNED", "REQUESTED"].includes(status) &&
    me?.capabilities?.includes("ADMIN")
  )
    return <ReviewerDropdown {...{ onReviewerAssign, isMutating, feedback }} />;

  if (status === "ASSIGNED" && me?.id === reviewer?.id)
    return (
      <Link
        className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        href={`/written-feedback/${id}`}
      >
        Complete Review
      </Link>
    );

  if (status === "AWAITING_QA" && me?.capabilities?.includes("ADMIN"))
    return (
      <>
        <Link
          className={`bg-gray-100 px-4 py-2 space-x-1 flex items-center rounded ${
            isMutating ? "opacity-70" : "hover:bg-gray-200"
          }`}
          href={`/written-feedback/${id}`}
        >
          {isMutating && <Spinner className="w-6 h-6" />}
          <span>Complete Review</span>
        </Link>
        {/* <AdminExtraActionsMenu {...{ onCompleteFeedback }} /> */}
      </>
    );

  return (
    <Link
      className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
      href={`/written-feedback/${id}`}
    >
      View
    </Link>
  );
};

export default ActionButtons;
