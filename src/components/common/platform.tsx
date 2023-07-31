import Image from "next/image";
import { HeroIcon } from "../ui/hero-icon";
import { platform } from "os";
import Link from "next/link";

export const PLATFORM_LIST = [
  "Telegram",
  "Twitter",
  "Pixiv",
  "Substack",
  "Medium",
  "Github",
  "Jike",
  "Bilibili",
  "Zhihu",
  "PlayStation",
  "nintendo switch",
  "Discord Server",
  "xiaoyuzhou",
  "Steam",
  "Gitlab",
  "keybase",
  "YouTube",
  "Facebook",
  "WhatsApp",
  "Mastodon",
  "Misskey",
  "Pleroma",
  "douban",
];

export const PlatformsSyncMap: {
  [key: string]: {
    name: string;
    icon: string;
    url?: string;
    identityFormatTemplate?: string;
  };
} = {
  telegram: {
    name: "Telegram",
    icon: "/social/telegram.svg",
    url: "https://t.me/{username}",
  },
  tg_channel: {
    name: "Telegram Channel",
    icon: "/social/telegram.svg",
    url: "https://t.me/{username}",
  },
  twitter: {
    name: "Twitter",
    icon: "/social/twitter.svg",
    url: "https://twitter.com/{username}",
  },
  twitter_id: {
    name: "Twitter",
    icon: "/social/twitter.svg",
    url: "https://twitter.com/i/user/{username}",
  },
  pixiv: {
    name: "Pixiv",
    icon: "/social/pixiv.ico",
    url: "https://www.pixiv.net/users/{username}",
  },
  substack: {
    name: "Substack",
    icon: "/social/substack.svg",
    url: "https://{username}.substack.com/",
  },
  medium: {
    name: "Medium",
    icon: "/social/medium.svg",
    url: "https://medium.com/@{username}",
  },
  github: {
    name: "GitHub",
    icon: "/social/github.svg",
    url: "https://github.com/{username}",
  },
  jike: {
    name: "Jike",
    icon: "/social/jike.png",
    url: "https://web.okjike.com/u/{username}",
  },
  bilibili: {
    name: "bilibili",
    icon: "/social/bilibili.svg",
    url: "https://space.bilibili.com/{username}",
  },
  zhihu: {
    name: "zhihu",
    icon: "/social/zhihu.svg",
    url: "https://www.zhihu.com/people/{username}",
  },
  playstation: {
    name: "PlayStation",
    icon: "/social/playstation.svg",
    url: "https://psnprofiles.com/{username}",
  },
  "nintendo switch": {
    name: "Nintendo Switch",
    icon: "/social/nintendo_switch.svg",
  },
  "discord server": {
    name: "Discord Server",
    icon: "/social/discord.svg",
    url: "https://discord.gg/{username}",
  },
  xiaoyuzhou: {
    name: "xiaoyuzhou FM",
    icon: "/social/xiaoyuzhou.png",
    url: "https://www.xiaoyuzhoufm.com/podcast/{username}",
  },
  steam: {
    name: "Steam",
    icon: "/social/steam.svg",
    url: "https://steamcommunity.com/id/{username}",
  },
  gitlab: {
    name: "Gitlab",
    icon: "/social/gitlab.svg",
    url: "https://gitlab.com/{username}",
  },
  keybase: {
    name: "Keybase",
    icon: "/social/keybase.png",
    url: "https://keybase.io/{username}",
  },
  youtube: {
    name: "Youtube",
    icon: "/social/youtube.svg",
    url: "https://youtube.com/@{username}",
  },
  facebook: {
    name: "Facebook",
    icon: "/social/facebook.svg",
    url: "https://facebook.com/{username}",
  },
  whatsapp: {
    name: "Whatsapp",
    icon: "/social/whatsapp.svg",
    url: "https://wa.me/{username}",
  },
  mastodon: {
    name: "Mastodon",
    icon: "/social/mastodon.svg",
    url: "https://{instance}/@{username}",
    identityFormatTemplate: "username@instance.ltd",
  },
  misskey: {
    name: "Misskey",
    icon: "/social/misskey.png",
    url: "https://{instance}/@{username}",
    identityFormatTemplate: "username@instance.ltd",
  },
  pleroma: {
    name: "Pleroma",
    icon: "/social/pleroma.svg",
    url: "https://{instance}/users/{username}",
    identityFormatTemplate: "username@instance.ltd",
  },
  douban: {
    name: "douban",
    icon: "/social/douban.png",
    url: "https://www.douban.com/people/{username}",
  },
};

export const Platform = ({
  platform,
  username,
}: {
  platform: string;
  username?: string;
  className?: string;
}) => {
  platform = platform.toLowerCase();
  let link = PlatformsSyncMap[platform]?.url;

  switch (platform) {
    case "mastodon":
    case "misskey":
    case "pleroma":
      const [uname, instance] = username?.split("@") || [];
      link = link?.replace("{instance}", instance).replace("{username}", uname);
      break;
    default:
      link = link?.replace("{username}", username || "");
      break;
  }

  return link ? (
    <Link href={link} target="_blank" aria-label={platform}>
      <Image
        src={PlatformsSyncMap[platform]?.icon}
        alt={platform}
        width={20}
        height={20}
      />
    </Link>
  ) : (
    <div className="w-5 h-5"></div>
  );
};
