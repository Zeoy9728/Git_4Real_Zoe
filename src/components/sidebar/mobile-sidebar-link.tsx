import Link from "next/link";
import cn from "clsx";
import { preventBubbling } from "@/lib/utils";
import type { MobileNavLink } from "@/components/sidebar/mobile-sidebar-modal";
import { CustomIcon } from "../ui/custom-icon";

type MobileSidebarLinkProps = MobileNavLink & {
  bottom?: boolean;
};

export function MobileSidebarLink({
  href,
  bottom,
  linkName,
  iconName,
  disabled,
}: MobileSidebarLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      key={href}
      className={cn(
        `custom-button accent-tab accent-bg-tab flex items-center rounded-md font-bold 
         transition hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c]
         dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white`,
        bottom ? "gap-2 p-1.5 text-base" : "gap-4 p-2 text-xl",
        disabled && "cursor-not-allowed"
      )}
      onClick={disabled ? preventBubbling() : undefined}
    >
      <CustomIcon
        className={bottom ? "h-5 w-5" : "h-7 w-7"}
        iconName={iconName}
      />
      {linkName}
    </Link>
  );
}