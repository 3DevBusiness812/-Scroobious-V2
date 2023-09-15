import Head from "next/head";
import { Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef, MutableRefObject } from "react";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import { toast, type ToastOptions } from "react-toastify";
import { GoSync } from "react-icons/go";
import { trpc } from "~/utils/trpc";
import AssistantMessage from "./AssistantMessage";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/routers/_app";
import AssistantHeader from "./AssistantHeader";
import TaskOptions from "./TaskOptions";
import TypingEffectBox from "./TypingEffectBox";
import Spinner from "~/components/Spinner";
import { env } from "~/env.mjs";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Message = {
  text: string;
  id: string;
  original: string;
};

export const TOAST_OPTIONS: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  className: "border border-gray-200 rounded shadow-sm",
};

type Props = {
  startup: RouterOutput["startup"]["myStartup"];
};

const LOCAL_STORAGE_KEY = "AI-generated-tiny-descriptions";
const MAX_MSG_COUNT = 5;

const wait = (delayMs: number = 200) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export default function AssistantAI({ startup }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [description, setDescription] = useState(
    startup?.tinyDescription ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const bodyRef = useRef() as MutableRefObject<HTMLElement>;
  const transcriptionIdRef = useRef() as MutableRefObject<string>;

  const router = useRouter();

  const [isVideoTranscribing, setIsVideoTranscribing] = useState(false);
  const [isPitchDeckSummarizing, setIsPitchDeckSummarizing] = useState(false);

  const utils = trpc.useContext();

  const addMessage = (msg: { text: string }) => {
    const text = msg.text.trim();
    const newMessages = [...messages, { text, original: text, id: nanoid() }];
    setMessages(newMessages);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages));
    setDescription(text);
  };

  const updateDescription = async (tinyDescription: string) => {
    await utils.client.startup.updateTinyDescription.mutate({
      id: startup!.id,
      tinyDescription,
    });
  };

  const transcribeVideo: any = async () => {
    setIsVideoTranscribing(true);

    try {
      if ((startup?.video?.transcriptionRaw as { id: string })?.id) {
        await wait(1000);
        throw new Error(`This video has been transcribed`);
      }

      const transcription = await utils.client.startup.transcribeVideo.mutate({
        wistiaId: startup!.video!.wistiaId,
        transcriptionId: transcriptionIdRef.current,
      });
      const { status } = transcription;
      await wait(1000);

      if (["queued", "processing"].includes(status)) {
        transcriptionIdRef.current = transcription.id;
        return transcribeVideo();
      }

      // save transcription after "completed" or "error"-ed
      await utils.client.startup.saveVideoTranscription.mutate({
        videoId: startup!.video!.id,
        transcriptionId: transcription.id,
      });
    } catch (err) {}

    //
    // transcription completed and saved in DB
    // (or sth. went wrong: File does not appear to contain audio etc.)
    setIsVideoTranscribing(false);
    transcriptionIdRef.current = "";
  };

  const summarizePDFPitchDeck = async () => {
    setIsPitchDeckSummarizing(true);

    if (startup?.latestPitchDeck?.id) {
      await utils.client.startup.summarizePitchDeck.mutate({
        id: startup?.latestPitchDeck.id,
      });
    }
    await wait(1000);

    setIsPitchDeckSummarizing(false);
  };

  const onInitGenerateDescription = async () => {
    try {
      await utils.startup.myStartup.invalidate();
      await transcribeVideo();
      await summarizePDFPitchDeck();
      await onGenerateDescription();
    } catch (err) {
      setIsVideoTranscribing(false);
      setIsPitchDeckSummarizing(false);
      setIsGenerating(false);

      await wait(1000);

      toast.error(
        "Something went wrong. Please try again later.",
        TOAST_OPTIONS
      );
    }
  };

  const onSaveDescription = async (e: any) => {
    e.preventDefault();

    setIsSaving(true);
    if (!description || description.length < 50) {
      toast.error(
        "Please provide a valid descrption with at least 50 characters.",
        TOAST_OPTIONS
      );
    } else {
      try {
        await updateDescription(description);
        const toastId = toast.success("Successfully updated description", {
          ...TOAST_OPTIONS,
          autoClose: 3000,
        });
        await wait(2500);

        toast.update(toastId, {
          ...TOAST_OPTIONS,
          render: "Back to Publish Pitch...",
        });
        await wait(2500);
        router.push(`${env.NEXT_PUBLIC_V1_BASE_URL}/founder/publish-pitch`);
      } catch (err) {
        toast.error(
          "Failed updating description. Please try again.",
          TOAST_OPTIONS
        );
      }
    }
    setIsSaving(false);
  };

  const onGenerateDescription = async () => {
    setIsGenerating(true);

    try {
      await wait();

      window.scrollTo({
        behavior: "smooth",
        top: bodyRef.current.scrollHeight + 100,
      });

      const response = await fetch(
        `/api/assistant/prompts/startup-generate-short-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startup }),
        }
      );

      await wait(500);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const { text } = await response.json();

      addMessage({ text });
      setIsGenerating(false);

      await wait();

      window.scrollTo({
        behavior: "smooth",
        top: bodyRef.current.scrollHeight + 100,
      });
    } catch (err) {
      toast.error(
        "Something went wrong. Please try again later.",
        TOAST_OPTIONS
      );
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]");
    setMessages(msgs);
    bodyRef.current = document.body;

    navigator.sendBeacon("/api/assistant/started");
  }, []);

  const isWorking =
    isPitchDeckSummarizing || isVideoTranscribing || isGenerating;

  return (
    <>
      <Head>
        <title>Scroobious+ AI assistant</title>
      </Head>
      <div className="w-full min-h-[calc(100dvh-0px)] flex flex-col bg-white relative pb-20">
        <div className="w-full z-20 h-14 sm:h-8 sticky top-0 flex items-center justify-between bg-gray-50 border border-b-gray-300 shadow-sm text-sm select-none text-gray-300">
          <div className="px-1 flex items-center space-x-1 w-full">
            <div className="h-5 group flex-col flex justify-center sm:flex-row items-center space-x-1 text-xs text-gray-300 hover:text-gray-500 transition-colors relative">
              <img src="/scroobious_logo.png" className="h-full w-auto" />
            </div>
            <div className="flex-1" />
          </div>
        </div>

        <div className="w-full min-h-full flex-1 max-w-6xl px-4 sm:px-6 lg:px-8 z-0 m-auto">
          <div className=" text-sm min-h-full space-y-8 pt-12">
            <AssistantHeader />
            <TaskOptions
              {...{
                isWorking,
                messages,
                onInitGenerateDescription,
              }}
            />

            {messages.map((msg, ix) => (
              <AssistantMessage
                key={msg.text}
                {...{
                  msg,
                  description,
                  isWorking,
                  setMessage: (msg) => setDescription(msg.text),
                }}
              />
            ))}

            <Transition
              as={Fragment}
              show={isVideoTranscribing}
              appear={true}
              enter="transform transition duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transform duration-200 transition ease-in-out delay-1000"
              leaveFrom="opacity-100 rotate-0 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <div className="relative w-full bg-green-50 border border-green-500 shadow-sm h-6 rounded-full text-right flex items-center justify-end">
                <div className="absolute inset-0.5 w-full rounded-full overflow-hidden">
                  <div className="bg-green-600 absolute rounded-full inset-0 animate-shimmer" />
                </div>
                <span className="text-gray-600 text-xs px-4">
                  Processing Video Pitch...
                </span>
              </div>
            </Transition>

            <Transition
              as={Fragment}
              show={isPitchDeckSummarizing}
              appear={true}
              enter="transform transition duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transform duration-200 transition ease-in-out delay-1000"
              leaveFrom="opacity-100 rotate-0 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <div className="relative w-full bg-green-50 border border-green-500 shadow-sm h-6 rounded-full text-right flex items-center justify-end">
                <div className="absolute inset-0.5 w-full rounded-full overflow-hidden">
                  <div className="bg-green-600 absolute rounded-full inset-0 animate-shimmer" />
                </div>
                <span className="text-gray-600 text-xs px-4">
                  Processing Pitch Deck...
                </span>
              </div>
            </Transition>

            <TypingEffectBox {...{ isGenerating }} />

            <Transition
              as={Fragment}
              show={messages.length > 0}
              enter="transform transition duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transform duration-200 transition ease-in-out delay-200"
              leaveFrom="opacity-100 rotate-0 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <form onSubmit={onSaveDescription}>
                <div className="mt-10 relative">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="text-sm flex-1 font-medium leading-10 text-gray-600 cursor-pointer"
                    >
                      Short description
                    </label>
                    <div
                      className={`text-xs text-right sm:text-left text-gray-400 ${
                        description.length < 50
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {description.length} characters
                    </div>
                  </div>
                  <div className="rounded-md overflow-hidden shadow ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                    <textarea
                      id="description"
                      rows={6}
                      disabled={isSaving || isWorking}
                      className="block w-full border-0 bg-transparent resize-none p-2 text-gray-700 bg-gray-50 placeholder:text-gray-400 rounded-md disabled:text-gray-600 disabled:bg-gray-50 customscrollbars"
                      placeholder="Your startup's short description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-5 flex space-x-2 items-center justify-end text-sm text-gray-500">
                  <div className="space-x-2 text-gray-400 relative text-sm flex items-center justify-end">
                    <span className={`text-xs`}>
                      {messages.length} of 5 used
                    </span>
                    <button
                      type="button"
                      disabled={isWorking || messages.length >= MAX_MSG_COUNT}
                      onClick={onInitGenerateDescription}
                      className={`inline-flex items-center text-sm space-x-1 p-2 px-4 text-gray-500 border border-gray-300 shadow-sm hover:text-gray-900 bg-gray-50 enabled:hover:bg-gray-200 disabled:border-gray-200 focus:border-gray-400 rounded-full transition-all ${
                        messages.length >= MAX_MSG_COUNT
                          ? "disabled:text-gray-300"
                          : "disabled:text-gray-400"
                      }`}
                    >
                      <GoSync
                        className={`w-4 ${isWorking ? "animate-spin" : ""}`}
                      />
                      <span>Suggest another</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isWorking || isSaving || description.length < 50}
                    className="transition items-center space-x-1 inline-flex justify-center rounded-full text-gray-600 border border-orange-300 bg-orange-50 py-2 px-4 text-sm font-medium enabled:hover:text-white enabled:hover:border-orange-500 shadow-sm enabled:hover:shadow enabled:hover:bg-orange-600 
                    focus:bg-orange-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 focus:text-white
                     disabled:opacity-50"
                  >
                    {isSaving && <Spinner className="w-4 h-4 fill-current" />}
                    <span>Save description</span>
                  </button>
                </div>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </>
  );
}
