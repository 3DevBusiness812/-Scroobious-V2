import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import Link from "next/link";

const tabs = [
  {
    name: "Profile",
    href: "#profile-tab",
    icon: UserCircleIcon,
    component: ProfileTab,
  },
  {
    name: "Password",
    href: "#password-tab",
    icon: KeyIcon,
    component: PasswordTab,
  },
];
export default function AccountSettingsMain() {
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your Scroobious account and profile.
          </p>
        </div>
      </div>

      <main className="relative mt-8">
        <div className="bg-white w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
          <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            <aside className="lg:col-span-3 bg-gray-50 h-full">
              <nav className="space-y-1 lg:sticky top-0 self-start py-6">
                {tabs.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group cursor-pointer w-full border-l-4 px-4 py-2 flex items-center text-sm font-medium border-transparent hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 text-gray-500 focus:outline-none focus:ring-0"
                  >
                    <item.icon
                      className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </aside>

            <div className="divide-y divide-gray-200 lg:col-span-9">
              {tabs.map((item, ix) => (
                <div key={item.name}>
                  <item.component />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
