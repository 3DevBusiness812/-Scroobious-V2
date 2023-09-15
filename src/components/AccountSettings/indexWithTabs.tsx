import { useState } from "react";
import { Transition, Tab } from "@headlessui/react";
import {
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import ProfileTab from "./ProfileTab";
// import AccountTab from "./AccountTab";
import PasswordTab from "./PasswordTab";
// import BillingTab from "./BillingTab";

const tabs = [
  { name: "Profile", href: "#", icon: UserCircleIcon, component: ProfileTab },
  // { name: "Account", href: "#", icon: CogIcon, component: AccountTab },
  { name: "Password", href: "#", icon: KeyIcon, component: PasswordTab },
  // {
  //   name: "Subscription",
  //   href: "#",
  //   icon: CreditCardIcon,
  //   component: BillingTab,
  // },
];
export default function AccountSettingsMain() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="flex-1 flex max-w-7xl px-4 sm:px-6 lg:px-8 z-0 m-auto">
      <div className="py-4 sm:py-6 lg:py-8 w-full">
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
          <div className="overflow-hidden bg-white w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
            <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                <Tab.List as="aside" className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    {tabs.map((item) => (
                      <Tab
                        key={item.name}
                        className="group w-full border-l-4 px-3 py-2 flex items-center text-sm font-medium ui-selected:bg-orange-50 ui-selected:border-orange-500 ui-selected:text-orange-700 ui-selected:hover:bg-orange-50 ui-selected:hover:text-orange-700 ui-not-selected:border-transparent ui-not-selected:text-gray-900 ui-not-selected:hover:bg-gray-50 ui-not-selected:hover:text-gray-900 focus:outline-none focus:ring-0"
                      >
                        <item.icon
                          className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 ui-selected:text-orange-500 ui-selected:group-hover:text-orange-500 ui-not-selected:text-gray-400 ui-not-selected:group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </Tab>
                    ))}
                  </nav>
                </Tab.List>

                <div className="divide-y divide-gray-200 lg:col-span-9">
                  <Tab.Panels>
                    {tabs.map((item, ix) => (
                      <Tab.Panel key={item.name}>
                        <Transition
                          appear
                          show={tabIndex === ix}
                          enter="transition-opacity duration-500"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition-opacity duration-500"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <item.component />
                        </Transition>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </div>
              </div>
            </Tab.Group>
          </div>
        </main>
      </div>
    </div>
  );
}
