import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { env } from "~/env.mjs";
import { RouterOutput } from "~/utils/trpc";

type ModalSuccessStatusProps = {
  isOpen: boolean;
  pitch: RouterOutput["pitch"]["byId"];
  closeModal: () => void;
};

export default function ModalSuccessStatus({ isOpen, closeModal, pitch }: ModalSuccessStatusProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Feedback submitted
                  </Dialog.Title>
                  <div className="mt-8">
                    <p className="text-sm text-gray-500">
                      Your feedback has been successfully submitted. Thank you for your time!
                    </p>
                  </div>

                  <div className="mt-8 flex justify-end space-x-2 text-sm text-gray-500">
                    <Link
                      className="transition space-x-2 inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium hover:text-gray-600 focus:text-gray-600 shadow-sm hover:shadow hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 text-white"
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches/${pitch?.id}`}
                    >
                      Back to pitch
                    </Link>
                    <Link
                      className="transition space-x-2 inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium hover:text-gray-600 focus:text-gray-600 shadow-sm hover:shadow hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 text-white"
                      href={`${env.NEXT_PUBLIC_V1_BASE_URL}/investor/pitches/recommended`}
                    >
                      Explore all pitches
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
