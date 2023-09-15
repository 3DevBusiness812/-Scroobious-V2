import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { env } from "~/env.mjs";
import Spinner from "~/components/Spinner";

const formSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters long" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (d) => {
    setIsSuccess(false);

    try {
      const result = await signIn("credentials", {
        ...d,
        email: d.email ? d.email.toLowerCase() : d.email,
        redirect: false,
      });

      if (result?.error) {
        setError("email", { message: "Invalid email/password." });
        setError("password", { message: "Invalid email/password." });
      } else {
        setIsSuccess(true);
        router.push("/");
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  });

  return (
    <>
      <Head>
        <title>Sign in to your account</title>
      </Head>
      <div className="h-screen md:grid md:grid-cols-2 gap-0">
        <div
          className="bg-cover bg-center bg-no-repeat w-0 md:w-full h-0 md:h-full"
          style={{
            backgroundImage: "url(/login_bg.png)",
          }}
        />
        <div className="h-full flex-col flex py-12">
          <div className="space-y-6 flex-col flex p-6 items-center">
            <Link href="/" className="">
              <img
                className="max-w-[225px] max-h-[100px] w-auto h-auto"
                loading="eager"
                src="/scroobious_logo.png"
                alt="Scroobious"
              />
            </Link>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>

            <div className="mt-8 mx-auto w-full max-w-md">
              <div className="bg-white py-8 px-4 sm:px-10">
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
                        {...register("email")}
                        className={`block w-full appearance-none rounded border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-0 sm:text-sm ${
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={`block w-full appearance-none rounded border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-0 sm:text-sm ${
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
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center" />

                    <div className="text-sm">
                      <Link
                        href="/auth/forgot-password"
                        className="font-medium text-gray-700 hover:text-gray-800 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 rounded"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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
                      <span>Sign in</span>
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center text-gray-700">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-medium hover:underline hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2 rounded"
                    href={env.NEXT_PUBLIC_SCROOBIOUS_PRICING_PAGE}
                  >
                    {" "}
                    Sign Up!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
