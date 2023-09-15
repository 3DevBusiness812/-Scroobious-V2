import { useState, useEffect } from "react";
import { trpc, type RouterOutput } from "~/utils/trpc";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { env } from "~/env.mjs";

export default function ErrorMessage() {
  return (
    <div className="w-full min-h-[calc(100dvh-0px)] flex flex-col items-center justify-center bg-gray-100">
      <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Pitch not found
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                The pitch you are looking for does not exist.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-center">
          <Link
            className="transition inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium hover:text-gray-600 focus:text-gray-600 shadow-sm hover:shadow hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 text-white"
            href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches`}
          >
            Back to pitches
          </Link>
        </div>
      </div>
    </div>
  );
}
