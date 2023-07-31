import { SEO } from "@/components/common/seo";
import { UserCards } from "@/components/user/user-cards";
import {
  useCharacterByHandle,
  useFollowingCharactersOfCharacter,
  useFollowerCharactersOfCharacter,
} from "@crossbell/indexer";
import { useRouter } from "next/router";
import { LoadMore } from "../ui/load-more";
import { extractCharacterName } from "@crossbell/util-metadata";

export function UserFollowing(): JSX.Element {
  const {
    query: { id },
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(id as string);
  const characterName = extractCharacterName(character);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingRelation,
  } = useFollowingCharactersOfCharacter(character?.characterId);

  const characters =
    data?.pages
      .flatMap((page) => page.list)
      .flatMap((link) => link.toCharacter ?? []) ?? [];

  return (
    <>
      <SEO title={`People followed by ${characterName} (@${id}) / 4Real`} />
      <UserCards
        follow
        data={characters}
        type={"following"}
        loading={isLoading || isLoadingRelation}
      />
      <LoadMore {...{ hasNextPage, fetchNextPage }} />
    </>
  );
}

export function UserFollower(): JSX.Element {
  const {
    query: { id },
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(id as string);
  const characterName = extractCharacterName(character);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingRelation,
  } = useFollowerCharactersOfCharacter(character?.characterId);

  const characters =
    data?.pages
      .flatMap((page) => page.list)
      .flatMap((link) => link.fromCharacter ?? []) ?? [];

  return (
    <>
      <SEO title={`People followed by ${characterName} (@${id}) / 4Real`} />
      <UserCards
        follow
        data={characters}
        type={"following"}
        loading={isLoading || isLoadingRelation}
      />
      <LoadMore {...{ hasNextPage, fetchNextPage }} />
    </>
  );
}
