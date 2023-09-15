import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import Popover from "./Popover";
import StopImpersonationButton from "./StopImpersonationButton";

const navigation = [
  { name: "Written Feedback", href: "/admin/written-feedback" },
] as const;

type TNavItem = { name: string; href: string };

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const meQuery = trpc.user.me.useQuery();
  const { data: me, isFetched } = meQuery;

  if (!session) return <div />;

  const isActive = ({ href }: TNavItem) => router.pathname.startsWith(href);

  const userNavigation = [
    {
      name: "Account Settings",
      href: "/account-settings",
      splitter: true,
    },
    {
      name: "Privacy",
      target: "_new",
      href: "https://www.scroobious.com/privacy-policy",
    },
    {
      name: "Terms",
      target: "_new",
      href: "https://www.scroobious.com/termsofservice",
    },
    {
      name: "Support",
      target: "_new",
      href: "https://www.scroobious.com/support",
      splitter: true,
    },
    {
      name: "Sign out",
      onClick: async () => {
        await signOut({ redirect: false });
        router.push("/");
      },
    },
  ];

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm shrink-0 w-full sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-gray-300">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 w-full justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-7 w-auto lg:hidden"
                      src="/scroobious_logo.png"
                      alt="Scroobious"
                    />
                    <img
                      className="hidden h-7 w-auto lg:block"
                      src="/scroobious_logo.png"
                      alt="Scroobious"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-md font-medium ${
                          isActive(item)
                            ? "text-gray-900 border-orange-500"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 lg:rounded lg:py-1 lg:px-1.5 lg:hover:bg-gray-100 relative group">
                        <div className="w-8 h-8">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={me?.profilePicture?.url}
                            alt=""
                          />
                        </div>
                        <span className="hidden text-left text-sm font-medium text-gray-700 lg:block max-w-[150px]">
                          <span className="sr-only">Open user menu for </span>
                        </span>
                        <ChevronDownIcon
                          className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                          aria-hidden="true"
                        />
                        <div className="text-xs z-10 ui-open:hidden">
                          <Popover
                            x="align-right"
                            y="bottom"
                            className="group-hover:delay-75"
                          >
                            <span className="space-y-1">
                              <span className="opacity-90 text-left block whitespace-nowrap">
                                <div className="text-sm font-medium truncate">
                                  {me?.name}
                                </div>
                                <div className="text-xs gray-500 truncate">
                                  {me?.email}
                                </div>
                              </span>
                            </span>
                          </Popover>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map(
                          ({ name, href, onClick, target, splitter }) => (
                            <Menu.Item key={name}>
                              {({ active }) =>
                                target === "_new" || onClick ? (
                                  <a
                                    href={href}
                                    target={target}
                                    className={`cursor-pointer block px-4 py-2 text-sm text-gray-700 ${
                                      active ? "bg-gray-100" : ""
                                    } ${
                                      splitter
                                        ? "border-b border-b-gray-200"
                                        : ""
                                    }`}
                                    onClick={onClick}
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  <Link
                                    href={href!}
                                    key={name}
                                    className={`cursor-pointer block px-4 py-2 text-sm text-gray-700 ${
                                      active ? "bg-gray-100" : ""
                                    } ${
                                      splitter
                                        ? "border-b border-b-gray-200"
                                        : ""
                                    }`}
                                  >
                                    {name}
                                  </Link>
                                )
                              }
                            </Menu.Item>
                          )
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                    }}
                    className={`block w-full text-left border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                      isActive(item)
                        ? "bg-orange-50 border-orange-500 text-orange-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={me?.profilePicture?.url}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {me?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {me?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map(({ name, href, onClick, target }) =>
                    target === "_new" ? (
                      <Disclosure.Button
                        key={name}
                        as="a"
                        href={href}
                        target={target}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {name}
                      </Disclosure.Button>
                    ) : onClick ? (
                      <Disclosure.Button
                        key={name}
                        onClick={onClick}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {name}
                      </Disclosure.Button>
                    ) : (
                      <Disclosure.Button
                        key={name}
                        as="div"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        <Link className="block" href={href!}>
                          {name}
                        </Link>
                      </Disclosure.Button>
                    )
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <StopImpersonationButton />
    </>
  );
}
