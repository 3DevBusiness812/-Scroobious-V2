import { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast, type ToastOptions } from "react-toastify";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import { resetPasswordInput as formSchema } from "~/server/input";

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

export default function PasswordResetPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const token = (router.query.token ?? "") as string;

  const isValidResetToken = trpc.auth.isValidResetToken.useQuery({ token });
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (d) => {
    setIsSuccess(false);

    try {
      const success = await utils.client.auth.resetPassword.mutate({
        ...d,
      });

      if (success) {
        toast.success("Your password has been updated", TOAST_OPTIONS);
        setIsSuccess(true);
      } else {
        toast.error("The password reset link has expired.", TOAST_OPTIONS);
      }
    } catch (err) {
      toast.error("Something went wrong", TOAST_OPTIONS);
    }
  });

  return (
    <>
      <Head>
        <title>Reset your password</title>
      </Head>
      <div className="h-screen md:grid md:grid-cols-2 gap-0">
        <div
          className="bg-cover bg-center bg-no-repeat w-0 md:w-full h-0 md:h-full"
          style={{
            backgroundImage: "url(/login_bg.png)",
          }}
        />
        <div className="h-full flex-col flex py-12">
          <div className="space-y-6 flex-col flex p-6 items-center sm:mb-32">
            <Link href="/" className="">
              <img
                className="max-w-[225px] max-h-[100px] w-auto h-auto"
                loading="eager"
                src="/scroobious_logo.png"
                alt="Scroobious"
              />
            </Link>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Reset your password
            </h2>

            {!isValidResetToken.data && isValidResetToken.isFetched ? (
              <p className="mx-auto w-full max-w-md px-4 sm:px-10">
                The password reset link is expired or invalid.
              </p>
            ) : !isSuccess ? (
              <>
                <div className="mx-auto w-full max-w-md">
                  <div className="bg-white px-4 sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                      <input
                        type="hidden"
                        defaultValue={token}
                        id="token"
                        {...register("token")}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            className={`block w-full appearance-none rounded border px-3 py-2 placeholder-gray-400 shadow-sm sm:text-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 ${
                              errors.password?.message
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          />
                          <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 text-gray-400 hover:text-gray-800 -translate-y-1/2 right-1.5 p-1 rounded flex items-center cursor-pointer hover:bg-gray-100"
                          >
                            {showPassword ? (
                              <EyeSlashIcon
                                className="h-5 w-5 "
                                aria-hidden="true"
                              />
                            ) : (
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </div>
                        </div>

                        {errors.password?.message && (
                          <p className="text-sm text-red-600">
                            {errors.password?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm new password
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            type={showCurrentPassword ? "text" : "password"}
                            autoComplete="off"
                            className={`block w-full appearance-none rounded border px-3 py-2 placeholder-gray-400 shadow-sm sm:text-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 ${
                              errors.confirmPassword?.message
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          />
                          <div
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute top-1/2 text-gray-400 hover:text-gray-800 -translate-y-1/2 right-1.5 p-1 rounded flex items-center cursor-pointer hover:bg-gray-100"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon
                                className="h-5 w-5 "
                                aria-hidden="true"
                              />
                            ) : (
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </div>
                        </div>

                        {errors.confirmPassword?.message && (
                          <p className="text-sm text-red-600">
                            {errors.confirmPassword?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting || isSuccess}
                          className="flex w-full items-center space-x-1 justify-center rounded border border-transparent bg-orange-600 py-2 px-4 text font-medium text-white shadow-sm enabled:hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-75"
                        >
                          {isSubmitting && (
                            <Spinner className="h-5 w-5 fill-current" />
                          )}
                          <span>Reset Password</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <p className="mx-auto w-full max-w-md px-4 sm:px-10">
                Your password has been sucessfully reset.
              </p>
            )}

            <div className="mt-8 text-center text-gray-700">
              <Link
                className="font-medium hover:underline hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 rounded"
                href="/auth/login"
              >
                ← Go to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
