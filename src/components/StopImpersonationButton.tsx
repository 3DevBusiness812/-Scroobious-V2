import { useSession } from "next-auth/react";
import { useState } from "react";
import { EyeSlashIcon } from "@heroicons/react/20/solid";
import Spinner from "./Spinner";

export default function StopImpersonationButton() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session?.impersonatingFromUserId) {
    return <></>;
  }

  return (
    <div className="fixed bottom-2 left-2">
      <form
        method="POST"
        action="/api/auth/impersonate/stop"
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitting(true);
          e.currentTarget.submit();
        }}
      >
        <button
          type="submit"
          className="p-2 bg-black/10 hover:bg-black/0 rounded-full border border-orange-400 text-orange-400 hover:border-orange-500 hover:text-orange-500 relative group"
        >
          {isSubmitting ? (
            <Spinner className="w-4 h-4 fill-current" />
          ) : (
            <EyeSlashIcon className="w-4 h-4" />
          )}
          <div
            className={`focus:ring-0 focus-within:ring-0 focus:border-transparent focus-within:border-transparent focus:outline-0 origin-top-right absolute py-1 px-2.5 rounded shadow-sm bg-white border text-gray-700 z-30 transition duration-0 delay-0 group-hover:ease-in group-hover:duration-100 group-hover:visible group-hover:scale-100 ease-out duration-100 opacity-0 group-hover:opacity-100 scale-95 invisible left-full ml-1 top-1/2 -translate-y-1/2 `}
          >
            <div className="py-1 cursor-default" role="none">
              <span className="space-y-1">
                <span className="opacity-90 text-center text-sm block whitespace-nowrap">
                  Stop impersonating {session?.user.name}
                </span>
              </span>
            </div>
          </div>
        </button>
      </form>
    </div>
  );
}
