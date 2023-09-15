import {
  useState,
  useRef,
  type ChangeEvent,
  type MutableRefObject,
} from "react";
import { toast, type ToastOptions } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import { updateProfileInput as formSchema } from "~/server/input";

type FormSchemaType = z.infer<typeof formSchema>;

const TOAST_OPTIONS: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  className: "border border-gray-200 rounded shadow-sm",
};

export default function ProfileTab() {
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const fileMobRef = useRef() as MutableRefObject<HTMLInputElement>;
  const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { data: me } = trpc.user.me.useQuery();

  const utils = trpc.useContext();

  const onUploadProfilePicture = async (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.currentTarget.files
      ? Array.from(e.currentTarget.files)
      : [];

    if (!file) return;

    setIsPictureUploading(true);

    try {
      const signedUrl =
        await utils.client.accountSettings.getSignedUploadUrl.mutate({
          fileName: file.name,
        });
      const [url] = signedUrl.split("?");

      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });

      if (!url) throw new Error(`Invalid Image URL`);

      await utils.client.accountSettings.updateProfilePicture.mutate({ url });
      await utils.user.me.invalidate();

      toast.success("Profile picture successfully updated", TOAST_OPTIONS);
    } catch (err) {
      toast.error(
        "Failed updating profile picture. Please try again later.",
        TOAST_OPTIONS
      );
    }
    setIsPictureUploading(false);
    fileMobRef.current.value = "";
    fileRef.current.value = "";
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (d) => {
    try {
      await utils.client.accountSettings.updateProfile.mutate(d);
      await utils.user.me.invalidate();
      toast.success("Profile successfully updated", TOAST_OPTIONS);
    } catch (err) {
      toast.error(
        "Failed updating your profile. Please try again later",
        TOAST_OPTIONS
      );
    }
  });

  return (
    <div id="profile-tab">
      <form className="w-full divide-y divide-gray-200" onSubmit={onSubmit}>
        <div className="py-6 px-4 sm:p-6 lg:pb-8">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your public profile information.
            </p>
          </div>

          <div className="mt-6 flex flex-col lg:flex-col">
            <div className="mb-6 flex-grow lg:flex-shrink-0 lg:flex-grow-0 ">
              <p
                className="text-sm mb-2 font-medium text-gray-700"
                aria-hidden="true"
              >
                Profile picture
              </p>
              <div className="mt-1 lg:hidden">
                <div className="flex items-center">
                  <div
                    className="inline-block h-24 w-24 flex-shrink-0 overflow-hidden rounded-full shadow-sm"
                    aria-hidden="true"
                  >
                    {me?.profilePicture?.url ? (
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={me?.profilePicture?.url}
                        alt=""
                      />
                    ) : (
                      <svg
                        className="text-gray-200 rounded-full w-full h-full dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="ml-5 rounded shadow-sm cursor-pointer">
                    <div className="group relative flex items-center justify-center rounded border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                      <label
                        htmlFor="mobile-user-photo"
                        className="pointer-events-none inline-flex space-x-1 relative text-sm font-medium leading-4 text-gray-700"
                      >
                        {isPictureUploading && <Spinner className="w-4 h-4" />}
                        <span>Change</span>
                        <span className="sr-only"> user photo</span>
                      </label>
                      <input
                        id="mobile-user-photo"
                        name="user-photo"
                        disabled={isPictureUploading}
                        type="file"
                        ref={fileMobRef}
                        onChange={onUploadProfilePicture}
                        className="absolute h-full w-full cursor-pointer rounded border-gray-300 opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative hidden overflow-hidden rounded-full lg:block">
                <div className="w-40 h-40 rounded-full relative">
                  <div className="w-40 h-40 rounded-full relative">
                    {me?.profilePicture?.url ? (
                      <img
                        className="w-full h-full object-cover rounded-full shadow-sm"
                        src={me?.profilePicture?.url}
                        alt=""
                      />
                    ) : (
                      <svg
                        className="text-gray-200 rounded-full w-full h-full dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <label
                    htmlFor="desktop-user-photo"
                    className={`absolute inset-0 rounded-full flex space-x-1 h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white focus-within:opacity-100 hover:opacity-100 ${
                      isPictureUploading ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {isPictureUploading ? (
                      <Spinner className="w-6 h-6 fill-white" />
                    ) : (
                      <span>Change</span>
                    )}
                    <span className="sr-only"> user photo</span>
                    <input
                      type="file"
                      id="desktop-user-photo"
                      name="user-photo"
                      title="Select Profile Picture"
                      ref={fileRef}
                      disabled={isPictureUploading}
                      onChange={onUploadProfilePicture}
                      className="absolute inset-0 h-full w-full cursor-pointer rounded-full border-gray-300 opacity-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            <span>
              {/* <div className="flex-grow space-y-6">
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    LinkedIn Profile URL
                  </label>
                  <div className="mt-1 flex rounded shadow-sm">
                    <label
                      htmlFor="linkedin"
                      className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                    >
                      https://linkedin.com/in/
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      autoComplete="linkedin"
                      className="block w-full min-w-0 flex-grow rounded-none rounded-r border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Twitter Profile URL
                  </label>
                  <div className="mt-1 flex rounded shadow-sm">
                    <label
                      htmlFor="twitter"
                      className="inline-flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                    >
                      https://twitter.com/
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      autoComplete="twitter"
                      className="block w-full min-w-0 flex-grow rounded-none rounded-r border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                </div>
              </div> */}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-6 space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 flex rounded shadow-sm">
                <input
                  type="text"
                  id="name"
                  disabled={isSubmitting}
                  {...register("name")}
                  autoComplete="name"
                  className="block w-full min-w-0 flex-grow rounded border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm disabled:opacity-50"
                  defaultValue={me?.name}
                />
              </div>
            </div>

            {/*
          <EtnicityDropdown />
          <GenderDropdown />
          <PreferredPronounsDropdown />
          <LocationDropdown />
          */}
          </div>

          <div className="mt-4 flex justify-start py-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`transition space-x-2 inline-flex justify-center rounded border border-green-600 py-2 px-4 text-sm font-medium enabled:hover:text-white focus:text-white shadow-sm enabled:hover:shadow enabled:hover:bg-green-600 focus:bg-green-600 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-75 ${
                isSubmitting
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-gray-600"
              }`}
            >
              {isSubmitting && <Spinner className="w-5 h-5 fill-current" />}
              <span>Update profile</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
