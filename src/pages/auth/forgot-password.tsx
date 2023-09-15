import { useState } from "react";
import { toast, type ToastOptions } from "react-toastify";
import Link from "next/link";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import { createPasswordResetInput as formSchema } from "~/server/input";

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

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const utils = trpc.useContext();

  const { data: me } = trpc.user.me.useQuery();

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
      await utils.client.auth.createPasswordReset.mutate({
        email: d.email ? d.email.toLowerCase() : d.email,
      });
      toast.success("Check your email for intructions", TOAST_OPTIONS);
      setIsSuccess(true);
    } catch (err) {
      toast.error("Something went wrong", TOAST_OPTIONS);
    }
  });

  return (
    <>
      <Head>
        <title>Forgot your password?</title>
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

            {!isSuccess ? (
              <>
                <p className="mx-auto w-full max-w-md px-4 sm:px-10">
                  Enter your email and we'll send you instructions on how to
                  reset your password.
                </p>

                <div className="mx-auto w-full max-w-md">
                  <div className="bg-white px-4 sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            type="text"
                            autoComplete="email"
                            defaultValue={me?.email}
                            {...register("email")}
                            className={`block w-full appearance-none rounded border px-3 py-2 placeholder-gray-400 shadow-sm sm:text-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 ${
                              errors.email?.message
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.email?.message && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email?.message}
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
              <>
                <p className="mx-auto w-full max-w-md px-4 sm:px-10">
                  We've sent you an email with instructions on how to reset your
                  password.
                </p>
              </>
            )}

            <div className="mt-8 text-center text-gray-700">
              <Link
                className="font-medium hover:underline hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 rounded"
                href={me?.email ? "/account-settings" : "/auth/login"}
              >
                {me?.email ? "← Back to account settings" : "← Back to login"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
