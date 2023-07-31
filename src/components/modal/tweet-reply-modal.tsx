import { Input } from "@/components/input/input";
import { Tweet } from "@/components/tweet/tweet";
import { NoteEntity } from "crossbell";

type TweetReplyModalProps = {
  tweet: NoteEntity;
  username: string;
  handle: string;
  closeModal: () => void;
};

export function TweetReplyModal({
  tweet,
  username,
  handle,
  closeModal,
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{
        username,
        handle,
        characterId: tweet.characterId,
        noteId: tweet.noteId,
      }}
      closeModal={closeModal}
    >
      <Tweet modal parentTweet {...tweet} />
    </Input>
  );
}
