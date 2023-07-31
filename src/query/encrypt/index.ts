import { useQuery } from "@tanstack/react-query";
import { useAccountState } from "@crossbell/connect-kit";

export const BACKEND_ENDPOINT = "https://api.4real.is";

export function useDecrypt() {
  const newbieToken = useAccountState((s) => s.email?.token);
  const siweToken = useAccountState((s) => s.wallet?.siwe?.token);

  return useQuery(
    ["decrypt"],
    async () => {
      const raw = await fetch(`${BACKEND_ENDPOINT}/get_key`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${newbieToken || siweToken}`,
        },
      });
      return raw.json();
    },
    {
      enabled: !!newbieToken || !!siweToken,
    }
  );
}
