import Link from "next/link";
import { env } from "~/env.mjs";
import { RouterOutput } from "~/utils/trpc";

type Props = {
  pitch: RouterOutput["pitch"]["byId"];
};

const Toolbar = ({ pitch }: Props) => {
  return (
    <div className="w-full z-20 h-14 sm:h-8 sticky top-0 flex items-center justify-between bg-gray-50 border border-b-gray-300 shadow-sm text-sm select-none text-gray-300">
      <div className="px-1 flex items-center space-x-1 w-full">
        <div className="h-5 group flex-col w-full flex justify-center sm:flex-row items-center space-x-1 text-xs text-gray-300 hover:text-gray-500 transition-colors relative">
          <img src="/scroobious_logo.png" className="h-full w-auto" />

          <nav className="flex w-full" aria-label="Breadcrumb">
            <ol role="list" className="flex text-xs items-center justify-center sm:justify-start w-full space-x-1">
              <li className="shrink-0">
                <div>
                  <Link
                    href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches`}
                    className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                  >
                    All Pitches
                  </Link>
                </div>
              </li>
              <li className="shrink truncate">
                <div className="flex items-center truncate">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <Link
                    href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches/${pitch?.id}`}
                    className="ml-2 font-medium text-gray-500 hover:text-gray-700 truncate"
                    title={pitch?.organization.startup?.name ?? ""}
                  >
                    {pitch?.organization.startup?.name}
                  </Link>
                </div>
              </li>
              <li className="shrink-0">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-2 font-medium text-gray-500">
                    Pitch Feedback
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
