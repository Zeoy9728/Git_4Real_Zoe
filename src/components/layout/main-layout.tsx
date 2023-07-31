import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { DefaultToastOptions } from "react-hot-toast";
import type { LayoutProps } from "./common-layout";

const toastOptions: DefaultToastOptions = {
  style: {
    color: "white",
    borderRadius: "4px",
    backgroundColor: "rgb(var(--main-accent))",
  },
  success: { duration: 4000 },
};

export function MainLayout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="flex w-full justify-center gap-0 lg:gap-4">
      <Sidebar />
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={toastOptions}
        containerClassName="mb-12 xs:mb-0"
      />
    </div>
  );
}
