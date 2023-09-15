import { ReactNode } from "react";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";

type TAuthedWithNavbarProps = {
  children: ReactNode;
};

export default function AuthedWithNavbar({ children }: TAuthedWithNavbarProps) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center bg-gray-100 relative">
      <NavBar />
      <div className="flex-1 flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-0 m-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}
