import Link from "next/link";
import cn from "clsx";
import { truncateAddress } from "@crossbell/util-ethers";

type UserUsernameProps = {
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  username,
  className,
  disableLink,
}: UserUsernameProps): JSX.Element {
  return (
    <Link
      href={`/user/${username}`}
      className={cn(
        "truncate text-light-secondary dark:text-dark-secondary",
        className,
        disableLink && "pointer-events-none"
      )}
      tabIndex={-1}
    >
      @
      {username?.length >= 42
        ? truncateAddress(username, {
            start: 4,
            end: 4,
          })
        : username}
    </Link>
  );
}
