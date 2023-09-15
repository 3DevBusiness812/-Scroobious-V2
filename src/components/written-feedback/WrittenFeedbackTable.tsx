import { trpc } from "~/utils/trpc";
import { z } from "zod";
import { InView } from "react-intersection-observer";
import FeedbackTableRow from "./FeedbackTableRow";
import SkeletonTableRow from "./SkeletonRow";
import EmptyTableRow from "./EmptyTableRow";
import Spinner from "../Spinner";
import { type RouterOutput } from "~/utils/trpc";
import { useState } from "react";
import SortableTableHeadButton from "./SortableTableHeadButton";

const validStatuses = [
  "COMPLETE",
  "ASSIGNED",
  "REQUESTED",
  "AWAITING_QA",
  "DRAFT",
] as const;

const querySchema = z.object({
  value: z.enum(validStatuses),
});

type TWrittenFeedbackTableProps = {
  filterOption: {
    name: string;
    description: string;
    value?: string;
  };
  me: RouterOutput["user"]["me"];
};

type TOrderBy = "founder" | "status" | "reviewer" | undefined;

export default function WrittenFeedbackTable({
  filterOption,
  me,
}: TWrittenFeedbackTableProps) {
  const { value } = filterOption.value
    ? querySchema.parse(filterOption)
    : { value: null };

  const [orderBy, setOrderBy] = useState<TOrderBy>();
  const [orderDir, setOrderDir] = useState<-1 | 1>(-1);

  const setOrderCol = (col: TOrderBy) => {
    setOrderBy(col);
    setOrderDir(orderDir === 1 ? -1 : 1);
  };

  const query = trpc.pitchWrittenFeedback.list.useInfiniteQuery(
    {
      limit: 10,
      status: value,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const pitchWrittenFeedbacks = query.data?.pages
    .flatMap((page) => page.items)
    .sort((a, b) => {
      switch (true) {
        case orderBy === "founder":
          return a.pitch.user.name > b.pitch.user.name ? orderDir : -orderDir;
        case orderBy === "reviewer":
          return a.reviewer?.name! > b.reviewer?.name! ? orderDir : -orderDir;
        case orderBy === "status":
          return a.status > b.status ? orderDir : -orderDir;
        default:
          return a.createdAt > b.createdAt ? orderDir : -orderDir;
      }
    });

  return (
    <div className="w-full">
      <div className="mt-8 flex flex-col w-full">
        <div className="w-full">
          <div className="inline-block min-w-full w-full py-2 align-middle">
            <div className="w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
              <table className="min-w-full w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-4 sm:pl-6 text-left">
                      <SortableTableHeadButton
                        {...{
                          title: "Founder",
                          onSort: () => setOrderCol("founder"),
                          disabled: !pitchWrittenFeedbacks?.length,
                          activeOrderCol: orderBy === "founder",
                          orderDir,
                        }}
                      />
                    </th>

                    <th scope="col" className="px-3 py-3 text-left">
                      <SortableTableHeadButton
                        {...{
                          title: "Status",
                          onSort: () => setOrderCol("status"),
                          disabled: !pitchWrittenFeedbacks?.length,
                          activeOrderCol: orderBy === "status",
                          orderDir,
                        }}
                      />
                    </th>
                    <th scope="col" className="px-3 py-3 text-left">
                      <SortableTableHeadButton
                        {...{
                          title: "Reviewer",
                          onSort: () => setOrderCol("reviewer"),
                          disabled: !pitchWrittenFeedbacks?.length,
                          activeOrderCol: orderBy === "reviewer",
                          orderDir,
                        }}
                      />
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3 pr-4 sm:pr-6 text-xs font-medium uppercase tracking-wide text-gray-500 text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {query.isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, ix) => <SkeletonTableRow key={ix} />)
                  ) : pitchWrittenFeedbacks?.length ? (
                    pitchWrittenFeedbacks.map((feedback) => (
                      <FeedbackTableRow
                        key={feedback.id}
                        feedback={feedback}
                        me={me}
                      />
                    ))
                  ) : (
                    <EmptyTableRow />
                  )}
                </tbody>
              </table>
            </div>
            <div className="py-4 text-right">
              <InView
                onChange={(inView, entry) => {
                  if (inView && query.hasNextPage && !query.isFetchingNextPage)
                    query.fetchNextPage();
                }}
              >
                <button
                  disabled={!query.hasNextPage}
                  onClick={() => query.fetchNextPage()}
                  className="inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm enable:hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {query.isFetchingNextPage && (
                    <Spinner className="w-5 h-5 mr-1" />
                  )}
                  {query.hasNextPage ? "Load More" : "No More Results"}
                </button>
              </InView>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
