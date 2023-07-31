import { UserProfile } from "@/components/user/user-profile";
import { Button } from "@/components/ui/button";
import { useAccountState, useConnectModal } from "@crossbell/connect-kit";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const connectModal = useConnectModal();
  const [isConnected] = useAccountState(({ computed }) => [!!computed.account]);

  // function randomWord() {
  //   const words = [
  //     "Adventure",
  //     "Dream",
  //     "Passion",
  //     "Connection",
  //     "Story",
  //     "Everything",
  //     "Love",
  //     "Journey",
  //     "innovation",
  //   ];
  //   let result = "";
  //   for (let i = 0; i < 1; i++) {
  //     result += words[Math.floor(Math.random() * words.length)] + " ";
  //   }
  //   return result.trim();
  // }

  // const words = [
  //   "Adventure",
  //   "Dream",
  //   "Passion",
  //   "Connection",
  //   "Story",
  //   "Everything",
  //   "Love",
  //   "Journey",
  //   "innovation",
  // ];

  // const [randomWords, setRandomWords] = useState("");

  // useEffect(() => {
  //   setRandomWords(randomWord());
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRandomWords(words[Math.floor(Math.random() * words.length)]);
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-8">
      {/* <h1 className="text-3xl font-bold">4Real is {randomWords} 4real!</h1> */}
      {!isConnected ? (
        <Button
          className="accent-tab absolute -translate-y-[72px] bg-main-accent text-lg font-bold text-white
                     outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:w-40
                     xs:translate-y-0 xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75"
          onClick={connectModal.show}
        >
          <p className="block">Connect</p>
        </Button>
      ) : (
        <div className="xl:w-60">
          <UserProfile />
        </div>
      )}
      {isConnected && (
        <Link className="text-lg" href="/home">
          Start to explore 🥳
        </Link>
      )}
    </div>
  );
}
