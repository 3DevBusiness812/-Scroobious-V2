import Link from "next/link";
import { toast, type ToastOptions } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/utils/trpc";
import Spinner from "~/components/Spinner";
import { updatePasswordInput as formSchema } from "~/server/input";

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

export default function PasswordTab() {
  const utils = trpc.useContext();

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
      await utils.client.accountSettings.updatePassword.mutate(d);
      toast.success("Password successfully changed", TOAST_OPTIONS);
      reset();
    } catch (err) {
      toast.error(
        "Failed changing your password. Make sure your got the right old password.",
        TOAST_OPTIONS
      );
    }
  });

  return (
    <div id="password-tab">
      <form className="w-full divide-y divide-gray-200" onSubmit={onSubmit}>
        <div className="py-6 px-4 sm:p-6 lg:pb-8">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Password
            </h2>
            <p className="mt-1 text-sm text-gray-500">Change your password</p>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-6 space-y-1">
              <label
                htmlFor="old-password"
                className="block text-sm font-medium text-gray-700"
              >
                Old password
              </label>
              <input
                type="password"
                id="old-password"
                {...register("oldPassword")}
                autoComplete="current-password"
                className={`block w-full min-w-0 flex-grow rounded border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm ${
                  errors.oldPassword?.message
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.oldPassword?.message && (
                <p className="text-sm text-red-600">
                  {errors.oldPassword?.message}
                </p>
              )}
            </div>

            <div className="col-span-12 sm:col-span-6" />

            <div className="col-span-12 sm:col-span-6 space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                autoComplete="off"
                className={`block w-full min-w-0 flex-grow rounded border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm ${
                  errors.password?.message
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.password?.message && (
                <p className="text-sm text-red-600">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="col-span-12 sm:col-span-6" />

            <div className="col-span-12 sm:col-span-6 space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="off"
                {...register("confirmPassword")}
                className={`block w-full min-w-0 flex-grow rounded border-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus:ring-0 sm:text-sm ${
                  errors.confirmPassword?.message
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {errors.confirmPassword?.message && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-start items-center py-4 space-x-3">
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
              <span>Update password</span>
            </button>
            <Link
              className="text-gray-500 text-sm hover:text-gray-900 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-2"
              href="/auth/forgot-password"
            >
              I forgot my password
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
