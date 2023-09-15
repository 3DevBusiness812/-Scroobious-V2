import { trpc, type RouterOutput } from "~/utils/trpc";
import Spinner from "../Spinner";

type TReviewerDropdownProps = {
  isMutating: boolean;
  feedback: RouterOutput["pitchWrittenFeedback"]["list"]["items"][number];
  onReviewerAssign: (reviewerId: string) => () => Promise<void>;
};

export default function ReviewerDropdown({
  onReviewerAssign,
  isMutating,
  feedback,
}: TReviewerDropdownProps) {
  const { isFetched, data: reviewers } = trpc.user.listReviewers.useQuery({});
  const { status, id, reviewer } = feedback;

  return isFetched ? (
    <span className="flex rounded-md shadow-sm items-center">
      <label htmlFor="reviewers-list" className="sr-only">
        Assign to reviewer
      </label>
      {isMutating ? (
        <span className="-ml-px flex w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Spinner className="w-5 h-5 mr-1" />
          Assigning Feedback...
        </span>
      ) : (
        <select
          id="reviewers-list"
          onChange={(e) => {
            onReviewerAssign(e.target.value)();
          }}
          name="reviewers-list"
          className="-ml-px block w-full rounded border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <>
            <option>
              {status === "REQUESTED"
                ? "Assign Feedback to..."
                : "Reassign Feedback to..."}
            </option>
            {reviewers
              ?.filter(
                ({ id }) => status === "REQUESTED" || id !== reviewer?.id
              )
              .map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.name}
                </option>
              ))}
          </>
        </select>
      )}
    </span>
  ) : null;
}
