import cn from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { StatsEmpty } from "@/components/tweet/stats-empty";
import { Loading } from "@/components/ui/loading";
import { variants } from "@/components/user/user-header";
import { UserCard } from "./user-card";
import { CharacterEntity } from "crossbell";

type FollowType = "following" | "followers";

type CombinedTypes = FollowType;

type UserCardsProps = {
  data: CharacterEntity[];
  type: CombinedTypes;
  follow?: boolean;
  loading: boolean;
};

const allNoStatsData = {
  retweets: {
    title: "Amplify posts you like",
    imageData: { src: "/assets/no-retweets.png", alt: "No reposts" },
    description:
      "Share someone else’s post on your timeline by repost it. When you do, it’ll show up here.",
  },
  likes: {
    title: "No Posts Likes yet",
    imageData: { src: "/assets/no-likes.png", alt: "No likes" },
    description: "When you like a post, it’ll show up here.",
  },
  following: {
    title: "Be in the know",
    description:
      "Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.",
  },
  followers: {
    title: "Looking for followers?",
    imageData: { src: "/assets/no-followers.png", alt: "No followers" },
    description:
      "When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.",
  },
};

export function UserCards({
  data,
  type,
  loading,
}: UserCardsProps): JSX.Element {
  const noStatsData = allNoStatsData[type];
  const modal = ["retweets", "likes"].includes(type);

  return (
    <section
      className={cn(
        modal && "h-full overflow-y-auto [&>div:first-child>a]:mt-[52px]",
        loading && "flex items-center justify-center"
      )}
    >
      {loading ? (
        <Loading className={modal ? "mt-[52px]" : "mt-5"} />
      ) : (
        <AnimatePresence mode="popLayout">
          {data?.length ? (
            data.map((userData) => (
              <motion.div
                layout="position"
                key={userData.characterId}
                {...variants}
              >
                <UserCard {...userData} modal={modal} />
              </motion.div>
            ))
          ) : (
            <StatsEmpty {...noStatsData} modal={modal} />
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
