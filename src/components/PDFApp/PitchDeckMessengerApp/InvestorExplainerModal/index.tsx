import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export type TProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function InvestorExplainerModal({ open, setOpen }: TProps) {
  const onSetShowNoMore = () => {
    localStorage.setItem("dontShowInvestorExplainer", "yes");
    setOpen(false);
  };
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
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

          <div className="fixed inset-0">
            <div className="h-full w-full flex items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-full flex flex-col max-w-5xl max-h-[830px] transform rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Ask Founders questions directly from the pitch deck
                  </Dialog.Title>
                  <div className="mt-8">
                    <p className="text-sm text-gray-500">
                      Select an area of a slide to ask the founder a question.
                      You can stay anonymous, or reveal your identity if you so
                      choose. When founders respond, you will receive an email
                      notification with a link back to their comment.
                    </p>
                  </div>

                  <div className="mt-8 flex-1 overflow-hidden flex items-center justify-center">
                    <video
                      controls={false}
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="h-full w-auto"
                    >
                      <source
                        src="/pdf_deck_explainer-960_576.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="mt-8 flex justify-end space-x-2 text-sm text-gray-500">
                    <button
                      onClick={onSetShowNoMore}
                      className="transition space-x-2 inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium hover:text-gray-600 focus:text-gray-600 shadow-sm hover:shadow hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 text-white"
                    >
                      Don't show this again
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="transition space-x-2 inline-flex justify-center rounded border border-orange-500 bg-orange-600 py-2 px-4 text-sm font-medium hover:text-gray-600 focus:text-gray-600 shadow-sm hover:shadow hover:bg-orange-50 focus:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 text-white"
                    >
                      Got it
                    </button>
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
